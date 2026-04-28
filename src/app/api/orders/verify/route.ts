import { NextRequest } from "next/server";
import { verifyOrderByPaymentReference } from "@/lib/order-service";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { API_ERROR_MESSAGES, ORDER_ERROR_MESSAGES, ORDER_MESSAGES } from "@/constants/api-messages";

/**
 * API Route untuk memverifikasi apakah pesanan sudah dibuat berdasarkan order_id (Midtrans), session_id, atau payment_intent.
 * Menggunakan service role agar lookup berfungsi untuk guest checkout (tidak ada sesi user).
 */

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId =
      searchParams.get("order_id") ??
      searchParams.get("session_id") ??
      searchParams.get("payment_intent");

    if (!sessionId) {
      return badRequest(ORDER_ERROR_MESSAGES.REFERENCE_REQUIRED);
    }

    const result = await verifyOrderByPaymentReference(sessionId);
    if (!result) {
      return internalError(ORDER_ERROR_MESSAGES.VERIFY_FAILED);
    }
    if (!result.exists) {
      return ok({
        exists: false,
        message: ORDER_MESSAGES.NOT_PROCESSED,
      });
    }
    return ok(result);
  } catch (error: unknown) {
    console.error("Gagal memverifikasi pesanan:", error);
    return internalError(API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

