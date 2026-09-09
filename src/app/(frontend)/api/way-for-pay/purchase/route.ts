import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { getPayloadClient } from "@/lib/payload";
import { promoCodeService } from "@/lib/promoCodeService";
import {
  SlotBookingError,
  formatVisitLabel,
  slotBookingService,
} from "@/lib/slotBookingService";
import type { PromoCodeReservation } from "@/payload-types";

const MERCHANT_ACCOUNT = process.env.MERCHANT_ACCOUNT;
const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

// Simple ticket item: { id, quantity }
interface SimpleCartItem {
  id: number;
  quantity: number;
}

// Slotted ticket item: { id, slotId, date, childrenQty, adultsQty }
interface SlottedCartItem {
  id: number;
  slotId: number;
  date: string;
  childrenQty: number;
  adultsQty: number;
}

type CartItemInput = SimpleCartItem | SlottedCartItem;

function isSlottedCartItem(item: CartItemInput): item is SlottedCartItem {
  return "slotId" in item && "date" in item;
}

function roundToCoins(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function POST(req: NextRequest) {
  if (!MERCHANT_ACCOUNT || !MERCHANT_SECRET_KEY || !SITE_URL) {
    console.error("Missing environment variables for WayForPay");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { cartItems, clientInfo, promo } = body;
    let reservationId: number | undefined;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = cartItems
      .filter((item: CartItemInput) => item?.id)
      .map((item: CartItemInput) => item.id);

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart data: missing product IDs" },
        { status: 400 }
      );
    }

    if (promo) {
      try {
        const newReservation = await promoCodeService.reserve(promo);
        reservationId = newReservation.reservationId;
      } catch (err: unknown) {
        // If promo code fails (invalid, limit reached, etc.), we return error immediately
        const errorMessage =
          err instanceof Error ? err.message : "Invalid promo code";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }
    }

    // 1. Validate Reservation if present
    let discountPercent = 0;
    let applicableServices: number[] = [];
    let promoValidUntilMs: number | null = null;
    let orderTimeout = 43200; // Default 12 hours if no promo code
    const payload = await getPayloadClient();

    if (reservationId) {
      let reservation: PromoCodeReservation | null = null;
      try {
        reservation = await payload.findByID({
          collection: "promoCodeReservation",
          id: reservationId,
          depth: 1,
        });
      } catch {
        reservation = null;
      }

      if (!reservation) {
        return NextResponse.json(
          { error: "Reservation not found" },
          { status: 400 }
        );
      }
      if (reservation.status !== "reserved") {
        return NextResponse.json(
          { error: "Reservation is not active" },
          { status: 400 }
        );
      }

      const now = new Date();
      const validUntil = new Date(reservation.validUntil);

      if (validUntil < now) {
        return NextResponse.json(
          { error: "Reservation expired" },
          { status: 400 }
        );
      }

      // Set timeout to remaining seconds of reservation
      const diffSeconds = Math.floor(
        (validUntil.getTime() - now.getTime()) / 1000
      );
      if (diffSeconds <= 0) {
        return NextResponse.json(
          { error: "Reservation expired just now" },
          { status: 400 }
        );
      }

      const reservationPromo = typeof reservation.promoCode === "object" ? reservation.promoCode : null;
      const reservationApplicableServices = (reservationPromo?.applicableServices ?? []).map((s) => {
        return typeof s === "number" ? s : s.id;
      });

      // Check if promo applies to ANY item in the cart
      const cartHasApplicableItems = reservationApplicableServices.some(
        (serviceId) => productIds.includes(serviceId)
      );

      // If no items in cart match the promo's applicable services, we ignore the promo
      // but we do NOT throw error to let purchase proceed without discount
      if (!cartHasApplicableItems) {
        console.warn(
          "Promo code ignored: no applicable items in cart for reservation",
          reservationId
        );
        discountPercent = 0;
        applicableServices = [];
        // Revert to default timeout since promo is effectively not used
        orderTimeout = 43200;
      } else {
        discountPercent = Math.min(
          Math.max(reservationPromo?.discountPercent ?? 0, 0),
          100
        );
        applicableServices = reservationApplicableServices;
        orderTimeout = diffSeconds;
        promoValidUntilMs = diffSeconds * 1000;
      }
    }

    // Fetch actual services from Payload using only IDs
    const servicesResult = await payload.find({
      collection: "service",
      where: { id: { in: productIds } },
      limit: 1000,
      depth: 0,
    });

    const servicesMap = new Map(servicesResult.docs.map((s) => [s.id, s]));

    const merchantDomainName = SITE_URL;
    const orderReference = `ORDER_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;
    const orderDate = Math.floor(Date.now() / 1000);
    const currency = "UAH";

    // Reserve capacity for slotted items (one SlotBooking per cart item).
    // validUntil matches the promo reservation TTL flow when a promo is used,
    // otherwise the default slot reservation TTL (30 minutes) applies.
    const slotReservations = new Map<
      number,
      Awaited<ReturnType<typeof slotBookingService.reserve>>
    >();

    for (let index = 0; index < cartItems.length; index++) {
      const item = cartItems[index] as CartItemInput;
      if (!isSlottedCartItem(item)) continue;

      const service = servicesMap.get(item.id);

      if (!service) {
        console.error(`Service not found in Payload: ${item.id}`);
        return NextResponse.json(
          { error: `Service not found: ${item.id}` },
          { status: 400 }
        );
      }

      if (service.type !== "slotted") {
        return NextResponse.json(
          { error: `Service does not support time slots: ${item.id}` },
          { status: 400 }
        );
      }

      try {
        const reservation = await slotBookingService.reserve({
          serviceId: item.id,
          slotId: item.slotId,
          dateIso: item.date,
          childrenQty: item.childrenQty,
          adultsQty: item.adultsQty,
          orderReference,
          clientInfo,
          validUntilMs: promoValidUntilMs ?? undefined,
        });
        slotReservations.set(index, reservation);
      } catch (err: unknown) {
        if (err instanceof SlotBookingError) {
          return NextResponse.json({ error: err.message }, { status: 400 });
        }
        throw err;
      }
    }

    const productNames: string[] = [];
    const productCounts: number[] = [];
    const productPrices: number[] = [];
    let totalAmount = 0;

    for (let index = 0; index < cartItems.length; index++) {
      const item = cartItems[index] as CartItemInput;
      const service = servicesMap.get(item.id);

      if (!service) {
        console.error(`Service not found in Payload: ${item.id}`);
        return NextResponse.json(
          { error: `Service not found: ${item.id}` },
          { status: 400 }
        );
      }

      if (isSlottedCartItem(item)) {
        const reservation = slotReservations.get(index);

        if (!reservation) {
          return NextResponse.json(
            { error: `Slot reservation not found for service: ${item.id}` },
            { status: 400 }
          );
        }

        const promoApplies =
          discountPercent > 0 &&
          applicableServices.length > 0 &&
          applicableServices.includes(item.id);
        const discountFactor = promoApplies
          ? 1 - discountPercent / 100
          : 1;

        const childPrice = roundToCoins(
          reservation.slot.price * discountFactor
        );
        const adultPrice = roundToCoins(
          reservation.slot.adultPrice * discountFactor
        );

        const shortTitle =
          service.title.length > 40
            ? `${service.title.slice(0, 40).trimEnd()}...`
            : service.title;
        const visitLabel = formatVisitLabel(
          item.date,
          reservation.slot.startTime,
          reservation.slot.endTime
        );

        const buildLineName = (visitorsGroup: string) =>
          `${shortTitle} — ${visitLabel} (${visitorsGroup}) — код ${
            reservation.booking.ticketCode
          }`.replace(/;/g, " ");

        productNames.push(buildLineName("діти"));
        productCounts.push(item.childrenQty);
        productPrices.push(childPrice);
        totalAmount += childPrice * item.childrenQty;

        if (item.adultsQty > 0) {
          productNames.push(buildLineName("дорослі"));
          productCounts.push(item.adultsQty);
          productPrices.push(adultPrice);
          totalAmount += adultPrice * item.adultsQty;
        }

        continue;
      }

      if (typeof service.price !== "number") {
        return NextResponse.json(
          { error: `Service price is missing: ${item.id}` },
          { status: 400 }
        );
      }

      let price = service.price;

      // Apply discount per item
      if (discountPercent > 0) {
        if (
          applicableServices &&
          applicableServices.length > 0 &&
          applicableServices.includes(item.id)
        ) {
          price = roundToCoins(price * (1 - discountPercent / 100));
        }
      }

      // Ensure title matches Payload and clean it
      const name = service.title.replace(/;/g, " ");

      productNames.push(name);
      productCounts.push(item.quantity);
      productPrices.push(price);

      totalAmount += price * item.quantity;
    }

    // Format amounts to 2 decimal places
    const formattedAmount = totalAmount.toFixed(2);
    const formattedPrices = productPrices.map((p) => p.toFixed(2));

    // Link Order to Reservation in Payload
    if (reservationId) {
      await payload.update({
        collection: "promoCodeReservation",
        id: reservationId,
        data: {
          orderReference,
          finalAmount: Number(formattedAmount),
        },
      });
    }

    // Lazy cleanup of expired reservations (limited to 10 to be fast)
    // Using 'after' to run this in the background without blocking the response
    after(promoCodeService.cleanupExpired);
    after(slotBookingService.cleanupExpired);

    // Signature generation
    // merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;productName;productCount;productPrice
    const signString = [
      MERCHANT_ACCOUNT,
      merchantDomainName,
      orderReference,
      orderDate,
      formattedAmount,
      currency,
      ...productNames,
      ...productCounts,
      ...formattedPrices,
    ].join(";");

    const hmac = crypto.createHmac("md5", MERCHANT_SECRET_KEY);
    hmac.update(signString, "utf8");
    const merchantSignature = hmac.digest("hex");

    // Prepare data for WayForPay request
    const params = {
      merchantAccount: MERCHANT_ACCOUNT,
      merchantAuthType: "SimpleSignature",
      merchantDomainName: merchantDomainName,
      merchantSignature,
      orderReference,
      orderDate,
      amount: formattedAmount,
      currency,
      productName: productNames,
      productPrice: formattedPrices,
      productCount: productCounts,
      clientFirstName: clientInfo?.name,
      clientPhone: clientInfo?.phone,
      clientEmail: clientInfo?.email,
      defaultPaymentSystem: "card",
      orderTimeout,
      returnUrl: `https://${SITE_URL}/api/confirmation`,
      serviceUrl: `https://${SITE_URL}/api/way-for-pay/callback`,
    };

    // Send request to WayForPay to get the payment URL
    // Using behavior=offline to get a JSON response with the URL
    const response = await axios.post(
      "https://secure.wayforpay.com/pay?behavior=offline",
      params,
      {
        headers: {
          // WayForPay usually expects form data
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data && response.data.url) {
      return NextResponse.json({ url: response.data.url });
    } else {
      console.error("Unexpected response from WayForPay:", response.data);
      return NextResponse.json(
        { error: "Failed to generate payment URL", details: response.data },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
