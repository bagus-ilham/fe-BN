import { orderRepository } from "@/lib/repositories/order-repository";

type OrderWithShipments = {
  shipments?: Array<{ courier_company?: string | null }> | null;
} & Record<string, unknown>;

function mapColorSummary(orders: OrderWithShipments[]) {
  return orders.map((order) => ({
    ...order,
    tracking_carrier: order.shipments?.[0]?.courier_company || null,
  }));
}

export async function listOrdersForUser(userId: string) {
  const { data, error } = await orderRepository.listByUserId(userId);
  if (error) throw error;
  return mapColorSummary((data || []) as OrderWithShipments[]);
}

export async function updateOrderStatusWithShipment(params: {
  orderId: string;
  status: string;
  trackingCode?: string;
  courier?: string;
}) {
  const { data, error } = await orderRepository.updateStatus(params.orderId, params.status);
  if (error) throw error;

  if (params.trackingCode) {
    const { error: shipmentError } = await orderRepository.upsertShipment({
      order_id: params.orderId,
      tracking_number: params.trackingCode,
      courier_company: params.courier || "Kurir",
      status: params.status === "delivered" ? "delivered" : "shipped",
    });
    if (shipmentError) throw shipmentError;
  }

  return data;
}

