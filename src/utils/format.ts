/**
 * Memformat angka sebagai harga dalam Rupiah (Rp)
 * @param price - Harga yang akan diformat
 * @returns String terformat seperti "Rp 299.900"
 */
export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Memformat nomor telepon Indonesia
 * Menerima nomor dengan atau tanpa kode negara (+62)
 * Format: (0XX) XXXXX-XXXX atau +62 XX XXXXX-XXXX
 * @param phone - Nomor telepon yang akan diformat
 * @returns String terformat
 */
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, "");
  if (numbers.length === 0) return "";

  // Jika diawali 62 atau +62
  if (numbers.startsWith("62")) {
  const limited = numbers.substring(0, 14); // Batas panjang untuk keamanan
    if (limited.length <= 2) return `+${limited}`;
    if (limited.length <= 5) return `+${limited.substring(0, 2)} ${limited.substring(2)}`;
    if (limited.length <= 9) return `+${limited.substring(0, 2)} ${limited.substring(2, 5)}-${limited.substring(5)}`;
    return `+${limited.substring(0, 2)} ${limited.substring(2, 5)}-${limited.substring(5, 9)}-${limited.substring(9)}`;
  }

  // Format lokal Indonesia (diawali 08...)
  const limited = numbers.substring(0, 13);
  if (limited.length <= 4) return limited;
  if (limited.length <= 8) return `${limited.substring(0, 4)}-${limited.substring(4)}`;
  if (limited.length <= 12) return `${limited.substring(0, 4)}-${limited.substring(4, 8)}-${limited.substring(8)}`;
  return `${limited.substring(0, 4)}-${limited.substring(4, 8)}-${limited.substring(8, 13)}`;
}
