"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Intermediate page with mandatory button (Supabase recommendation).
 * Prevents email scanners from consuming the token before the user.
 * The exchange only occurs when the user explicitly clicks.
 */
function ConfirmContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next");
  const isRecovery =
    type === "recovery" ||
    next === "/update-password" ||
    next === "/reset-password";

  const handleContinue = async () => {
    if (!code) {
      window.location.replace(
        "/forgot-password?error=" +
          encodeURIComponent("Tautan tidak valid. Silakan minta yang baru.")
      );
      return;
    }

    setLoading(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      setLoading(false);
      if (isRecovery) {
        window.location.replace(
          "/forgot-password?error=" +
            encodeURIComponent(
              "Tautan kedaluwarsa atau sudah digunakan. Silakan minta tautan baru."
            )
        );
      } else {
        window.location.replace(
          "/login?email-confirmed=true&message=" +
            encodeURIComponent(
              "Tautan kedaluwarsa atau sudah digunakan. Jika Anda sudah mengonfirmasi sebelumnya, silakan langsung masuk."
            )
        );
      }
      return;
    }

    if (isRecovery) {
      window.location.replace("/update-password");
    } else if (type === "signup" || type === "email") {
      window.location.replace(
        "/login?email-confirmed=true&message=" +
          encodeURIComponent(
            "Email terkonfirmasi! Silakan masuk dengan email dan kata sandi yang Anda buat saat pendaftaran."
          )
      );
    } else {
      window.location.replace("/");
    }
  };

  if (!code) {
    return (
      <div className="page-shell flex items-center justify-center bg-brand-offwhite px-6">
        <div className="text-center">
          <p className="text-brand-softblack/60 text-sm font-light mb-4">
            Tautan tidak valid. Silakan minta yang baru.
          </p>
          <Link
            href="/forgot-password"
            className="text-brand-green text-sm uppercase tracking-widest hover:underline"
          >
            Pulihkan akses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell flex items-center justify-center bg-brand-offwhite px-6">
      <div className="surface-card max-w-md w-full p-8 md:p-12 text-center">
        <h1 className="text-2xl md:text-3xl font-light uppercase tracking-widest mb-6 text-brand-softblack">
          {isRecovery ? "Atur Ulang Kata Sandi" : "Konfirmasi Email"}
        </h1>
        <p className="text-sm font-light text-brand-softblack/70 leading-relaxed mb-8">
          {isRecovery
            ? "Klik tombol di bawah untuk melanjutkan dan membuat kata sandi baru."
            : "Klik tombol di bawah untuk mengonfirmasi email Anda dan lanjut masuk ke akun."}
        </p>

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-brand-green text-brand-offwhite py-4 uppercase text-xs tracking-[0.2em] hover:bg-brand-softblack transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
              <span>Memproses…</span>
            </span>
          ) : (
            "Lanjutkan"
          )}
        </button>

        <Link
          href="/login"
          className="block mt-8 text-[10px] uppercase tracking-widest opacity-60 text-brand-softblack hover:text-brand-green transition-colors"
        >
          ← Kembali ke login
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
          <p className="text-brand-softblack/60 text-sm font-light">
            Memuat…
          </p>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
