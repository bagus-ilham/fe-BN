import { userRepository } from "@/lib/repositories/user-repository";

type ProfileLite = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  created_at?: string;
};

type LoyaltyRow = {
  user_id: string;
  points: number;
  tier: string;
};

type OrderUserRow = {
  user_id: string;
};

type LoyaltyHistoryRow = {
  user_id: string;
};

export async function getLoyaltyInfo(userId: string) {
  const { data, error } = await userRepository.getLoyaltyInfo(userId);

  if (error) {
    console.error("Error fetching loyalty info:", error);
    return null;
  }

  return data;
}

export async function getLoyaltyHistory(userId: string) {
  const { data, error } = await userRepository.getLoyaltyHistory(userId);

  if (error) {
    console.error("Error fetching loyalty history:", error);
    return [];
  }

  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await userRepository.getProfile(userId);

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function getUserAddresses(userId: string) {
  const { data, error } = await userRepository.getAddresses(userId);

  if (error) {
    console.error("Error fetching user addresses:", error);
    return [];
  }

  return data;
}

export async function getUserWishlist(userId: string) {
  const { data, error } = await userRepository.getWishlist(userId);

  if (error) {
    console.error("Error fetching user wishlist:", error);
    return [];
  }

  return data;
}

export async function getAdminCustomersOverview() {
  const { data: customers, error: customersError } = await userRepository.listProfilesForAdmin();
  if (customersError || !customers) {
    console.error("Error fetching admin customers:", customersError);
    return [];
  }

  const userIds = (customers as ProfileLite[]).map((c) => c.id).filter(Boolean);
  if (userIds.length === 0) return [];

  const [{ data: loyaltyRows }, { data: ordersRows }] = await Promise.all([
    userRepository.listLoyaltyPointsForUsers(userIds),
    userRepository.listOrdersForUsers(userIds),
  ]);
  const safeLoyaltyRows = (loyaltyRows || []) as LoyaltyRow[];
  const safeOrdersRows = (ordersRows || []) as OrderUserRow[];

  const loyaltyMap = new Map<string, { points: number; tier: string }>();
  safeLoyaltyRows.forEach((row) => {
    loyaltyMap.set(row.user_id, {
      points: row.points || 0,
      tier: row.tier || "Bronze",
    });
  });

  const orderCountMap = new Map<string, number>();
  safeOrdersRows.forEach((row) => {
    orderCountMap.set(row.user_id, (orderCountMap.get(row.user_id) || 0) + 1);
  });

  return (customers as ProfileLite[]).map((customer) => {
    const loyalty = loyaltyMap.get(customer.id) || { points: 0, tier: "Bronze" };
    return {
      ...customer,
      loyalty_points: [loyalty],
      orders_count: orderCountMap.get(customer.id) || 0,
    };
  });
}

export async function getAdminCustomersOverviewPaged(input: {
  page: number;
  pageSize: number;
  q?: string;
  loyalty?: "loyal" | "regular";
}) {
  const pageSize = Math.min(Math.max(input.pageSize || 20, 10), 100);
  const page = Math.max(input.page || 1, 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = input.q?.trim();

  const { data: customers, error: customersError, count } = await userRepository.listProfilesForAdminPaged({
    from,
    to,
    q: q && q.length > 0 ? q : undefined,
  });

  if (customersError || !customers) {
    console.error("Error fetching paged admin customers:", customersError);
    return { data: [], total: 0, page, pageSize };
  }

  const userIds = (customers as ProfileLite[]).map((c) => c.id).filter(Boolean);
  if (userIds.length === 0) {
    return { data: [], total: count || 0, page, pageSize };
  }

  const [{ data: loyaltyRows }, { data: ordersRows }] = await Promise.all([
    userRepository.listLoyaltyPointsForUsers(userIds),
    userRepository.listOrdersForUsers(userIds),
  ]);
  const safeLoyaltyRows = (loyaltyRows || []) as LoyaltyRow[];
  const safeOrdersRows = (ordersRows || []) as OrderUserRow[];

  const loyaltyMap = new Map<string, { points: number; tier: string }>();
  safeLoyaltyRows.forEach((row) => {
    loyaltyMap.set(row.user_id, {
      points: row.points || 0,
      tier: row.tier || "Bronze",
    });
  });

  const orderCountMap = new Map<string, number>();
  safeOrdersRows.forEach((row) => {
    orderCountMap.set(row.user_id, (orderCountMap.get(row.user_id) || 0) + 1);
  });

  const mapped = (customers as ProfileLite[]).map((customer) => {
    const loyaltyData = loyaltyMap.get(customer.id) || { points: 0, tier: "Bronze" };
    return {
      ...customer,
      loyalty_points: [loyaltyData],
      orders_count: orderCountMap.get(customer.id) || 0,
    };
  });

  const filtered =
    input.loyalty === "loyal"
      ? mapped.filter((customer) => (customer.loyalty_points?.[0]?.points || 0) > 0)
      : input.loyalty === "regular"
        ? mapped.filter((customer) => (customer.loyalty_points?.[0]?.points || 0) <= 0)
        : mapped;

  return {
    data: filtered,
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getAdminLoyaltyOverview(limit = 10) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [{ data: topUsers }, { data: recentHistory }, { data: loyaltyPoints }, { data: monthlyHistory }] = await Promise.all([
    userRepository.listTopLoyaltyUsers(limit),
    userRepository.listRecentLoyaltyHistory(limit),
    userRepository.listAllLoyaltyPoints(),
    userRepository.listLoyaltyHistorySince(thirtyDaysAgo.toISOString()),
  ]);
  const safeTopUsers = (topUsers || []) as LoyaltyRow[];
  const safeRecentHistory = (recentHistory || []) as LoyaltyHistoryRow[];
  const safeLoyaltyPoints = (loyaltyPoints || []) as LoyaltyRow[];
  const safeMonthlyHistory = (monthlyHistory || []) as Array<{ points_change: number }>;

  const profileIds = Array.from(
    new Set(
      [
        ...safeTopUsers.map((u) => u.user_id).filter(Boolean),
        ...safeRecentHistory.map((h) => h.user_id).filter(Boolean),
      ],
    ),
  );

  const { data: profiles } =
    profileIds.length > 0 ? await userRepository.listProfilesByIds(profileIds) : { data: [] as ProfileLite[] };

  const profileMap = new Map<string, { full_name?: string | null; email?: string | null }>();
  ((profiles || []) as ProfileLite[]).forEach((p) => {
    profileMap.set(p.id, { full_name: p.full_name, email: p.email });
  });

  const normalizedTopUsers = safeTopUsers.map((u) => ({
    ...u,
    profiles: u.user_id ? profileMap.get(u.user_id) ?? null : null,
  }));

  const normalizedRecentHistory = safeRecentHistory.map((h) => ({
    ...h,
    auth_users: h.user_id ? { email: profileMap.get(h.user_id)?.email ?? null } : null,
  }));

  const totalPointsIssued = safeMonthlyHistory
    .filter((row) => Number(row.points_change) > 0)
    .reduce((sum, row) => sum + Number(row.points_change), 0);
  const totalPointsRedeemed = Math.abs(
    safeMonthlyHistory
      .filter((row) => Number(row.points_change) < 0)
      .reduce((sum, row) => sum + Number(row.points_change), 0),
  );
  const activeMembers = safeLoyaltyPoints.filter((row) => Number(row.points) > 0).length;
  const referralConversionRate = totalPointsIssued > 0 ? (totalPointsRedeemed / totalPointsIssued) * 100 : 0;

  return {
    topUsers: normalizedTopUsers,
    recentHistory: normalizedRecentHistory,
    stats: {
      totalPointsIssued,
      activeMembers,
      totalPointsRedeemed,
      referralConversionRate,
    },
  };
}
