import { getPayloadClient } from "./payload";

export class PromoCodeError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PromoCodeError';
  }
}

export const promoCodeService = {
  async validate(code: string) {
    const payload = await getPayloadClient();

    const { docs } = await payload.find({
      collection: 'promoCode',
      where: {
        code: {
          equals: code,
        },
      },
      limit: 1,
      depth: 0,
    });

    const promo = docs[0];

    if (!promo) {
      throw new PromoCodeError("Промокод не знайдено", "NOT_FOUND");
    }

    // Count 'reserved' reservations whose validUntil is in the future
    const { totalDocs: activeReservationsCount } = await payload.count({
      collection: 'promoCodeReservation',
      where: {
        and: [
          { promoCode: { equals: promo.id } },
          { status: { equals: 'reserved' } },
          { validUntil: { greater_than: new Date() } },
        ],
      },
    });

    const usageCount = promo.usageCount ?? 0;
    const usageLimit = promo.usageLimit ?? undefined;
    const applicableServices = (promo.applicableServices ?? []).map((s) =>
      typeof s === "number" ? s : s.id
    );

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

    if (usageLimit && usageCount >= usageLimit) {
      throw new PromoCodeError("Ліміт використання вичерпано", "LIMIT_REACHED");
    }

    // Check active reservations
    // We count 'reserved' status where validUntil is in the future

    // If it's a personal code (limit 1 implicitly or explicitly) or has a limit
    // We check if (current_usage + reserved) >= limit
    const limit = usageLimit || (promo.type === 'personal' ? 1 : Infinity);

    if (usageCount + activeReservationsCount >= limit) {
      throw new PromoCodeError("Промокод тимчасово зарезервований або використаний", "TEMPORARILY_UNAVAILABLE");
    }

    if (applicableServices.length === 0) {
      throw new PromoCodeError("Промокод не застосовується до жодної послуги", "NO_SERVICES");
    }

    return {
      isValid: true,
      discountPercent: promo.discountPercent,
      code: promo.code,
      id: promo.id,
      applicableServices,
    };
  },

  async reserve(code: string) {
    const payload = await getPayloadClient();

    // 1. Validate again to prevent race conditions (mostly)
    const validResult = await this.validate(code);

    // 2. Create reservation
    const validMinutes = 30;
    const validUntil = new Date(Date.now() + validMinutes * 60 * 1000).toISOString();

    const reservation = await payload.create({
      collection: 'promoCodeReservation',
      data: {
        promoCode: validResult.id,
        status: 'reserved',
        reservedAt: new Date().toISOString(),
        validUntil,
      },
    });

    return {
      reservationId: reservation.id,
      validUntil,
      discountPercent: validResult.discountPercent
    };
  },

  async confirm(reservationId: number, orderReference: string) {
    const payload = await getPayloadClient();

    let reservation = null;

    try {
      reservation = await payload.findByID({
        collection: 'promoCodeReservation',
        id: reservationId,
        depth: 0,
      });
    } catch {
      reservation = null;
    }

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.status === 'confirmed') {
      return; // Already confirmed
    }

    const promoRef =
      typeof reservation.promoCode === 'object'
        ? reservation.promoCode.id
        : reservation.promoCode;

    await payload.update({
      collection: 'promoCodeReservation',
      id: reservation.id,
      data: {
        status: 'confirmed',
        orderReference // Link if not linked yet
      },
    });

    const promo = await payload.findByID({
      collection: 'promoCode',
      id: promoRef,
      depth: 0,
    });

    const promoUpdate: Record<string, unknown> = {
      usageCount: { $inc: 1 },
    };

    // Check if we need to deactivate personal code
    if (promo.type === 'personal') {
      promoUpdate.isActive = false;
    }

    await payload.db.updateOne({
      collection: 'promoCode',
      id: promoRef,
      data: promoUpdate,
    });
  },

  async cancel(reservationId: number) {
    const payload = await getPayloadClient();

    let reservation = null;

    try {
      reservation = await payload.findByID({
        collection: 'promoCodeReservation',
        id: reservationId,
        depth: 0,
      });
    } catch {
      reservation = null;
    }

    if (!reservation) {
      return null;
    }

    return payload.update({
      collection: 'promoCodeReservation',
      id: reservation.id,
      data: {
        status: 'cancelled'
      },
    });
  },

  async cleanupExpired() {
    try {
      const payload = await getPayloadClient();

      const now = new Date();

      const expiredReservations = await payload.find({
        collection: 'promoCodeReservation',
        where: {
          and: [
            { status: { in: ['reserved', 'expired'] } },
            { validUntil: { less_than: now } },
          ],
        },
        limit: 10,
        depth: 0,
      });

      if (!expiredReservations.docs || expiredReservations.docs.length === 0) {
        return;
      }

      for (const res of expiredReservations.docs) {
        await payload.delete({
          collection: 'promoCodeReservation',
          id: res.id,
        });
      }
    } catch (error) {
      console.error("Error cleaning up expired reservations:", error);
      // Fails silently to not disrupt the main flow
    }
  }
};
