import crypto from "crypto";
import type { Payload } from "payload";
import type { ServiceSlot } from "@/payload-types";
import { getPayloadClient } from "./payload";

export class SlotBookingError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SlotBookingError';
  }
}

// Reservation TTL, kept consistent with the promo code reservation timeout
export const RESERVATION_TTL_MINUTES = 30;

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// Indexed by JS Date.getUTCDay()
const JS_DAY_TO_WEEKDAY: Weekday[] = [
  'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat',
];

const WEEKDAY_SHORT_UK: Record<Weekday, string> = {
  mon: 'пн',
  tue: 'вт',
  wed: 'ср',
  thu: 'чт',
  fri: 'пт',
  sat: 'сб',
  sun: 'нд',
};

const TICKET_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const TICKET_CODE_LENGTH = 8;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface ReserveSlotArgs {
  serviceId?: number;
  slotId: number;
  dateIso: string;
  childrenQty: number;
  adultsQty: number;
  orderReference: string;
  clientInfo?: { name?: string; phone?: string; email?: string } | null;
  validUntilMs?: number;
}

function getWeekday(dateIso: string): Weekday {
  return JS_DAY_TO_WEEKDAY[new Date(`${dateIso}T00:00:00.000Z`).getUTCDay()];
}

// "13.09 (сб) 10:00-14:30" — used in WayForPay product names / receipts
export function formatVisitLabel(
  dateIso: string,
  startTime: string,
  endTime: string
): string {
  const [, month, day] = dateIso.split("-");
  return `${day}.${month} (${WEEKDAY_SHORT_UK[getWeekday(dateIso)]}) ${startTime}-${endTime}`;
}

function randomTicketCode(): string {
  let code = "";
  for (let i = 0; i < TICKET_CODE_LENGTH; i++) {
    code += TICKET_ALPHABET[crypto.randomInt(TICKET_ALPHABET.length)];
  }
  return code;
}

