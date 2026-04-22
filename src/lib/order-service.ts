import { orderRepository } from "@/lib/repositories/order-repository";
import { listOrdersForUser, updateOrderStatusWithShipment } from "@/lib/use-cases/order-use-cases";

type ProfileRow = { id: string } & Record<string, unknown>;
type OrderItemLite = { product_id: string; product_name: string; price: number; quantity: number };
type OrderWithUser = { user_id?: string | null } & Record<string, unknown>;

export type AdminOrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type ListOrdersAdminInput = {
  page: number;
  pageSize: number;
  status?: AdminOrderStatus;
  q?: string;
};

async function getProfilesMap(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, ProfileRow>();
  const { data } = await orderRepository.getProfilesByIds(userIds);
  const map = new Map<string, ProfileRow>();
  ((data || []) as ProfileRow[]).forEach((profile) => {
    map.set(profile.id, profile);
  });
  return map;
}

export async function listAllOrdersForAdmin(): Promise<Array<Record<string, unknown>>> {
  const { data, error } = await orderRepository.listAll();

  if (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }

  const orders = (data || []) as OrderWithUser[];
  const userIds = Array.from(
    new Set(orders.map((o) => o.user_id).filter(Boolean))
  ) as string[];
  const profileMap = await getProfilesMap(userIds);

  return orders.map((order) => ({
    ...order,
    profiles: order.user_id ? profileMap.get(order.user_id) ?? null : null,
  }));
}

export async function listOrdersForAdminPaged(input: ListOrdersAdminInput): Promise<{
  data: Array<Record<string, unknown>>;
  total: number;
  page: number;
  pageSize: number;
}> {
  const pageSize = Math.min(Math.max(input.pageSize || 20, 10), 100);
  const page = Math.max(input.page || 1, 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const q = input.q?.trim();

  const { data, error, count } = await orderRepository.listAdminPaged({
    from,
    to,
    status: input.status,
    q: q && q.length > 0 ? q : undefined,
  });

  if (error) {
    console.error("Error fetching paged orders:", error);
    return { data: [], total: 0, page, pageSize };
  }

  const orders = (data || []) as OrderWithUser[];
  const userIds = Array.from(new Set(orders.map((o) => o.user_id).filter(Boolean))) as string[];
  const profileMap = await getProfilesMap(userIds);

  return {
    data: orders.map((order) => ({
      ...order,
      profiles: order.user_id ? profileMap.get(order.user_id) ?? null : null,
    })),
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getAdminOrderStatusCounts(): Promise<{
  pending: number;
  paid: number;
  shipped: number;
}> {
  const [pendingRes, paidRes, shippedRes] = await Promise.all([
    orderRepository.countByStatus("pending"),
    orderRepository.countByStatus("paid"),
    orderRepository.countByStatus("shipped"),
  ]);

  return {
    pending: pendingRes.count || 0,
    paid: paidRes.count || 0,
    shipped: shippedRes.count || 0,
  };
}

export async function listUserOrders(userId: string): Promise<Array<Record<string, unknown>>> {
  try {
    return await listOrdersForUser(userId);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<Record<string, unknown> | null> {
  const { data, error } = await orderRepository.getById(orderId);

  if (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }

  let profile = null;
  if (data?.user_id) {
    const { data: profileData } = await orderRepository.getProfileById(data.user_id);
    profile = profileData ?? null;
  }

  return {
    ...data,
    profiles: profile,
  };
}

export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  trackingCode?: string,
  courier?: string
) {
  return updateOrderStatusWithShipment({
    orderId,
    status,
    trackingCode,
    courier,
  });
}

export async function listOrderReturnsForAdmin(): Promise<Array<Record<string, unknown>>> {
  const { data, error } = await orderRepository.listReturnsForAdmin();
  if (error) {
    console.error("Error fetching order returns:", error);
    return [];
  }
  return data || [];
}

export async function verifyOrderByPaymentReference(sessionId: string) {
  const { data: order, error } = await orderRepository.getByPaymentOrderId(sessionId);
  if (error) {
    console.error("Error verifying order:", error);
    return null;
  }
  if (!order) {
    return { exists: false as const };
  }

  const { data: items } = await orderRepository.listItemsByOrderId(order.id);
  const normalizedItems = ((items || []) as OrderItemLite[]).map((i) => ({
    id: i.product_id,
    name: i.product_name,
    price: i.price,
    quantity: i.quantity,
  }));

  return {
    exists: true as const,
    orderId: order.id,
    status: order.status,
    createdAt: order.created_at,
    totalAmount: order.total_amount,
    customerEmail: order.customer_email ?? null,
    items: normalizedItems,
  };
}
