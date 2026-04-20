/**
 * Utilitas validasi untuk formulir checkout
 * Validasi khusus data Indonesia (NIK, Kode Pos)
 */

/**
 * Menghapus karakter non-numerik dari string
 */
function cleanNumericString(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Memvalidasi NIK Indonesia (16 digit)
 * @param nik - NIK dengan atau tanpa format
 * @returns true jika NIK valid
 */
export function validateNIK(nik: string): boolean {
  const cleaned = cleanNumericString(nik);

  // Harus berjumlah tepat 16 digit
  if (cleaned.length !== 16) {
    return false;
  }

  // Validasi dasar: semua digit tidak boleh sama
  if (/^(\d)\1{15}$/.test(cleaned)) {
    return false;
  }

  return true;
}

/**
 * Memformat NIK untuk tampilan (XXXX XXXX XXXX XXXX)
 */
export function formatNIK(nik: string): string {
  const cleaned = cleanNumericString(nik);
  if (cleaned.length !== 16) return nik;
  return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
}

/**
 * Memvalidasi Kode Pos Indonesia (5 digit)
 * @param zip - Kode pos dengan atau tanpa format
 * @returns true jika kode pos valid
 */
export function validateZIP(zip: string): boolean {
  const cleaned = cleanNumericString(zip);
  // Kode pos Indonesia harus tepat 5 digit
  return cleaned.length === 5 && /^\d{5}$/.test(cleaned);
}

/**
 * Memformat kode pos untuk tampilan (XXXXX)
 */
export function formatZIP(zip: string): string {
  const cleaned = cleanNumericString(zip);
  return cleaned.slice(0, 5);
}

/**
 * Memvalidasi email (format dasar)
 * @param email - Email yang divalidasi
 * @returns true jika format valid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Memvalidasi nomor telepon Indonesia
 * @param phone - Nomor telepon dengan atau tanpa format
 * @returns true jika nomor valid (10-13 digit)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = cleanNumericString(phone);
  // Nomor Indonesia umumnya 10-13 digit, diawali 08 atau 8
  return cleaned.length >= 10 && cleaned.length <= 13;
}

/**
 * Memformat nomor telepon Indonesia untuk tampilan (0812-3456-7890)
 */
export function formatPhone(phone: string): string {
  const cleaned = cleanNumericString(phone);
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{2,5})/, "$1-$2-$3");
  }
  return phone;
}

/**
 * Interface data alamat
 */
export interface AddressData {
  zip: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

/**
 * Memvalidasi data alamat secara lengkap
 */
export function validateAddress(address: AddressData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateZIP(address.zip)) {
    errors.push("Kode Pos tidak valid (harus 5 digit)");
  }

  if (!address.street || address.street.trim().length < 3) {
    errors.push("Alamat lengkap minimal 3 karakter");
  }

  if (!address.number || address.number.trim().length === 0) {
    errors.push("Nomor rumah/bangunan wajib diisi");
  }

  if (!address.neighborhood || address.neighborhood.trim().length < 2) {
    errors.push("Kecamatan/Kelurahan minimal 2 karakter");
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push("Kota/Kabupaten minimal 2 karakter");
  }

  if (!address.state || address.state.length < 3) {
    errors.push("Silakan pilih Provinsi");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
