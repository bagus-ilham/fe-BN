import { addEmailToWaitlist } from "@/lib/application/marketing/waitlist-use-case";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { API_ERROR_MESSAGES, WAITLIST_ERROR_MESSAGES, WAITLIST_MESSAGES, requiredFieldsMessage } from "@/constants/api-messages";

// ============================================================================
// API: ADICIONAR À WAITLIST
// ============================================================================
// Rota: POST /api/waitlist/add
// Adiciona email à fila de espera quando produto estiver esgotado
// ============================================================================

interface AddToWaitlistRequest {
  product_id: string;
  email: string;
}

/**
 * POST /api/waitlist/add
 * Body: { product_id, email }
 */
export async function POST(req: Request) {
  try {
    const body: AddToWaitlistRequest = await req.json();

    // Validações
    if (!body.product_id || !body.email) {
      return badRequest(requiredFieldsMessage(["product_id", "email"]));
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return badRequest(WAITLIST_ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
    }

    const result = await addEmailToWaitlist({
      productId: body.product_id,
      email: body.email,
    });

    if (!result.ok) {
      if (result.status === 404) {
        return ok({ success: false, error: result.error }, 404);
      }
      return internalError(result.error, result.details);
    }

    if (result.data.alreadyExists) {
      return ok({
        success: true,
        product_name: result.data.productName,
        message: WAITLIST_MESSAGES.ALREADY_REGISTERED,
      });
    }

    return ok({
      success: true,
      waitlist_id: result.data.waitlistId,
      product_name: result.data.productName,
      message: WAITLIST_MESSAGES.NOTIFICATION_SET,
    });
  } catch (error: unknown) {
    // Log estruturado do erro
    console.error('[WAITLIST ERROR] Error in add to waitlist API:', 
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
