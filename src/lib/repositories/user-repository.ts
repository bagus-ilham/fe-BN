import { supabase } from "@/utils/supabase";
import { getSupabaseAdmin } from "@/utils/supabase";

export const userRepository = {
  getLoyaltyInfo(userId: string) {
    return supabase.from("loyalty_points").select("*").eq("user_id", userId).single();
  },
  getLoyaltyHistory(userId: string) {
    return supabase
      .from("loyalty_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },
  getProfile(userId: string) {
    return supabase.from("profiles").select("*").eq("id", userId).single();
  },
  getAddresses(userId: string) {
    return supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });
  },
  getWishlist(userId: string) {
    return supabase.from("wishlists").select("*, products (*)").eq("user_id", userId);
  },
  listProfilesForAdmin() {
    return getSupabaseAdmin().from("profiles").select("*").order("created_at", { ascending: false });
  },
  listProfilesForAdminPaged(params: { from: number; to: number; q?: string }) {
    let query = getSupabaseAdmin()
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(params.from, params.to);

    if (params.q) {
      const escaped = params.q.replaceAll("%", "\\%").replaceAll("_", "\\_");
      query = query.or(`full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`);
    }

    return query;
  },
  listLoyaltyPointsForUsers(userIds: string[]) {
    return getSupabaseAdmin()
      .from("loyalty_points")
      .select("user_id, points, tier")
      .in("user_id", userIds);
  },
  listOrdersForUsers(userIds: string[]) {
    return getSupabaseAdmin().from("orders").select("id, user_id").in("user_id", userIds);
  },
  listTopLoyaltyUsers(limit: number) {
    return getSupabaseAdmin()
      .from("loyalty_points")
      .select("*")
      .order("points", { ascending: false })
      .limit(limit);
  },
  listRecentLoyaltyHistory(limit: number) {
    return getSupabaseAdmin()
      .from("loyalty_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
  },
  listAllLoyaltyPoints() {
    return getSupabaseAdmin().from("loyalty_points").select("user_id, points");
  },
  listLoyaltyHistorySince(sinceIso: string) {
    return getSupabaseAdmin()
      .from("loyalty_history")
      .select("points_change")
      .gte("created_at", sinceIso);
  },
  listProfilesByIds(ids: string[]) {
    return getSupabaseAdmin().from("profiles").select("id, full_name, email").in("id", ids);
  },
};

