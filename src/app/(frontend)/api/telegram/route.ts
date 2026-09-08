import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BOT_ID = process.env.TELEGRAM_BOT_ID;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const isDevOrPreview =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

export async function POST(request: NextRequest) {
  if (request.method === "POST") {
    const data = await request.json();

    if ((!BOT_ID || !CHAT_ID) && isDevOrPreview) {
      console.warn("TELEGRAM_BOT_ID or TELEGRAM_CHAT_ID is not set");
      console.log("Telegram message:", data);
      return NextResponse.json({ message: "Message logged to console" });
    }

    try {
      await axios.post(`https://api.telegram.org/bot${BOT_ID}/sendMessage`, {
        chat_id: CHAT_ID,
        parse_mode: "html",
        text: data,
      });
      return NextResponse.json({ message: "Data sent successfully" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to append data to the sheet" },
        { status: 500 }
      );
    }
  }
}
