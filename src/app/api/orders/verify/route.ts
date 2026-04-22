import { NextRequest } from "next/server";
import { verifyOrderByPaymentReference } from "@/lib/order-service";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { API_ERROR_MESSAGES, ORDER_ERROR_MESSAGES, ORDER_MESSAGES } from "@/constants/api-messages";

/**
 * API Route para verificar se um pedido foi criado usando order_id (Pagar.me), session_id ou payment_intent.
 * Usa service role para que o lookup funcione para guest: a página de sucesso não tem sessão com o email do pedido.
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
    console.error("Erro na verificação de pedido:", error);
    return internalError(API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

