/**
 * Konfigurasi Checkout Bersama — benangbaju
 * PENTING: Nilai FREE_SHIPPING_THRESHOLD harus konsisten dengan
 * site_settings.free_shipping_threshold di database.
 * Jika diubah via admin panel, perbarui nilai di sini juga.
 */

export const FREE_SHIPPING_THRESHOLD = 500000; // Rp 500.000 (sync dengan seed_data.sql)
export const PAYMENT_DISCOUNT_PERCENT = 0.05; // 5% diskon transfer bank / QRIS

/**
 * Pengiriman Lokal (pengiriman hari yang sama di kota tertentu).
 * Kode pos yang dimulai dengan LOCAL_DELIVERY_PREFIX akan menerima opsi biaya tertentu.
 */
export const LOCAL_DELIVERY_PREFIX =
  process.env.LOCAL_DELIVERY_PREFIX?.trim()?.replace(/\D/g, "") ?? "";
/** Nilai pengiriman lokal dalam Rupiah. 0 = gratis. Default: 0 (gratis). */
export const LOCAL_DELIVERY_PRICE =
  Number(process.env.LOCAL_DELIVERY_PRICE?.trim()) || 0;
export const MAX_INSTALLMENTS = 3;

/**
 * Menampilkan "Sisa Sedikit" ketika available_quantity <= nilai ini.
 */
export const LOW_STOCK_DISPLAY_THRESHOLD =
  Number(process.env.LOW_STOCK_DISPLAY_THRESHOLD?.trim()) || 150;

/**
 * Kupon BENANG10: diskon 10% dari subtotal produk.
 * PENTING: Validasi sesungguhnya dilakukan di RPC create_order_v2 di database.
 * Nilai di sini hanya untuk preview UI di halaman checkout.
 */
export const COUPON_CODE_BENANG10 = "BENANG10";
export const COUPON_BENANG10_DISCOUNT_PERCENT = 0.10; // 10% diskon

/** Timezone untuk format tanggal (Indonesia/Jakarta) */
export const PAYMENT_TIMEZONE = "Asia/Jakarta";

/** Masa berlaku QR Code / Transfer dalam detik (1 jam) */
export const PAYMENT_EXPIRATION_SECONDS = 3600;


