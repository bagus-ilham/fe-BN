"use client";

import { useState, useCallback, memo, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface GoogleAuthButtonProps {
  /** Teks tombol. Default: "Lanjutkan dengan Google" */
  label?: string;
  /** Callback setelah berhasil (sebelum redirect) */
  onSuccess?: () => void;
  /** Callback error */
  onError?: (error: string) => void;
  /** URL redirect setelah login (default: /) */
  redirectTo?: string;
  /** Class CSS tambahan */
  className?: string;
}

/**
 * Tombol Login Google - gaya premium
 * Dioptimalkan untuk performa dan aksesibilitas
 */
function GoogleAuthButton({
  label = "Lanjutkan dengan Google",
  onSuccess,
  onError,
  redirectTo,
  className = "",
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  // Reset loading saat komponen dimuat ulang atau pengguna kembali
  useEffect(() => {
    // Periksa apakah pengguna kembali dari proses autentikasi
    const handlePageShow = (event: PageTransitionEvent) => {
      // Jika halaman dimuat dari cache (back button), reset state
      if (event.persisted || (performance.navigation && performance.navigation.type === 2)) {
        setLoading(false);
        // Muat ulang jika terdeteksi kembali dari proses autentikasi
        const wasProcessing = sessionStorage.getItem('google_auth_processing');
        if (wasProcessing === 'true') {
          sessionStorage.removeItem('google_auth_processing');
          // Jeda singkat untuk menghindari loop
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
    };

    // Reset saat pengguna menekan tombol kembali browser
    const handlePopState = () => {
      setLoading(false);
      // Periksa apakah sebelumnya sedang memproses
      const wasProcessing = sessionStorage.getItem('google_auth_processing');
      if (wasProcessing === 'true') {
        sessionStorage.removeItem('google_auth_processing');
      // Muat ulang untuk memastikan reset penuh
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      // Tandai bahwa login sedang diproses (untuk deteksi saat kembali)
      sessionStorage.setItem('google_auth_processing', 'true');
      
            const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      if (redirectTo) {
        sessionStorage.setItem("oauth_redirect", redirectTo);
      }
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        onError?.(error.message || "Gagal terhubung ke Google");
        setLoading(false);
        sessionStorage.removeItem('google_auth_processing'); // Clear flag
        return;
      }

      // Clear flag before redirect (success)
      sessionStorage.removeItem('google_auth_processing');
      onSuccess?.();
    } catch (err: unknown) {
      onError?.(err instanceof Error ? err.message : "Terjadi error tak terduga saat terhubung ke Google");
      setLoading(false);
      sessionStorage.removeItem('google_auth_processing'); // Clear flag
    }
  }, [loading, redirectTo, onSuccess, onError]);

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`
        w-full h-12 
        flex items-center justify-center gap-3
        border border-brand-green/30 
        bg-transparent 
        text-brand-green 
        text-sm font-medium
        transition-colors duration-200
        hover:bg-brand-green/5 hover:border-brand-green/50
        active:bg-brand-green/10
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2
        ${className}
      `}
      aria-label={loading ? "Menghubungkan ke Google..." : label}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-brand-green"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Menghubungkan...</span>
        </>
      ) : (
        <>
          {/* Google Logo SVG - monochrome green version */}
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export default memo(GoogleAuthButton);
