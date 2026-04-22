export const API_ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Terjadi kesalahan pada server",
  UNAUTHORIZED: "Tidak memiliki otorisasi",
  TOO_MANY_REQUESTS: "Terlalu banyak permintaan",
  INVALID_JSON: "JSON tidak valid.",
  INVALID_EMAIL: "Email tidak valid.",
} as const;

export const AUTH_ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email wajib diisi",
  RESEND_RATE_LIMITED: "Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa menit sebelum mencoba lagi.",
  RESEND_FAILED: "Gagal mengirim ulang email",
} as const;

export const WAITLIST_ERROR_MESSAGES = {
  INVALID_EMAIL_FORMAT: "Format email tidak valid",
} as const;

export const VIP_LIST_ERROR_MESSAGES = {
  TOO_MANY_ATTEMPTS: "Terlalu banyak percobaan. Mohon tunggu sebentar lalu coba lagi.",
  INVALID_DATA_FORMAT: "Format data tidak valid",
  EMAIL_REQUIRED: "Email wajib diisi",
  FULL_NAME_REQUIRED: "Nama lengkap wajib diisi",
  REGISTRATION_FAILED: "Gagal memproses pendaftaran VIP",
  UNEXPECTED_ERROR: "Terjadi kesalahan tak terduga. Silakan coba lagi.",
  UNKNOWN_ERROR: "Kesalahan tidak diketahui",
} as const;

export const ORDER_ERROR_MESSAGES = {
  REFERENCE_REQUIRED: "order_id, session_id, atau payment_intent wajib diisi",
  VERIFY_FAILED: "Gagal memverifikasi pesanan",
  CUSTOMER_EMAIL_REQUIRED: "Email pelanggan wajib diisi",
  ORDER_ID_AND_ITEMS_REQUIRED: "ID pesanan dan item wajib diisi",
  SEND_CONFIRMATION_FAILED: "Gagal mengirim email",
} as const;

export const REVIEWS_ERROR_MESSAGES = {
  PRODUCT_ID_REQUIRED: "product_id wajib diisi",
  FETCH_REVIEWS_FAILED: "Gagal mengambil data ulasan",
  FETCH_SUMMARY_FAILED: "Gagal mengambil ringkasan ulasan",
  UPLOAD_TOO_MANY_ATTEMPTS: "Terlalu banyak percobaan. Mohon tunggu sebentar.",
  INVALID_IMAGE: "Gambar tidak valid.",
  INVALID_PRODUCT_ID: "product_id tidak valid.",
  INVALID_IMAGE_FORMAT: "Format tidak valid. Gunakan JPG, PNG, atau WEBP.",
  IMAGE_TOO_LARGE: "Ukuran gambar terlalu besar. Maksimum 3 MB.",
  IMAGE_UPLOAD_FAILED: "Gagal mengunggah gambar.",
} as const;

export const INVENTORY_ERROR_MESSAGES = {
  FETCH_STATUS_FAILED: "Gagal mengambil status stok",
  PRODUCT_NOT_FOUND: "Produk tidak ditemukan",
  INVALID_QUANTITY: "Quantity harus lebih besar dari 0",
  RESERVATION_FAILED: "Gagal melakukan reservasi stok",
} as const;

export const CHECKOUT_ERROR_MESSAGES = {
  MIDTRANS_NOT_CONFIGURED: "Konfigurasi gerbang pembayaran belum tersedia",
  CREATE_TRANSACTION_FAILED: "Gagal membuat transaksi",
} as const;

export const AUTH_MESSAGES = {
  RESEND_CONFIRMATION_SENT: "Email konfirmasi telah dikirim. Cek kotak masuk dan folder spam Anda.",
  RESEND_CONFIRMATION_RESENT: "Email konfirmasi berhasil dikirim ulang. Cek kotak masuk dan folder spam Anda.",
  RESEND_CONFIRMATION_GENERIC: "Jika email terdaftar dan belum terkonfirmasi, Anda akan menerima email dalam beberapa saat. Cek kotak masuk dan folder spam Anda.",
} as const;

export const WAITLIST_MESSAGES = {
  ALREADY_REGISTERED: "Email sudah terdaftar di daftar tunggu produk ini",
  NOTIFICATION_SET: "Anda akan diberi tahu saat produk kembali tersedia",
} as const;

export const VIP_LIST_MESSAGES = {
  ENROLLED: "Anda berhasil ditambahkan ke daftar VIP!",
} as const;

export const ORDER_MESSAGES = {
  NOT_PROCESSED: "Pesanan belum diproses",
} as const;

export function requiredFieldsMessage(fields: string[]) {
  return `Field wajib belum lengkap: ${fields.join(", ")}`;
}

export function cleanupReservationsSuccessMessage(cleaned: number) {
  return `Berhasil membersihkan ${cleaned} reservasi yang kedaluwarsa`;
}

export function orderImagesUpdatedMessage(updated: number, failed: number) {
  return `Pembaruan selesai. ${updated} item diperbarui, ${failed} gagal.`;
}
