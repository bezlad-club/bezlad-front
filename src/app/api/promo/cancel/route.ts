import { NextRequest, NextResponse } from "next/server";
import { promoCodeService } from "@/lib/promoCodeService";

export async function POST(req: NextRequest) {
  try {
    const { reservationId } = await req.json();

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    await promoCodeService.cancel(reservationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Promo cancellation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
