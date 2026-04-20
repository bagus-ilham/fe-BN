/**
 * Utilitas untuk mengambil alamat via kode pos
 * Untuk Indonesia, ini masih placeholder karena belum ada
 * API publik gratis yang andal seperti ViaCEP.
 */

export interface ZIPResponse {
  zip: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  error?: boolean;
}

/**
 * Mengambil alamat lengkap dari kode pos (placeholder untuk Indonesia)
 * @param zip - kode pos
 * @returns Data alamat atau null jika tidak ditemukan
 */
export async function fetchAddressByZIP(
  zip: string,
): Promise<ZIPResponse | null> {
  // Bersihkan kode pos (hapus format)
  const cleanedZIP = zip.replace(/\D/g, "");

  if (cleanedZIP.length !== 5) {
    return null;
  }

  // Logika placeholder: alamat Indonesia umumnya butuh data tambahan
  // agar akurat hingga level jalan.
  return null;
}
