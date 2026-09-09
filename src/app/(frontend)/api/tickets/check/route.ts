import { NextRequest, NextResponse } from "next/server";
import { slotBookingService } from "@/lib/slotBookingService";

export async function POST(req: NextRequest) {
  const requiredPin = process.env.TICKET_CHECK_PIN;

  try {
    let body: { code?: unknown; pin?: unknown } | null = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const rawPin = body && typeof body === "object" ? body.pin : undefined;
    const pin = typeof rawPin === "string" ? rawPin : "";

    if (requiredPin && pin !== requiredPin) {
      return NextResponse.json({ error: "Невірний PIN-код" }, { status: 403 });
    }

    const rawCode = body && typeof body === "object" ? body.code : undefined;
    const code = typeof rawCode === "string" ? rawCode.trim().toUpperCase() : "";

    if (!code) {
      return NextResponse.json(
        { valid: false, reason: "Код не вказано" },
        { status: 400 }
      );
    }

    const booking = await slotBookingService.getByTicketCode(code);

    if (!booking) {
      return NextResponse.json({ valid: false, reason: "Квиток не знайдено" });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ valid: false, reason: "Квиток скасовано" });
    }

    if (booking.status === "reserved") {
      const expired = booking.validUntil
        ? new Date(booking.validUntil) < new Date()
        : true;
      return NextResponse.json({
        valid: false,
        reason: expired
          ? "Термін дії бронювання минув"
          : "Платіж не підтверджено",
      });
    }

    const service = booking.service;
    const slot = booking.slot;

    return NextResponse.json({
      valid: true,
      service: service && typeof service === "object" ? service.title : "",
      date: booking.date ? String(booking.date).slice(0, 10) : "",
      slot: {
        startTime: slot && typeof slot === "object" ? slot.startTime : "",
        endTime: slot && typeof slot === "object" ? slot.endTime : "",
      },
      visitors: (booking.childrenQty ?? 0) + (booking.adultsQty ?? 0),
      clientName: booking.clientName ?? "",
    });
  } catch (error) {
    console.error("Error checking ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
