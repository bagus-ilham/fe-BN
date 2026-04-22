/**
 * Meta Pixel (Facebook Pixel) - event e-commerce dengan Advanced Matching.
 * Menggunakan SHA-256 native (Web Crypto API) untuk hash email sebelum dikirim ke Meta.
 * Hanya berjalan jika NEXT_PUBLIC_FB_PIXEL_ID tersedia.
 *
 * Event yang diimplementasikan:
 *   ViewContent      - melihat produk atau kit
 *   AddToCart        - item ditambahkan ke keranjang
 *   InitiateCheckout - mulai checkout
 *   Purchase         - pembelian selesai (dengan email ter-hash)
 *
 * Referensi: https://developers.facebook.com/docs/meta-pixel/reference
 */

declare global {
  interface Window {
    fbq?: (
      command: string,
      event: string,
      data?: Record<string, unknown>,
      options?: Record<string, unknown>,
    ) => void;
  }
}

function isAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim() &&
    typeof window.fbq === "function"
  );
}

/** SHA-256 via Web Crypto API - mengembalikan string hex. */
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Normalisasi dan hash email sesuai spesifikasi Meta. */
export async function hashEmail(email: string): Promise<string> {
  return sha256(email.trim().toLowerCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// Event pixel
// ─────────────────────────────────────────────────────────────────────────────

// Constant to simulate success
const MOCK_MODE = process.env.NODE_ENV === 'development';

/** Event tambah ke keranjang. */
export function fbTrackAddToCart(params: {
  contentId: string;
  contentName: string;
  value: number;
  quantity?: number;
}): void {
  if (MOCK_MODE) {
    console.log(`[MOCK PIXEL] AddToCart: ${params.contentName}`, params);
    return;
  }
  if (!isAvailable()) return;
  window.fbq!("track", "AddToCart", {
    content_ids: [params.contentId],
    content_name: params.contentName,
    content_type: "product",
    value: params.value,
    currency: "IDR",
  });
}

/** Event mulai checkout. */
export function fbTrackInitiateCheckout(params: {
  value: number;
  numItems: number;
  contentIds: string[];
}): void {
  if (MOCK_MODE) {
    console.log(`[MOCK PIXEL] InitiateCheckout`, params);
    return;
  }
  if (!isAvailable()) return;
  window.fbq!("track", "InitiateCheckout", {
    value: params.value,
    currency: "IDR",
    num_items: params.numItems,
    content_ids: params.contentIds,
  });
}

/** Purchase completed. */
export async function fbTrackPurchase(params: {
  transactionId: string;
  value: number;
  contentIds: string[];
  numItems: number;
  email?: string | null;
}): Promise<void> {
  if (MOCK_MODE) {
    console.log(`[MOCK PIXEL] Purchase: ${params.transactionId}`, params);
    return;
  }
  if (!isAvailable()) return;

  // Hashed email for Advanced Matching if available
  if (params.email) {
    const hashedEmail = await hashEmail(params.email);
    window.fbq!("track", "Purchase", {
      value: params.value,
      currency: "IDR",
      transaction_id: params.transactionId,
      content_ids: params.contentIds,
      num_items: params.numItems,
    }, { em: hashedEmail });
  } else {
    window.fbq!("track", "Purchase", {
      value: params.value,
      currency: "IDR",
      transaction_id: params.transactionId,
      content_ids: params.contentIds,
      num_items: params.numItems,
    });
  }
}
