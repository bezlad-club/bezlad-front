import { client } from "./sanityServerClient";

import {
  PROMO_CODE_BY_CODE_QUERY,
  PROMO_CODE_BY_ID_QUERY,
  ACTIVE_RESERVATIONS_COUNT_QUERY,
  RESERVATION_BY_ID_QUERY,
  PROMO_CODE_BY_ID_TYPE_ONLY_QUERY
} from "./queries";

export interface PromoCode {
  _id: string;
  code: string;
  discountPercent: number;
  type: 'reusable' | 'personal';
  usageLimit?: number;
  usageCount: number;
}

export class PromoCodeError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PromoCodeError';
  }
}

export const promoCodeService = {
  async validate(code: string) {
    const promo = await client.fetch<PromoCode>(PROMO_CODE_BY_CODE_QUERY, { code });

    if (!promo) {
      throw new PromoCodeError("Промокод не знайдено", "NOT_FOUND");
    }

    // Basic checks
    const now = new Date();
    // Fetch full doc to check dates as string/dates might need parsing if not typed
    // But in Sanity queries we can filter by dates too. 
    // Let's do a more robust query next time, but for now logic here:
    
    // We need to re-fetch with more fields to be safe or update the interface
    const fullPromo = await client.fetch(PROMO_CODE_BY_ID_QUERY, { id: promo._id });
    
    if (!fullPromo.isActive) {
      throw new PromoCodeError("Промокод неактивний", "INACTIVE");
    }

    if (fullPromo.validFrom && new Date(fullPromo.validFrom) > now) {
      throw new PromoCodeError("Термін дії промокоду ще не настав", "NOT_STARTED");
    }

    if (fullPromo.validUntil && new Date(fullPromo.validUntil) < now) {
      throw new PromoCodeError("Термін дії промокоду закінчився", "EXPIRED");
    }

    if (fullPromo.usageLimit && fullPromo.usageCount >= fullPromo.usageLimit) {
      throw new PromoCodeError("Ліміт використання вичерпано", "LIMIT_REACHED");
    }

    // Check active reservations
    // We count 'reserved' status where validUntil is in the future
    const activeReservationsCount = await client.fetch(
      ACTIVE_RESERVATIONS_COUNT_QUERY,
      { id: promo._id }
    );

    // If it's a personal code (limit 1 implicitly or explicitly) or has a limit
    // We check if (current_usage + reserved) >= limit
    const limit = fullPromo.usageLimit || (fullPromo.type === 'personal' ? 1 : Infinity);
    
    if (fullPromo.usageCount + activeReservationsCount >= limit) {
      throw new PromoCodeError("Промокод тимчасово зарезервований або використаний", "TEMPORARILY_UNAVAILABLE");
    }

    return {
      isValid: true,
      discountPercent: fullPromo.discountPercent,
      code: fullPromo.code,
      _id: fullPromo._id
    };
  },

  async reserve(code: string) {
    // 1. Validate again to prevent race conditions (mostly)
    const validResult = await this.validate(code);
    
    // 2. Create reservation
    const validMinutes = 30;
    const validUntil = new Date(Date.now() + validMinutes * 60 * 1000).toISOString();

    const reservation = await client.create({
      _type: 'promoCodeReservation',
      promoCode: { _ref: validResult._id, _type: 'reference' },
      status: 'reserved',
      reservedAt: new Date().toISOString(),
      validUntil,
    });

    return {
      reservationId: reservation._id,
      validUntil,
      discountPercent: validResult.discountPercent
    };
  },

  async confirm(reservationId: string, orderReference: string) {
    const reservation = await client.fetch(
      RESERVATION_BY_ID_QUERY,
      { id: reservationId }
    );

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.status === 'confirmed') {
      return; // Already confirmed
    }

    // Transaction to update reservation and increment usage count
    const transaction = client.transaction();

    transaction.patch(reservationId, (p) => 
      p.set({ 
        status: 'confirmed', 
        orderReference // Link if not linked yet
      })
    );

    transaction.patch(reservation.promoCode._ref, (p) => 
      p.inc({ usageCount: 1 })
    );

    // Check if we need to deactivate personal code
    // (Actually usageLimit handling covers it, but user said "status cancelled" explicitly)
    // Let's stick to usageLimit logic primarily, but if type is personal, we might want to set isActive=false?
    // User said: "промокод может быть выдан персонально(просто один после первого использования статус cancelled)"
    // Fetch type
    const promo = await client.fetch(PROMO_CODE_BY_ID_TYPE_ONLY_QUERY, { id: reservation.promoCode._ref });
    if (promo.type === 'personal') {
       transaction.patch(reservation.promoCode._ref, (p) => p.set({ isActive: false }));
    }

    await transaction.commit();
  },

  async cancel(reservationId: string) {
     return client.patch(reservationId).set({ status: 'cancelled' }).commit();
  }
};
