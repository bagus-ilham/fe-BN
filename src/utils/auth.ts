import type { User } from '@supabase/supabase-js';

/**
 * Memeriksa apakah error autentikasi menandakan email belum terkonfirmasi
 */
export function isEmailNotConfirmedError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { message?: string; status?: number };
    const errorMessage = errorObj.message?.toLowerCase() || '';
    const errorCode = errorObj.status?.toString() || '';

    // Kode dan pesan yang menandakan email belum terkonfirmasi
    return (
      errorMessage.includes('email not confirmed') ||
      errorMessage.includes('email_not_confirmed') ||
      errorMessage.includes('confirmation') ||
      errorCode === '401' ||
      errorObj.status === 401
    );
  }

  return false;
}

/**
 * Mengirim ulang email konfirmasi melalui API route
 */
export async function resendConfirmationEmail(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
  /*
  try {
    const response = await fetch('/api/auth/resend-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Gagal mengirim ulang email' };
    }

    return { success: true, message: data.message };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim ulang email';
    return { success: false, error: errorMessage };
  }
  */
  return { success: true, message: 'Mock email sent' };
}

/**
 * Logout pengguna
 */
export async function handleLogout(): Promise<void> {
  
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Memeriksa apakah pengguna terautentikasi
 */
export async function checkAuth(): Promise<{ user: User | null; error: string | null }> {
  
  return { user: null, error: null };
}

/**
 * Solicitar redefinição de senha
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Falha ao solicitar redefinição' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro interno' };
  }
}