// Sum of CHILDREN quantities of ACTIVE bookings (confirmed, or reserved with
// validUntil in the future) per slot for the given calendar date.
// Adults are not limited and do not count against slot capacity.
async function getBookedChildrenQuantities(
  payload: Payload,
  slotIds: number[],
  dateIso: string
): Promise<Map<number, number>> {
  const dayStart = new Date(`${dateIso}T00:00:00.000Z`).toISOString();
  const dayEnd = new Date(
    new Date(`${dateIso}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000
  ).toISOString();
  const now = new Date().toISOString();

  const { docs } = await payload.find({
    collection: 'slotBooking',
    where: {
      and: [
        { slot: { in: slotIds } },
        { date: { greater_than_equal: dayStart } },
        { date: { less_than: dayEnd } },
        {
          or: [
            { status: { equals: 'confirmed' } },
            {
              and: [
                { status: { equals: 'reserved' } },
                { validUntil: { greater_than: now } },
              ],
            },
          ],
        },
      ],
    },
    limit: 1000,
    depth: 0,
  });

  const booked = new Map<number, number>();
  for (const booking of docs) {
    const slotId =
      typeof booking.slot === 'object' && booking.slot
        ? booking.slot.id
        : booking.slot;
    if (typeof slotId !== 'number') {
      continue;
    }
    booked.set(
      slotId,
      (booked.get(slotId) ?? 0) + (booking.childrenQty ?? 0)
    );
  }
  return booked;
}

async function generateUniqueTicketCode(payload: Payload): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = randomTicketCode();
    const { totalDocs } = await payload.count({
      collection: 'slotBooking',
      where: { ticketCode: { equals: candidate } },
    });
    if (totalDocs === 0) {
      return candidate;
    }
  }
  throw new SlotBookingError(
    "Не вдалося згенерувати код квитка, спробуйте ще раз",
    "CODE_GENERATION_FAILED"
  );
}

export const slotBookingService = {
  async getAvailableSlots(serviceId: number, dateIso: string) {
    const payload = await getPayloadClient();

    if (!DATE_PATTERN.test(dateIso)) {
      throw new SlotBookingError(
        "Некоректна дата відвідування",
        "DATE_NOT_AVAILABLE"
      );
    }

    const { docs: slots } = await payload.find({
      collection: 'serviceSlot',
      where: { service: { equals: serviceId } },
      limit: 100,
      depth: 0,
    });

    const weekday = getWeekday(dateIso);
    const matchingSlots = slots.filter((slot) =>
      (slot.weekdays ?? []).map(String).includes(weekday)
    );

    if (matchingSlots.length === 0) {
      return [];
    }

    const booked = await getBookedChildrenQuantities(
      payload,
      matchingSlots.map((slot) => slot.id),
      dateIso
    );

    return matchingSlots
      .map((slot) => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
        adultPrice: slot.adultPrice,
        capacity: slot.capacity,
        // Remaining CHILD places: adults are unlimited and never counted
        remaining: Math.max(
          slot.capacity - (booked.get(slot.id) ?? 0),
          0
        ),
      }))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  async reserve({
    serviceId,
    slotId,
    dateIso,
    childrenQty,
    adultsQty,
    orderReference,
    clientInfo,
    validUntilMs,
  }: ReserveSlotArgs) {
    const payload = await getPayloadClient();

    const children = Number(childrenQty);
    const adults = Number(adultsQty);

    if (!Number.isInteger(children) || children < 1) {
      throw new SlotBookingError(
        "Кількість дітей має бути цілим числом не менше 1",
        "INVALID_QUANTITY"
      );
    }

    if (!Number.isInteger(adults) || adults < 0) {
      throw new SlotBookingError(
        "Кількість дорослих має бути цілим числом від 0 і більше",
        "INVALID_QUANTITY"
      );
    }

    if (!DATE_PATTERN.test(dateIso)) {
      throw new SlotBookingError(
        "Некоректна дата відвідування",
        "DATE_NOT_AVAILABLE"
      );
    }

    const visitDate = new Date(`${dateIso}T00:00:00.000Z`);
    if (Number.isNaN(visitDate.getTime())) {
      throw new SlotBookingError(
        "Некоректна дата відвідування",
        "DATE_NOT_AVAILABLE"
      );
    }

    let slot: ServiceSlot | null = null;
    try {
      slot = await payload.findByID({
        collection: 'serviceSlot',
        id: slotId,
        depth: 0,
      });
    } catch {
      slot = null;
    }

    if (!slot) {
      throw new SlotBookingError("Слот не знайдено", "SLOT_NOT_FOUND");
    }

    const slotServiceId =
      typeof slot.service === 'object' ? slot.service.id : slot.service;

    if (
      serviceId !== undefined &&
      Number(serviceId) !== Number(slotServiceId)
    ) {
      throw new SlotBookingError(
        "Слот не належить обраній послузі",
        "SLOT_SERVICE_MISMATCH"
      );
    }

    const weekday = getWeekday(dateIso);
    if (!(slot.weekdays ?? []).map(String).includes(weekday)) {
      throw new SlotBookingError(
        "Слот недоступний у обраний день",
        "DATE_NOT_AVAILABLE"
      );
    }

    // Capacity check right before create (count-based approach, consistent
    // with promoCodeService — no DB transactions). Only CHILDREN count
    // against slot capacity; adults are unlimited (used for pricing only).
    const booked = await getBookedChildrenQuantities(payload, [slot.id], dateIso);
    if (children > slot.capacity - (booked.get(slot.id) ?? 0)) {
      throw new SlotBookingError(
        "Недостатньо вільних місць для дітей на обраний слот",
        "CAPACITY_EXCEEDED"
      );
    }

    const ttlMs =
      typeof validUntilMs === 'number' && validUntilMs > 0
        ? validUntilMs
        : RESERVATION_TTL_MINUTES * 60 * 1000;
    const validUntil = new Date(Date.now() + ttlMs).toISOString();

    const ticketCode = await generateUniqueTicketCode(payload);

    const booking = await payload.create({
      collection: 'slotBooking',
      data: {
        slot: slot.id,
        service: slotServiceId,
        // Midday UTC keeps the calendar date stable across timezones
        date: `${dateIso}T12:00:00.000Z`,
        childrenQty: children,
        adultsQty: adults,
        totalAmount: Number(
          (slot.price * children + slot.adultPrice * adults).toFixed(2)
        ),
        status: 'reserved',
        validUntil,
        orderReference,
        ticketCode,
        clientName: clientInfo?.name,
        clientPhone: clientInfo?.phone,
        clientEmail: clientInfo?.email,
      },
    });

    return { booking, slot };
  },

  async confirm(orderReference: string) {
    const payload = await getPayloadClient();

    const { docs } = await payload.find({
      collection: 'slotBooking',
      where: {
        and: [
          { orderReference: { equals: orderReference } },
          { status: { equals: 'reserved' } },
        ],
      },
      limit: 100,
      depth: 0,
    });

    let confirmedCount = 0;
    for (const booking of docs) {
      await payload.update({
        collection: 'slotBooking',
        id: booking.id,
        data: { status: 'confirmed' },
      });
      confirmedCount++;
    }

    return confirmedCount;
  },

  async cancel(orderReference: string) {
    const payload = await getPayloadClient();

    const { docs } = await payload.find({
      collection: 'slotBooking',
      where: {
        and: [
          { orderReference: { equals: orderReference } },
          { status: { equals: 'reserved' } },
        ],
      },
      limit: 100,
      depth: 0,
    });

    let cancelledCount = 0;
    for (const booking of docs) {
      await payload.update({
        collection: 'slotBooking',
        id: booking.id,
        data: { status: 'cancelled' },
      });
      cancelledCount++;
    }

    return cancelledCount;
  },

  async cleanupExpired() {
    try {
      const payload = await getPayloadClient();

      const now = new Date();

      const { docs } = await payload.find({
        collection: 'slotBooking',
        where: {
          and: [
            { status: { equals: 'reserved' } },
            { validUntil: { less_than: now } },
          ],
        },
        limit: 10,
        depth: 0,
      });

      for (const booking of docs) {
        await payload.update({
          collection: 'slotBooking',
          id: booking.id,
          data: { status: 'cancelled' },
        });
      }
    } catch (error) {
      console.error("Error cleaning up expired slot bookings:", error);
      // Fails silently to not disrupt the main flow
    }
  },

  async getByTicketCode(code: string) {
    const payload = await getPayloadClient();

    const { docs } = await payload.find({
      collection: 'slotBooking',
      where: { ticketCode: { equals: code } },
      limit: 1,
      depth: 1,
    });

    return docs[0] ?? null;
  },
};
