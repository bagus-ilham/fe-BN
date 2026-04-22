import { marketingRepository } from "@/lib/repositories/marketing-repository";
import { formatPrice } from "@/utils/format";
import type { Json } from "@/types/database";

export async function listFlashSalesForAdmin() {
  const { data, error } = await marketingRepository.listFlashSalesForAdmin();
  if (error) throw error;
  return data;
}

export async function listAbandonedCheckouts() {
  const { data, error } = await marketingRepository.listAbandonedCheckouts();
  if (error) throw error;
  return data;
}

type AbandonedCheckoutRow = {
  id: string;
  email: string;
  phone: string | null;
  cart_items: Json;
  status: "pending" | "converted" | "sent" | "failed";
  captured_at: string;
};

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function extractItemTotal(item: unknown): number {
  if (!item || typeof item !== "object") return 0;
  const obj = item as Record<string, unknown>;
  const qty = Math.max(1, toNumber(obj.quantity));
  const unitPrice = toNumber(obj.price) || toNumber(obj.sale_price) || toNumber(obj.unit_price) || toNumber(obj.base_price);
  const lineTotal = toNumber(obj.total) || toNumber(obj.line_total) || toNumber(obj.subtotal);
  if (lineTotal > 0) return lineTotal;
  if (unitPrice > 0) return unitPrice * qty;
  return 0;
}

function extractCartTotal(cartItems: Json): number {
  if (Array.isArray(cartItems)) {
    let total = 0;
    for (const item of cartItems) {
      total += extractItemTotal(item);
    }
    return total;
  }

  if (cartItems && typeof cartItems === "object") {
    const obj = cartItems as Record<string, unknown>;
    const directTotal =
      toNumber(obj.total) ||
      toNumber(obj.grand_total) ||
      toNumber(obj.subtotal) ||
      toNumber(obj.cart_total) ||
      toNumber(obj.amount);
    if (directTotal > 0) return directTotal;
    if (Array.isArray(obj.items)) {
      let total = 0;
      for (const item of obj.items) {
        total += extractItemTotal(item);
      }
      return total;
    }
  }

  return 0;
}

export async function getAdminAbandonedCheckoutOverview() {
  const rows = ((await listAbandonedCheckouts()) || []) as AbandonedCheckoutRow[];

  const rowsWithTotals = rows.map((row) => ({
    ...row,
    cartTotal: extractCartTotal(row.cart_items),
  }));

  const totalDetected = rowsWithTotals.length;
  const recoveredCount = rowsWithTotals.filter((row) => row.status === "converted").length;
  const sentRemindersCount = rowsWithTotals.filter((row) => row.status === "sent").length;
  const pendingRemindersCount = rowsWithTotals.filter((row) => row.status === "pending").length;
  const potentialRevenue = rowsWithTotals.reduce((sum, row) => sum + row.cartTotal, 0);
  const recoveredRate = totalDetected > 0 ? Math.round((recoveredCount / totalDetected) * 100) : 0;

  return {
    rows: rowsWithTotals,
    stats: {
      totalDetected,
      recoveredCount,
      recoveredRate,
      sentRemindersCount,
      pendingRemindersCount,
      potentialRevenue,
      potentialRevenueLabel: formatPrice(potentialRevenue),
    },
  };
}

export async function listVipEntries() {
  const { data, error } = await marketingRepository.listVipEntries();
  if (error) throw error;
  return data;
}

export async function listEmailSequences() {
  const { data, error } = await marketingRepository.listEmailSequences();
  if (error) throw error;
  return data;
}

export async function getAdminWaitlistOverview() {
  const { data, error } = await marketingRepository.listWaitlistForAdmin();
  if (error) return { waitlist: [], sortedWaitlist: [] as Array<[string, number]> };

  type WaitlistRow = {
    id: string;
    email: string;
    created_at: string;
    notified_at?: string | null;
    products?: { name?: string | null } | null;
  };

  const waitlist = (data || []) as WaitlistRow[];
  const productWaitCounts = waitlist.reduce((acc: Record<string, number>, item) => {
    const name = item.products?.name || "Unknown Product";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const sortedWaitlist = Object.entries(productWaitCounts).sort((a, b) => b[1] - a[1]);
  return { waitlist, sortedWaitlist };
}

export async function updateFlashSaleStatus(id: string, is_active: boolean) {
  const { error } = await marketingRepository.updateFlashSaleStatus(id, is_active);
  if (error) throw error;
  return true;
}

export async function getActiveFlashSale() {
  const now = new Date().toISOString();
  const { data, error } = await marketingRepository.getActiveFlashSale(now);
  if (error) return null;
  return data;
}
