import {
  InventoryStatusItem,
  ReserveInventoryRequest,
  ReserveInventoryResponse,
} from "@/types/contracts/inventory";
import { getSupabaseAdmin } from "@/utils/supabase";

export async function reserveInventoryInDatabase(payload: ReserveInventoryRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.rpc("reserve_inventory_v3", {
    p_variant_id: payload.variant_id,
    p_quantity: payload.quantity,
    p_payment_order_id: payload.payment_order_id,
    p_customer_email: payload.customer_email || null,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, data: data as ReserveInventoryResponse };
}

type InventoryStatusQueryRow = {
  id: string;
  product_id: string;
  is_active: boolean;
  products:
    | { id: string; name: string; is_active: boolean; deleted_at: string | null }
    | Array<{ id: string; name: string; is_active: boolean; deleted_at: string | null }>
    | null;
  inventory: Array<{ stock_quantity: number; reserved_quantity: number; updated_at: string | null }> | null;
};

export async function getInventoryStatus(productId?: string | null) {
  const supabaseAdmin = getSupabaseAdmin();

  let query = supabaseAdmin
    .from("product_variants")
    .select(
      `
        id,
        product_id,
        is_active,
        products!inner(id, name, is_active, deleted_at),
        inventory(stock_quantity, reserved_quantity, updated_at)
      `,
    )
    .eq("is_active", true);

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data, error } = await query;
  if (error) {
    return { ok: false as const, error: error.message };
  }

  const normalized: InventoryStatusItem[] = ((data || []) as unknown as InventoryStatusQueryRow[])
    .map((row) => {
      const inv = row.inventory?.[0] || null;
      const product = Array.isArray(row.products) ? row.products[0] ?? null : row.products;
      const available = inv ? inv.stock_quantity - inv.reserved_quantity : 0;

      return {
        variant_id: row.id,
        product_id: row.product_id,
        product_name: product?.name ?? null,
        is_active: Boolean(row.is_active && product?.is_active && !product?.deleted_at),
        stock_quantity: inv?.stock_quantity ?? 0,
        reserved_quantity: inv?.reserved_quantity ?? 0,
        available_quantity: available,
        updated_at: inv?.updated_at ?? null,
      };
    })
    .filter((row) => row.is_active);

  return { ok: true as const, data: normalized };
}

