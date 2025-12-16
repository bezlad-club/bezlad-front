import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import { getPriceValue } from "@/utils/getPriceValue";
import { client } from "@/lib/sanityClient";
import { SERVICES_BY_IDS_QUERY } from "@/lib/queries";

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
    const { cartItems, clientInfo } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fetch actual prices from Sanity using only IDs
    const productIds = cartItems
      .filter((item: Item) => item._id)
      .map((item: Item) => item._id);

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart data: missing product IDs" },
        { status: 400 }
      );
    }

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

      const price = getPriceValue(sanityProduct.price);
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
      returnUrl: `${NEXT_PUBLIC_SITE_URL}/confirmation`,
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
