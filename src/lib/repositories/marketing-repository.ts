import { getSupabaseAdmin, supabase } from "@/utils/supabase";

export const marketingRepository = {
  listFlashSalesForAdmin() {
    return getSupabaseAdmin()
      .from("flash_sales")
      .select(`
        *,
        flash_sale_items (id, sale_price, limit_qty, sold_qty, products (name))
      `)
      .order("start_at", { ascending: false });
  },
  listAbandonedCheckouts() {
    return getSupabaseAdmin()
      .from("checkout_abandons")
      .select("*")
      .order("captured_at", { ascending: false });
  },
  listVipEntries() {
    return getSupabaseAdmin().from("vip_list").select("*").order("created_at", { ascending: false });
  },
  listEmailSequences() {
    return getSupabaseAdmin()
      .from("email_sequences")
      .select("*")
      .order("send_at", { ascending: false });
  },
  listPendingEmailSequences(now: string, limit: number) {
    return getSupabaseAdmin()
      .from("email_sequences")
      .select("id, order_id, customer_email, sequence_type")
      .eq("status", "pending")
      .lte("send_at", now)
      .limit(limit);
  },
  updateEmailSequenceStatus(id: string, status: "sent" | "failed") {
    return getSupabaseAdmin().from("email_sequences").update({ status }).eq("id", id);
  },
  getOrderCustomerName(orderId: string) {
    return getSupabaseAdmin().from("orders").select("customer_name").eq("id", orderId).maybeSingle();
  },
  listOrderProductNames(orderId: string) {
    return getSupabaseAdmin().from("order_items").select("product_id, product_name").eq("order_id", orderId);
  },
  listPendingCheckoutAbandons(now: string, limit: number) {
    return getSupabaseAdmin()
      .from("checkout_abandons")
      .select("id, email, cart_items")
      .eq("status", "pending")
      .lte("send_at", now)
      .limit(limit);
  },
  updateCheckoutAbandonStatus(id: string, status: "sent" | "failed") {
    return getSupabaseAdmin().from("checkout_abandons").update({ status }).eq("id", id);
  },
  getLatestCheckoutAbandonByEmail(email: string) {
    return getSupabaseAdmin()
      .from("checkout_abandons")
      .select("id, status")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  },
  updateCheckoutAbandonCapture(
    id: string,
    payload: { phone?: string | null; cart_items?: unknown; send_at: string; captured_at: string },
  ) {
    return getSupabaseAdmin()
      .from("checkout_abandons")
      .update({
        ...(payload.phone ? { phone: payload.phone } : {}),
        ...(payload.cart_items ? { cart_items: payload.cart_items } : {}),
        send_at: payload.send_at,
        captured_at: payload.captured_at,
      })
      .eq("id", id);
  },
  insertCheckoutAbandon(payload: {
    email: string;
    phone: string | null;
    cart_items: unknown;
    captured_at: string;
    send_at: string;
    status: "pending";
  }) {
    return getSupabaseAdmin().from("checkout_abandons").insert(payload);
  },
  listWaitlistForAdmin() {
    return getSupabaseAdmin()
      .from("waitlist")
      .select("id, email, created_at, notified_at, products(name)")
      .order("created_at", { ascending: false });
  },
  updateFlashSaleStatus(id: string, is_active: boolean) {
    return getSupabaseAdmin().from("flash_sales").update({ is_active }).eq("id", id);
  },
  getActiveFlashSale(now: string) {
    return supabase
      .from("flash_sales")
      .select(`*, flash_sale_items (*, products (*))`)
      .eq("is_active", true)
      .lte("start_at", now)
      .gte("end_at", now)
      .single();
  },
};

