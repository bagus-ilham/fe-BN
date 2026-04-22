import { badRequest, conflict, internalError, ok } from "@/lib/http/api-response";
import {
  ReserveInventoryRequest,
  ReserveInventoryResponse,
} from '@/types/contracts/inventory';
import { reserveInventoryInDatabase } from '@/lib/inventory-service';
import { API_ERROR_MESSAGES, INVENTORY_ERROR_MESSAGES, requiredFieldsMessage } from "@/constants/api-messages";

/**
 * POST /api/inventory/reserve
 * Body: { variant_id, quantity, payment_order_id, customer_email? }
 */
export async function POST(req: Request) {
  try {
    const body: ReserveInventoryRequest = await req.json();

    // Validações
    if (!body.variant_id || !body.quantity || !body.payment_order_id) {
      return badRequest(requiredFieldsMessage(["variant_id", "quantity", "payment_order_id"]));
    }

    if (body.quantity <= 0) {
      return badRequest(INVENTORY_ERROR_MESSAGES.INVALID_QUANTITY);
    }

    const result = await reserveInventoryInDatabase(body);
    if (!result.ok) {
      return internalError(INVENTORY_ERROR_MESSAGES.RESERVATION_FAILED, result.error);
    }

    const response = result.data as ReserveInventoryResponse;

    // Se a reserva falhou (estoque insuficiente)
    if (!response.success) {
      return conflict(response.error);
    }

    return ok({
      success: true,
      reservation_id: response.reservation_id,
    });

  } catch (error: unknown) {
    // Log estruturado do erro
    console.error('Error in reserve inventory API:', 
      error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : error
    );
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    return internalError(errorMessage);
  }
}
