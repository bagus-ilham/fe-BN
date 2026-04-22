import { supabase } from "@/utils/supabase";

export const cartRepository = {
  getByUserId(userId: string) {
    return supabase.from("carts").select("*, cart_items(*)").eq("user_id", userId).single();
  },
  getBySessionId(sessionId: string) {
    return supabase
      .from("carts")
      .select("*, cart_items(*)")
      .eq("session_id", sessionId)
      .is("user_id", null)
      .single();
  },
  create(params: { user_id: string | null; session_id: string | null }) {
    return supabase.from("carts").insert(params).select("*, cart_items(*)").single();
  },
  addItem(cartId: string, variantId: string, quantity: number) {
    return supabase
      .from("cart_items")
      .upsert({ cart_id: cartId, variant_id: variantId, quantity }, { onConflict: "cart_id, variant_id" })
      .select();
  },
  removeItem(cartId: string, variantId: string) {
    return supabase.from("cart_items").delete().eq("cart_id", cartId).eq("variant_id", variantId);
  },
  updateItemQty(cartId: string, variantId: string, quantity: number) {
    return supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cartId)
      .eq("variant_id", variantId)
      .select();
  },
  deleteCart(cartId: string) {
    return supabase.from("carts").delete().eq("id", cartId);
  },
};

