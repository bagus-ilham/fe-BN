/**
 * Memformat error Supabase agar mudah ditampilkan ke pengguna
 */
interface SupabaseError {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}

export function formatDatabaseError(error: unknown): string {
  if (!error) {
    return 'Kesalahan tidak dikenal. Silakan coba lagi.';
  }

  // Jika sudah berupa string, langsung kembalikan (dengan cek pesan generik)
  if (typeof error === 'string') {
    if (error.includes('Database error')) {
      return 'Kesalahan database. Periksa konsol untuk detail lebih lanjut.';
    }
    return error;
  }

  // Jika merupakan objek Error
  if (error instanceof Error) {
    if (error.message.includes('Database error')) {
      return `Kesalahan database: ${error.message}. Periksa konsol untuk detail lebih lanjut.`;
    }
    return error.message;
  }

  // Jika berupa objek dengan properti yang dikenali
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as SupabaseError & { status?: number };
    
    // Jika memiliki message, gunakan message tersebut
    if (errorObj.message) {
      const messageLower = errorObj.message.toLowerCase();
      
      // Rate limit - prioritas tinggi
      if (
        messageLower.includes('rate limit') ||
        messageLower.includes('rate_limit') ||
        messageLower.includes('too many requests') ||
        messageLower.includes('email rate limit exceeded')
      ) {
        return 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu beberapa menit sebelum mencoba lagi. Ini membantu menjaga keamanan sistem kami.';
      }
      
      // Pesan Supabase umum dengan terjemahan yang lebih ramah
      if (errorObj.message.includes('already registered') || errorObj.message.includes('already exists')) {
        return 'Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.';
      }
      
      if (errorObj.message.includes('password')) {
        return 'Kata sandi tidak memenuhi syarat keamanan.';
      }
      
      if (errorObj.message.includes('email')) {
        return 'Email tidak valid. Periksa kembali email Anda.';
      }

      if (errorObj.message.includes('duplicate key')) {
        return 'Data ini sudah ada di dalam sistem.';
      }

      if (errorObj.message.includes('foreign key')) {
        return 'Kesalahan referensi: data terkait tidak ditemukan.';
      }

      if (errorObj.message.includes('permission denied') || errorObj.message.includes('row-level security')) {
        return 'Akses ditolak. Periksa kebijakan keamanan database.';
      }

      // Kembalikan pesan asli jika bukan error yang dikenali
      return errorObj.message;
    }
    
    // Cek juga berdasarkan code dan status
    if (errorObj.code === 'rate_limit_exceeded' || errorObj.status === 429) {
      return 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu beberapa menit sebelum mencoba lagi.';
    }

    // Jika ada details, gunakan details + hint
    const details = errorObj.details || '';
    const hint = errorObj.hint || '';
    const code = errorObj.code || '';

    if (details || hint) {
      return `${details || 'Kesalahan database'}${hint ? ` (${hint})` : ''}${code ? ` [Kode: ${code}]` : ''}`;
    }
  }

  return `Kesalahan: ${JSON.stringify(error)}`;
}

/**
 * Mencatat error detail di konsol untuk debugging
 */
export function logDatabaseError(context: string, error: unknown) {
  console.group(`❌ Kesalahan Database: ${context}`);
  
  // Jika error berupa string, tampilkan langsung
  if (typeof error === 'string') {
    console.error('Tipe: String');
    console.error('Pesan:', error);
    console.error('⚠️ Error diterima sebagai string - kemungkinan pesan generik');
  } 
  // Jika berupa objek dengan properti yang dikenali
  else if (error && typeof error === 'object') {
    const errorObj = error as SupabaseError & { status?: number };
    console.error('Tipe: Object');
    console.error('Pesan:', errorObj.message || '(tanpa pesan)');
    console.error('Detail:', errorObj.details || '(tanpa detail)');
    console.error('Hint:', errorObj.hint || '(tanpa hint)');
    console.error('Kode:', errorObj.code || '(tanpa kode)');
    console.error('Status:', errorObj.status || '(tanpa status)');
    console.error('Error lengkap:', error);
    
    // Jika termasuk error Supabase, tampilkan informasi tambahan
    if (errorObj.message && errorObj.message.includes('Database error')) {
      console.warn('⚠️ Ini tampak seperti error generik. Periksa:');
      console.warn('  1. Apakah tabel sudah dibuat dengan benar di Supabase');
      console.warn('  2. Apakah kebijakan RLS sudah dikonfigurasi');
      console.warn('  3. Apakah environment variable sudah benar');
      console.warn('  4. Periksa log Supabase di dashboard');
    }
  }
  // Jika merupakan objek Error
  else if (error instanceof Error) {
    console.error('Tipe: Error');
    console.error('Pesan:', error.message);
    console.error('Stack:', error.stack);
    console.error('Nama:', error.name);
  }
  // Tipe lain
  else {
    console.error('Tipe:', typeof error);
    console.error('Nilai:', error);
    console.error('Stringify:', JSON.stringify(error, null, 2));
  }
  
  console.groupEnd();
}
