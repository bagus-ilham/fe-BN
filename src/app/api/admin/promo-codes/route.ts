import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { savePromoCode } from "@/lib/application/products/product-admin-service";
import { requiredFieldsMessage } from "@/constants/api-messages";

function normalizeCode(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const id = normalizeCode(payload?.id);
    const discountType = payload?.discount_type;
    const discountValue = Number(payload?.discount_value ?? 0);
    const minPurchaseAmount = Number(payload?.min_purchase_amount ?? 0);
    if (!id || !discountType) {
      return badRequest(requiredFieldsMessage(["id", "discount_type"]));
    }
    if (discountType !== "percentage" && discountType !== "fixed") {
      return badRequest("discount_type tidak valid");
    }
    if (!Number.isFinite(discountValue) || discountValue < 0 || !Number.isFinite(minPurchaseAmount) || minPurchaseAmount < 0) {
      return badRequest("Nilai promo tidak valid");
    }
    if (discountType === "percentage" && discountValue > 100) {
      return badRequest("Nilai persentase promo tidak boleh lebih dari 100");
    }

    const promoCode = await savePromoCode({
      ...payload,
      id,
      discount_type: discountType,
      discount_value: discountValue,
      min_purchase_amount: minPurchaseAmount,
    });
    revalidatePath("/admin/discounts");
    revalidatePath("/checkout");

    return ok({ success: true, promoCode });
  } catch (err: unknown) {
    return internalError(err instanceof Error ? err.message : undefined);
  }
}
