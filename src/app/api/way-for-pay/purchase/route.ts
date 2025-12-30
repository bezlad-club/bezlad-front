import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { getPriceValue } from "@/utils/getPriceValue";
import { client } from "@/lib/sanityServerClient";
import { promoCodeService } from "@/lib/promoCodeService";
import {
  SERVICES_BY_IDS_QUERY,
  RESERVATION_FOR_VALIDATION_QUERY,
} from "@/lib/queries";

const MERCHANT_ACCOUNT = process.env.MERCHANT_ACCOUNT;
const MERCHANT_SECRET_KEY = process.env.MERCHANT_SECRET_KEY;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

interface Item {
  _id: string;
  quantity: number;
}

interface SanityProduct {
  _id: string;
  title: string;
  price: string;
}

export async function POST(req: NextRequest) {
  if (!MERCHANT_ACCOUNT || !MERCHANT_SECRET_KEY || !NEXT_PUBLIC_SITE_URL) {
    console.error("Missing environment variables for WayForPay");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { cartItems, clientInfo, promo } = body;
    let reservationId: string | undefined;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = cartItems
      .filter((item: Item) => item._id)
      .map((item: Item) => item._id);

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart data: missing product IDs" },
        { status: 400 }
      );
    }

    if (promo) {
      try {
        const newReservation = await promoCodeService.reserve(promo);
        reservationId = newReservation.reservationId;
      } catch (err: unknown) {
        // If promo code fails (invalid, limit reached, etc.), we return error immediately
        const errorMessage =
          err instanceof Error ? err.message : "Invalid promo code";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }
    }

    // 1. Validate Reservation if present
    let discountPercent = 0;
    let applicableServices: string[] = [];
    let orderTimeout = 43200; // Default 12 hours if no promo code

    if (reservationId) {
      const reservation = await client.fetch(RESERVATION_FOR_VALIDATION_QUERY, {
        id: reservationId,
      });

      if (!reservation) {
        return NextResponse.json(
          { error: "Reservation not found" },
          { status: 400 }
        );
      }
      if (reservation.status !== "reserved") {
        return NextResponse.json(
          { error: "Reservation is not active" },
          { status: 400 }
        );
      }

      const now = new Date();
      const validUntil = new Date(reservation.validUntil);

      if (validUntil < now) {
        return NextResponse.json(
          { error: "Reservation expired" },
          { status: 400 }
        );
      }

      // Set timeout to remaining seconds of reservation
      const diffSeconds = Math.floor(
        (validUntil.getTime() - now.getTime()) / 1000
      );
      if (diffSeconds <= 0) {
        return NextResponse.json(
          { error: "Reservation expired just now" },
          { status: 400 }
        );
      }

      // Check if promo applies to ANY item in the cart
      const cartHasApplicableItems = reservation.promoCode.applicableServices?.some(
        (serviceId: string) => productIds.includes(serviceId)
      ) ?? false;

      // If no items in cart match the promo's applicable services, we ignore the promo
      // but we do NOT throw error to let purchase proceed without discount
      if (!cartHasApplicableItems) {
        console.warn(
          "Promo code ignored: no applicable items in cart for reservation",
          reservationId
        );
        discountPercent = 0;
        applicableServices = [];
        // Revert to default timeout since promo is effectively not used
        orderTimeout = 43200;
      } else {
        discountPercent = Math.min(
          Math.max(reservation.promoCode.discountPercent, 0),
          100
        );
        applicableServices = reservation.promoCode.applicableServices;
        orderTimeout = diffSeconds;
      }
    }

    // Fetch actual prices from Sanity using only IDs
    const sanityProducts = await client.fetch<SanityProduct[]>(
      SERVICES_BY_IDS_QUERY,
      {
        ids: productIds,
      }
    );

    const productsMap = new Map<string, SanityProduct>();
    sanityProducts.forEach((p: SanityProduct) => productsMap.set(p._id, p));

    const merchantDomainName = NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "");
    const orderReference = `ORDER_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;
    const orderDate = Math.floor(Date.now() / 1000);
    const currency = "UAH";

    const productNames: string[] = [];
    const productCounts: number[] = [];
    const productPrices: number[] = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const sanityProduct = productsMap.get(item._id);

      if (!sanityProduct) {
        console.error(`Product not found in Sanity: ${item._id}`);
        return NextResponse.json(
          { error: `Product not found: ${item._id}` },
          { status: 400 }
        );
      }

      let price = getPriceValue(sanityProduct.price);

      // Apply discount per item
      if (discountPercent > 0) {
        if (
          applicableServices &&
          applicableServices.length > 0 &&
          applicableServices.includes(item._id)
        ) {
          price = price * (1 - discountPercent / 100);
        }
      }

      // Ensure title matches Sanity and clean it
      const name = sanityProduct.title.replace(/;/g, " ");

      productNames.push(name);
      productCounts.push(item.quantity);
      productPrices.push(price);

      totalAmount += price * item.quantity;
    }

    // Format amounts to 2 decimal places
    const formattedAmount = totalAmount.toFixed(2);
    const formattedPrices = productPrices.map((p) => p.toFixed(2));

    // Link Order to Reservation in Sanity
    if (reservationId) {
      await client
        .patch(reservationId)
        .set({
          orderReference,
          finalAmount: Number(formattedAmount),
        })
        .commit();
    }

    // Lazy cleanup of expired reservations (limited to 10 to be fast)
    // Using 'after' to run this in the background without blocking the response
    after(promoCodeService.cleanupExpired);

    // Signature generation
    // merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;productName;productCount;productPrice
    const signString = [
      MERCHANT_ACCOUNT,
      merchantDomainName,
      orderReference,
      orderDate,
      formattedAmount,
      currency,
      ...productNames,
      ...productCounts,
      ...formattedPrices,
    ].join(";");

    const hmac = crypto.createHmac("md5", MERCHANT_SECRET_KEY);
    hmac.update(signString, "utf8");
    const merchantSignature = hmac.digest("hex");

    // Prepare data for WayForPay request
    const params = {
      merchantAccount: MERCHANT_ACCOUNT,
      merchantAuthType: "SimpleSignature",
      merchantDomainName: merchantDomainName,
      merchantSignature,
      orderReference,
      orderDate,
      amount: formattedAmount,
      currency,
      productName: productNames,
      productPrice: formattedPrices,
      productCount: productCounts,
      clientFirstName: clientInfo?.name,
      clientPhone: clientInfo?.phone,
      clientEmail: clientInfo?.email,
      defaultPaymentSystem: "card",
      orderTimeout,
      returnUrl: `${NEXT_PUBLIC_SITE_URL}/api/confirmation`,
      serviceUrl: `${NEXT_PUBLIC_SITE_URL}/api/way-for-pay/callback`,
    };

    // Send request to WayForPay to get the payment URL
    // Using behavior=offline to get a JSON response with the URL
    const response = await axios.post(
      "https://secure.wayforpay.com/pay?behavior=offline",
      params,
      {
        headers: {
          // WayForPay usually expects form data
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data && response.data.url) {
      return NextResponse.json({ url: response.data.url });
    } else {
      console.error("Unexpected response from WayForPay:", response.data);
      return NextResponse.json(
        { error: "Failed to generate payment URL", details: response.data },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
