import { NextRequest, NextResponse } from "next/server";
import { promoCodeService, PromoCodeError } from "@/lib/promoCodeService";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const result = await promoCodeService.reserve(code);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof PromoCodeError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 });
    }
    console.error("Promo reservation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
