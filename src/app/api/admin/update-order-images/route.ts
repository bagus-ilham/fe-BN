import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { countOrderItemsWithoutImage, updateMissingOrderItemImages } from "@/lib/application/orders/update-order-images-use-case";
import { internalError, ok, unauthorized } from "@/lib/http/api-response";
import { API_ERROR_MESSAGES, orderImagesUpdatedMessage } from "@/constants/api-messages";

/**
 * API Route para atualizar imagens de produtos em pedidos antigos.
 * Atualiza order_items sem product_image buscando na constante PRODUCTS.
 * Protegida por ADMIN_SECRET_TOKEN (header x-admin-token).
 */

// Remove legacy PRODUCTS import

export async function POST(req: NextRequest) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    const expectedToken = process.env.ADMIN_SECRET_TOKEN;

    if (!expectedToken) {
      console.warn("[ADMIN] ADMIN_SECRET_TOKEN não configurado — rota bloqueada");
      return unauthorized();
    }

    if (!adminToken || adminToken !== expectedToken) {
      return unauthorized();
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    process.env.NEXT_PUBLIC_BASE_URL || 
                    'https://vioslabs.com.br';

    const result = await updateMissingOrderItemImages(baseUrl);
    if (!result.ok) {
      return internalError(result.error);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/orders");

    return ok({
      success: true,
      message: orderImagesUpdatedMessage(result.data.updated, result.data.failed),
      updated: result.data.updated,
      failed: result.data.failed,
      total: result.data.total,
      errors: result.data.errors.length > 0 ? result.data.errors : undefined,
    });

  } catch (err: unknown) {
    console.error('❌ Error updating order images:', err);
    return internalError(err instanceof Error ? err.message : API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}

// GET para verificar quantos itens precisam ser atualizados
export async function GET() {
  try {
    const result = await countOrderItemsWithoutImage();
    if (!result.ok) {
      return internalError(result.error);
    }

    return ok({
      count: result.data.length,
      items: result.data,
    });
  } catch (err: unknown) {
    return internalError(err instanceof Error ? err.message : API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
