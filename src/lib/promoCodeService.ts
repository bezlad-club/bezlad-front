import { client } from "./sanityServerClient";

import {
  PROMO_CODE_VALIDATION_QUERY,
  RESERVATION_BY_ID_QUERY,
  PROMO_CODE_BY_ID_TYPE_ONLY_QUERY,
  EXPIRED_RESERVATIONS_QUERY
} from "./queries";

export interface PromoCode {
  _id: string;
  code: string;
  discountPercent: number;
  type: 'reusable' | 'personal';
  usageLimit?: number;
  usageCount: number;
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string;
  activeReservationsCount: number;
  applicableServices?: string[];
}

export class PromoCodeError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PromoCodeError';
  }
}

export const promoCodeService = {
  async validate(code: string) {
    const promo = await client.fetch<PromoCode>(PROMO_CODE_VALIDATION_QUERY, { code });

    if (!promo) {
      throw new PromoCodeError("Промокод не знайдено", "NOT_FOUND");
    }

    // Basic checks
    const now = new Date();

    if (!promo.isActive) {
      throw new PromoCodeError("Промокод неактивний", "INACTIVE");
    }

    if (promo.validFrom && new Date(promo.validFrom) > now) {
      throw new PromoCodeError("Термін дії промокоду ще не настав", "NOT_STARTED");
    }

    if (promo.validUntil && new Date(promo.validUntil) < now) {
      throw new PromoCodeError("Термін дії промокоду закінчився", "EXPIRED");
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      throw new PromoCodeError("Ліміт використання вичерпано", "LIMIT_REACHED");
    }

    // Check active reservations
    // We count 'reserved' status where validUntil is in the future
    const activeReservationsCount = promo.activeReservationsCount || 0;

    // If it's a personal code (limit 1 implicitly or explicitly) or has a limit
    // We check if (current_usage + reserved) >= limit
    const limit = promo.usageLimit || (promo.type === 'personal' ? 1 : Infinity);
    
    if (promo.usageCount + activeReservationsCount >= limit) {
      throw new PromoCodeError("Промокод тимчасово зарезервований або використаний", "TEMPORARILY_UNAVAILABLE");
    }

    if (!promo.applicableServices || promo.applicableServices.length === 0) {
      throw new PromoCodeError("Промокод не застосовується до жодної послуги", "NO_SERVICES");
    }

    return {
      isValid: true,
      discountPercent: promo.discountPercent,
      code: promo.code,
      _id: promo._id,
      applicableServices: promo.applicableServices,
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
    const promo = await client.fetch(PROMO_CODE_BY_ID_TYPE_ONLY_QUERY, { id: reservation.promoCode._ref });
    if (promo.type === 'personal') {
       transaction.patch(reservation.promoCode._ref, (p) => p.set({ isActive: false }));
    }

    await transaction.commit();
  },

  async cancel(reservationId: string) {
     return client.patch(reservationId).set({ status: 'cancelled' }).commit();
  },

  async cleanupExpired() {
    try {
      const expiredReservations = await client.fetch(EXPIRED_RESERVATIONS_QUERY);

      if (!expiredReservations || expiredReservations.length === 0) {
        return;
      }

      const transaction = client.transaction();

      for (const res of expiredReservations) {
        transaction.delete(res._id);
      }

      await transaction.commit();
    } catch (error) {
      console.error("Error cleaning up expired reservations:", error);
      // Fails silently to not disrupt the main flow
    }
  }
};
