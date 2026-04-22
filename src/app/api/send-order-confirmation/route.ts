import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { API_ERROR_MESSAGES, ORDER_ERROR_MESSAGES } from "@/constants/api-messages";

interface OrderConfirmationBody {
  customerEmail: string;
  customerName?: string | null;
  orderId: string;
  orderDate: string;
  totalAmount: number;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    product_image?: string | null;
  }>;
  status?: "Paid" | "Processing" | "Pending";
  pixCopyPaste?: string | null;
  pixInstructions?: string | null;
  orderUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: OrderConfirmationBody = await req.json();

    if (!data.customerEmail) {
      return NextResponse.json(
        { error: ORDER_ERROR_MESSAGES.CUSTOMER_EMAIL_REQUIRED },
        { status: 400 },
      );
    }

    if (!data.orderId || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: ORDER_ERROR_MESSAGES.ORDER_ID_AND_ITEMS_REQUIRED },
        { status: 400 },
      );
    }

    const result = await sendOrderConfirmationEmail({
      customerEmail: data.customerEmail,
      customerName: data.customerName ?? null,
      orderId: data.orderId,
      orderDate: data.orderDate,
      totalAmount: data.totalAmount,
      status: data.status ?? "Paid",
      items: data.items,
      pixCopyPaste: data.pixCopyPaste ?? null,
      pixInstructions: data.pixInstructions ?? null,
      orderUrl: data.orderUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? ORDER_ERROR_MESSAGES.SEND_CONFIRMATION_FAILED },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    console.error("[send-order-confirmation] Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
