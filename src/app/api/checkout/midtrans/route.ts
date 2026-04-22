import { NextResponse } from "next/server";
import { API_ERROR_MESSAGES, CHECKOUT_ERROR_MESSAGES } from "@/constants/api-messages";

export async function POST(req: Request) {
  try {
    const { orderId, grossAmount, customerDetails, items } = await req.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const apiUrl = isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    if (!serverKey) {
      console.error("[MIDTRANS API] SERVER_KEY is missing");
      return NextResponse.json(
        { error: CHECKOUT_ERROR_MESSAGES.MIDTRANS_NOT_CONFIGURED },
        { status: 500 }
      );
    }

    const authHeader = Buffer.from(`${serverKey}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(grossAmount),
      },
      customer_details: customerDetails,
      item_details: items.map((item: any) => ({
        id: item.id,
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name.substring(0, 50),
      })),
      usage_limit: 1,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[MIDTRANS API] Error response:", data);
      return NextResponse.json(
        { error: data.error_messages?.[0] || CHECKOUT_ERROR_MESSAGES.CREATE_TRANSACTION_FAILED },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[MIDTRANS API] Exception:", err);
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
