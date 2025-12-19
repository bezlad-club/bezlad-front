import { NextResponse } from "next/server";
import { client } from "@/lib/sanityServerClient";
import { EXPIRED_RESERVATIONS_QUERY } from "@/lib/queries";

export async function GET() {
  try {
    // Find reservations that are 'reserved' but validUntil < now
    const expiredReservations = await client.fetch(EXPIRED_RESERVATIONS_QUERY);

    if (expiredReservations.length === 0) {
      return NextResponse.json({ message: "No expired reservations found" });
    }

    // Batch update
    const transaction = client.transaction();

    for (const res of expiredReservations) {
      transaction.patch(res._id, (p) => p.set({ status: 'expired' }));
    }

    await transaction.commit();

    return NextResponse.json({ 
      success: true,
      count: expiredReservations.length,
    });
  } catch (error) {
    console.error("Cron cleanup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
