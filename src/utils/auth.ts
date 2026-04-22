import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Memeriksa apakah error autentikasi menandakan email belum terkonfirmasi
 */
export function isEmailNotConfirmedError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { message?: string; status?: number };
    const errorMessage = errorObj.message?.toLowerCase() || '';
    
    return (
      errorMessage.includes('email not confirmed') ||
      errorMessage.includes('email_not_confirmed') ||
      errorMessage.includes('confirmation') ||
      errorObj.status === 401
    );
  }

  return false;
}

/**
 * Mengirim ulang email konfirmasi
 */
export async function resendConfirmationEmail(email: string): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'Email konfirmasi telah dikirim ulang.' };
  } catch (err) {
    return { success: false, error: 'Gagal mengirim ulang email.' };
  }
}

/**
 * Logout pengguna
 */
export async function handleLogout(): Promise<void> {
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Memeriksa apakah pengguna terautentikasi
 */
export async function checkAuth(): Promise<{ user: User | null; error: string | null }> {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { user: session?.user ?? null, error: error?.message ?? null };
}

/**
 * Solicitar redefinição de senha
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Terjadi kesalahan sistem.' };
  }
}
