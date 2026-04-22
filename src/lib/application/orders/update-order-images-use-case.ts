import { getSupabaseAdmin } from "@/utils/supabase";

type UpdateOrderImagesResult = {
  updated: number;
  failed: number;
  total: number;
  errors: string[];
};

export async function countOrderItemsWithoutImage() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("order_items")
    .select("id, product_id, product_name, product_image")
    .is("product_image", null);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, data: data ?? [] };
}

export async function updateMissingOrderItemImages(baseUrl: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: itemsWithoutImage, error: fetchError } = await supabaseAdmin
    .from("order_items")
    .select("id, product_id")
    .is("product_image", null);

  if (fetchError) {
    return { ok: false as const, error: `Failed to fetch items: ${fetchError.message}` };
  }

  if (!itemsWithoutImage?.length) {
    return {
      ok: true as const,
      data: { updated: 0, failed: 0, total: 0, errors: [] } satisfies UpdateOrderImagesResult,
    };
  }

  const productIds = Array.from(new Set(itemsWithoutImage.map((i) => i.product_id).filter(Boolean)));
  const { data: products, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, image_url")
    .in("id", productIds);

  if (productError) {
    return { ok: false as const, error: productError.message };
  }

  const productImageMap = new Map((products ?? []).map((p) => [p.id, p.image_url]));
  let updated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const item of itemsWithoutImage) {
    const productImage = productImageMap.get(item.product_id);
    if (!productImage) {
      failed++;
      errors.push(`Produto ${item.product_id} tidak memiliki image_url`);
      continue;
    }

    const imageUrl = productImage.startsWith("/") ? `${baseUrl}${productImage}` : productImage;
    const { error: updateError } = await supabaseAdmin
      .from("order_items")
      .update({ product_image: imageUrl })
      .eq("id", item.id);

    if (updateError) {
      failed++;
      errors.push(`Erro ao atualizar item ${item.id}: ${updateError.message}`);
      continue;
    }

    updated++;
  }

  return {
    ok: true as const,
    data: { updated, failed, total: itemsWithoutImage.length, errors } satisfies UpdateOrderImagesResult,
  };
}
