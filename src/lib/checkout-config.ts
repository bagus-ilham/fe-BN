/**
 * Konfigurasi Checkout Bersama — benangbaju
 * Pengiriman, Diskon Transfer, dan Batas Stok (digunakan di halaman checkout dan API).
 */

export const FREE_SHIPPING_THRESHOLD = 300000; // Rp 300.000
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

/** Menampilkan "Stok Terakhir!" ketika available_quantity <= nilai ini. */
/** Kupon pertama kali belanja: gratis ongkir. Hanya sekali pakai per pelanggan. */
export const COUPON_CODE_BENANG10 = "BENANG10";
export const COUPON_BENANG10_DISCOUNT_PERCENT = 0;

/** Timezone untuk format tanggal (Indonesia/Jakarta) */
export const PAYMENT_TIMEZONE = "Asia/Jakarta";

/** Masa berlaku QR Code / Transfer dalam detik (1 jam) */
export const PAYMENT_EXPIRATION_SECONDS = 3600;


