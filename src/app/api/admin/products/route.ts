import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { saveProductFromAdminPayload } from "@/lib/application/products/product-admin-service";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { API_ERROR_MESSAGES } from "@/constants/api-messages";

export async function POST(req: NextRequest) {
  try {
    const { product, variants = [], images = [] } = await req.json();
    if (!product || typeof product !== "object" || Array.isArray(product)) {
      return badRequest("Payload product tidak valid");
    }
    if (!Array.isArray(variants) || !Array.isArray(images)) {
      return badRequest("Payload variants/images tidak valid");
    }
    const savedProduct = await saveProductFromAdminPayload({ product, variants, images });
    const productId = typeof savedProduct?.id === "string" ? savedProduct.id : null;

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    if (productId) {
      revalidatePath(`/admin/products/${productId}`);
      revalidatePath(`/product/${productId}`);
    }

    return ok({ success: true, product: savedProduct });

  } catch (err: unknown) {
    console.error("❌ Error saving product via API:", err);
    return internalError(err instanceof Error ? err.message : API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
