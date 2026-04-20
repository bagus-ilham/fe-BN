/**
 * Analytics — Google Analytics 4 (GA4)
 * E-commerce events for conversion funnel.
 * Only sends when NEXT_PUBLIC_GA_MEASUREMENT_ID is defined.
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ??
  process.env.NEXT_PUBLIC_GA_ID?.trim();

function isAvailable(): boolean {
  return typeof window !== "undefined" && !!GA_ID && !!window.gtag;
}

/** Item in GA4 e-commerce format */
export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_variant?: string;
}

function toGA4Items(
  items: Array<{ id: string; name: string; price: number; quantity: number; category?: string }>
): AnalyticsItem[] {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
    item_category: item.category,
  }));
}

/**
 * view product or kit
 */
export function trackViewItem(params: {
  itemId: string;
  itemName: string;
  price: number;
  category?: string;
  isKit?: boolean;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "view_item", {
    currency: "IDR",
    value: params.price,
    items: [
      {
        item_id: params.itemId,
        item_name: params.itemName,
        price: params.price,
        quantity: 1,
        item_category: params.category ?? (params.isKit ? "Kit" : "Product"),
      },
    ],
  });
}

/** Cart view (when opening the drawer) */
export function trackViewCart(params: {
  value: number;
  items: Array<{ id: string; name: string; price: number; quantity: number; category?: string }>;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "view_cart", {
    currency: "IDR",
    value: params.value,
    items: toGA4Items(params.items),
  });
}

/** Item selection in list (click to view product/kit) — attribution */
export function trackSelectItem(params: {
  itemId: string;
  itemName: string;
  price: number;
  category?: string;
  isKit?: boolean;
  itemListId?: string;
  itemListName?: string;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "select_item", {
    currency: "IDR",
    value: params.price,
    items: [
      {
        item_id: params.itemId,
        item_name: params.itemName,
        price: params.price,
        quantity: 1,
        item_category: params.category ?? (params.isKit ? "Kit" : "Product"),
        ...(params.itemListId && { item_list_id: params.itemListId }),
        ...(params.itemListName && { item_list_name: params.itemListName }),
      },
    ],
  });
}

/** Tambah ke keranjang (produk) */
export function trackAddToCart(params: {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  category?: string;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "add_to_cart", {
    currency: "IDR",
    value: params.price * params.quantity,
    items: toGA4Items([
      {
        id: params.itemId,
        name: params.itemName,
        price: params.price,
        quantity: params.quantity,
        category: params.category,
      },
    ]),
  });
}

/** Removal from cart (for full funnel) */
export function trackRemoveFromCart(params: {
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  category?: string;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "remove_from_cart", {
    currency: "IDR",
    value: params.price * params.quantity,
    items: toGA4Items([
      {
        id: params.itemId,
        name: params.itemName,
        price: params.price,
        quantity: params.quantity,
        category: params.category,
      },
    ]),
  });
}

/** Payment information added (e.g. user saw QR PIX) — add_payment_info funnel */
export function trackAddPaymentInfo(params: {
  value: number;
  paymentMethod: "pix" | "card";
  items: Array<{ id: string; name: string; price: number; quantity: number; category?: string }>;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "add_payment_info", {
    currency: "IDR",
    value: params.value,
    payment_type: params.paymentMethod,
    items: toGA4Items(params.items),
  });
}

/** Mulai checkout */
export function trackBeginCheckout(params: {
  value: number;
  items: Array<{ id: string; name: string; price: number; quantity: number; category?: string }>;
  coupon?: string | null;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "begin_checkout", {
    currency: "IDR",
    value: params.value,
    items: toGA4Items(params.items),
    ...(params.coupon && { coupon: params.coupon }),
  });
}

/** Purchase completed */
export function trackPurchase(params: {
  transactionId: string;
  value: number;
  items: Array<{ id: string; name: string; price: number; quantity: number; category?: string }>;
  coupon?: string | null;
}): void {
  if (!isAvailable()) return;
  window.gtag!("event", "purchase", {
    transaction_id: params.transactionId,
    currency: "IDR",
    value: params.value,
    items: toGA4Items(params.items),
    ...(params.coupon && { coupon: params.coupon }),
  });
}
