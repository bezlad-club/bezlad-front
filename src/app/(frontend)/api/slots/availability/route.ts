import { NextRequest, NextResponse } from "next/server";
import { SlotBookingError, slotBookingService } from "@/lib/slotBookingService";

export async function GET(req: NextRequest) {
  try {
    const serviceIdParam = req.nextUrl.searchParams.get("serviceId");
    const date = req.nextUrl.searchParams.get("date") ?? "";
    const serviceId = Number(serviceIdParam);

    if (!serviceIdParam || !Number.isInteger(serviceId) || serviceId <= 0) {
      return NextResponse.json(
        { error: "Некоректна послуга" },
        { status: 400 }
      );
    }

    const slots = await slotBookingService.getAvailableSlots(serviceId, date);

    return NextResponse.json(slots);
  } catch (error) {
    if (error instanceof SlotBookingError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error fetching slot availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
