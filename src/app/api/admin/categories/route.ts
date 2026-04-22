import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { deleteCategory, saveCategory } from "@/lib/application/products/product-admin-service";
import { requiredFieldsMessage } from "@/constants/api-messages";

function normalizeSlug(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function normalizeName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const id = normalizeSlug(payload?.id);
    const name = normalizeName(payload?.name);
    if (!id || !name) {
      return badRequest(requiredFieldsMessage(["id", "name"]));
    }
    if (id.length > 64 || name.length > 120) {
      return badRequest("Panjang field kategori melebihi batas");
    }

    const category = await saveCategory({
      ...payload,
      id,
      name,
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/collections");

    return ok({ success: true, category });
  } catch (err: unknown) {
    return internalError(err instanceof Error ? err.message : undefined);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = normalizeSlug(searchParams.get("id"));
    if (!id) {
      return badRequest(requiredFieldsMessage(["id"]));
    }

    await deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/collections");

    return ok({ success: true });
  } catch (err: unknown) {
    return internalError(err instanceof Error ? err.message : undefined);
  }
}
