import { supabase } from "@/utils/supabase";
import { getSupabaseAdmin } from "@/utils/supabase";

export const orderRepository = {
  listAll() {
    return supabase.from("orders").select("*").order("created_at", { ascending: false });
  },
  listAdminPaged(params: { from: number; to: number; status?: string; q?: string }) {
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(params.from, params.to);

    if (params.status) {
      query = query.eq("status", params.status);
    }

    if (params.q) {
      const escaped = params.q.replaceAll("%", "\\%").replaceAll("_", "\\_");
      query = query.or(`id.ilike.%${escaped}%,customer_email.ilike.%${escaped}%`);
    }

    return query;
  },
  countByStatus(status: string) {
    return supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", status);
  },
  getProfilesByIds(userIds: string[]) {
    if (userIds.length === 0) return Promise.resolve({ data: [] as Array<Record<string, unknown>>, error: null });
    return supabase.from("profiles").select("*").in("id", userIds);
  },
  listByUserId(userId: string) {
    return supabase
      .from("orders")
      .select("*, order_items (*), shipments (*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },
  getById(orderId: string) {
    return supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product_variants (*, products (*))
        ),
        shipments (*),
        payment_transactions (*)
      `)
      .eq("id", orderId)
      .single();
  },
  getProfileById(userId: string) {
    return supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  },
  updateStatus(orderId: string, status: string) {
    return supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();
  },
  upsertShipment(params: {
    order_id: string;
    tracking_number: string;
    courier_company: string;
    status: string;
  }) {
    return supabase.from("shipments").upsert({
      ...params,
      updated_at: new Date().toISOString(),
    });
  },
  listReturnsForAdmin() {
    return getSupabaseAdmin()
      .from("order_returns")
      .select("*, orders(customer_name)")
      .order("created_at", { ascending: false });
  },
  getByPaymentOrderId(paymentOrderId: string) {
    return getSupabaseAdmin()
      .from("orders")
      .select("id, status, created_at, total_amount, customer_email")
      .eq("payment_order_id", paymentOrderId)
      .maybeSingle();
  },
  listItemsByOrderId(orderId: string) {
    return getSupabaseAdmin()
      .from("order_items")
      .select("product_id, product_name, quantity, price")
      .eq("order_id", orderId);
  },
};

