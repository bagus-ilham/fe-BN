import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { updateStock } from "@/lib/application/products/product-admin-service";
import { requiredFieldsMessage } from "@/constants/api-messages";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const variantId = typeof payload?.variantId === "string" ? payload.variantId.trim() : "";
    const quantity = Number(payload?.quantity);

    if (!variantId || typeof quantity !== "number" || !Number.isFinite(quantity)) {
      return badRequest(requiredFieldsMessage(["variantId", "quantity"]));
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      return badRequest("Quantity stok harus bilangan bulat >= 0");
    }

    const inventory = await updateStock(variantId, quantity);

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/inventory/logs");
    revalidatePath("/admin/products");

    return ok({ success: true, inventory });
  } catch (err: unknown) {
    return internalError(err instanceof Error ? err.message : undefined);
  }
}
