import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { client } from "@/lib/sanityServerClient";
import { promoCodeService } from "@/lib/promoCodeService";
import { RESERVATION_FOR_CALLBACK_QUERY } from "@/lib/queries";

const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!MERCHANT_SECRET_KEY) {
    throw new Error("MERCHANT_SECRET_KEY не визначено в середовищі!");
  }

  try {
    const body = await req.json();
    const { orderReference, transactionStatus } = body;
    console.log(
      `[Callback] Order: ${orderReference}, Status: ${transactionStatus}`
    );

    const {
      merchantAccount,
      amount,
      currency,
      authCode,
      cardPan,
      reasonCode,
      merchantSignature,
    } = body;

    const signString = [
      merchantAccount,
      orderReference,
      amount,
      currency,
      authCode,
      cardPan,
      transactionStatus,
      reasonCode,
    ].join(";");

    // Перевірка підпису вхідного запиту
    const hmac = crypto.createHmac("md5", MERCHANT_SECRET_KEY);
    hmac.update(signString, "utf8");
    const expectedSignature = hmac.digest("hex");

    if (merchantSignature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let statusMessage = "";
    let orderStatus = "";

    // Find reservation linked to this order
    const reservation = await client.fetch(RESERVATION_FOR_CALLBACK_QUERY, {
      ref: orderReference,
    });

    if (!reservation) {
      console.log(
        `[Callback] No reservation found for order: ${orderReference}`
      );
    }

    if (transactionStatus === "Approved") {
      statusMessage = `✅ Платіж успішний: Замовлення #${orderReference} оплачено на суму ${amount} грн.`;
      orderStatus = "accept";

      // Відправка повідомлення через Telegram
      try {
        await axios({
          method: "post",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/telegram`,
          data: statusMessage,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Telegram notification failed:", err);
      }

      // Confirm promo code usage
      if (reservation) {
        try {
          await promoCodeService.confirm(reservation._id, orderReference);
          console.log(
            `[Callback] ✅ Promo code confirmed, usageCount incremented`
          );
        } catch (err) {
          console.error(`[Callback] ❌ Failed to confirm promo code:`, err);
        }
      }
    } else {
      orderStatus = "decline";

      // Cancel promo code reservation if declined
      if (reservation && reservation.status === "reserved") {
        try {
          await promoCodeService.cancel(reservation._id);
          console.log(
            `Promo code cancelled for reservation ${reservation._id}`
          );
        } catch (err) {
          console.error(
            `Failed to cancel promo code for reservation ${reservation._id}:`,
            err
          );
        }
      }
    }

    // Формуємо підпис для відповіді WayForPay
    const responseTime = Math.floor(Date.now() / 1000); // Поточний час (Unix timestamp)
    const responseSignString = [orderReference, orderStatus, responseTime].join(
      ";"
    );

    // Створення HMAC_MD5 підпису для відповіді
    const responseHmac = crypto.createHmac("md5", MERCHANT_SECRET_KEY);
    responseHmac.update(responseSignString, "utf8");
    const responseSignature = responseHmac.digest("hex");

    // Повертаємо відповідь у форматі, який чекає WayForPay
    return NextResponse.json({
      orderReference,
      status: orderStatus,
      time: responseTime,
      signature: responseSignature,
    });
  } catch (error) {
    console.error("Помилка обробки платежу:", error);
    return NextResponse.json(
      { error: "Помилка обробки платежу" },
      { status: 500 }
    );
  }
}
