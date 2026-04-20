"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatDatabaseError, logDatabaseError } from "@/utils/errorHandler";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { isEmailNotConfirmedError } from "@/utils/auth";
import ResendConfirmationEmail from "@/components/auth/ResendConfirmationEmail";
import GoogleAuthButton from "@/components/google-auth-button";

export default function LoginPage() {
  const initialSearchParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const pageError = initialSearchParams?.get("error");
    const msg = initialSearchParams?.get("message") || pageError;
    if (!msg) return null;
    if (msg.includes("confirmed") || msg.includes("email")) return null;
    return msg;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailConfirmed, setShowEmailConfirmed] = useState(
    initialSearchParams?.get("email-confirmed") === "true",
  );
  const [showPasswordReset, setShowPasswordReset] = useState(
    initialSearchParams?.get("password-reset") === "true",
  );
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false);
  const router = useRouter();
  const { showToast } = useCart();

  // Atur ulang status loading saat komponen dimuat kembali atau pengguna kembali ke halaman ini
  useEffect(() => {
    // Periksa apakah kembali dari tindakan pemrosesan
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || (performance.navigation && performance.navigation.type === 2)) {
        setLoading(false);
        const wasProcessing = sessionStorage.getItem('login_processing');
        if (wasProcessing === 'true') {
          sessionStorage.removeItem('login_processing');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
    };

    // Atur ulang saat pengguna menggunakan tombol kembali di peramban
    const handlePopState = () => {
      setLoading(false);
      const wasProcessing = sessionStorage.getItem('login_processing');
      if (wasProcessing === 'true') {
        sessionStorage.removeItem('login_processing');
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("registered") === "true") {
      showToast(params.get("message") || "Akun berhasil dibuat! Silakan cek email Anda.");
      router.replace("/login");
    }

    const isPasswordReset = params.get("password-reset") === "true";
    const isEmailConfirmed = params.get("email-confirmed") === "true";

    if (isPasswordReset) {
      const message = params.get("message") || "Kata sandi diubah! Masuk dengan email dan kata sandi baru Anda.";
      showToast(message);
      router.replace("/login");
    }

    if (isEmailConfirmed) {
      const message = params.get("message") || "Email terkonfirmasi! Silakan masuk.";
      showToast(message);
      router.replace("/login");
    }

    const redirect = params.get("redirect");
    if (redirect) {
      sessionStorage.setItem("redirect", redirect);
    }

    if (isPasswordReset) {
      const timer = setTimeout(() => setShowPasswordReset(false), 8000);
      return () => clearTimeout(timer);
    }

    if (isEmailConfirmed) {
      const timer = setTimeout(() => setShowEmailConfirmed(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [router, showToast]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      sessionStorage.setItem('login_processing', 'true');
      setError(null);



      // Simulação de login bem-sucedido (Mockup Mode)
      setTimeout(() => {
        showToast("Mock: Berhasil masuk! Selamat datang kembali.");
        sessionStorage.removeItem('login_processing');
        const redirect = sessionStorage.getItem("redirect");
        if (redirect) {
          sessionStorage.removeItem("redirect");
          router.push(redirect);
        } else {
          router.push("/");
        }
        setLoading(false);
      }, 1000);
    },
    [loading, router, showToast],
  );

  return (
    <div className="page-shell bg-brand-champagne/20 flex items-center justify-center px-4 md:px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block text-[11px] tracking-[0.55em] uppercase text-brand-softblack/40 font-light mb-8 hover:text-brand-green transition-colors">
            benangbaju
          </Link>
          <h1 className="text-3xl md:text-4xl font-extralight uppercase tracking-[0.15em] mb-4 text-brand-softblack">
            Masuk ke Akun
          </h1>
          <p className="text-xs font-light text-brand-softblack/50 leading-relaxed">
            Akses riwayat belanja dan pesanan Anda.
          </p>
        </div>

        {/* Form Card */}
        <div className="surface-card p-8 md:p-12">
          {/* Banner de email confirmado */}
          {showEmailConfirmed && (
            <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm text-center rounded-sm animate-fadeIn">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-left">
                  <p className="font-medium mb-1">Email Terkonfirmasi! ✅</p>
                  <p className="text-xs opacity-90">
                    Masuk dengan email dan kata sandi yang Anda buat saat pendaftaran.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Banner de senha redefinida */}
          {showPasswordReset && (
            <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm text-center rounded-sm animate-fadeIn">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-left">
                  <p className="font-medium mb-1">Kata Sandi Diubah! ✅</p>
                  <p className="text-xs opacity-90">
                    Masuk dengan email dan kata sandi baru Anda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 text-sm text-center rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) {
                    setError(null);
                    setShowEmailNotConfirmed(false);
                  }
                }}
                className={`w-full bg-transparent border-b py-3 focus:outline-none transition text-brand-softblack placeholder:text-brand-softblack/30 font-light text-sm ${error
                  ? "border-red-400 focus:border-red-500"
                  : "border-brand-softblack/15 focus:border-brand-green"
                  }`}
                placeholder="email@anda.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) {
                      setError(null);
                      setShowEmailNotConfirmed(false);
                    }
                  }}
                  className={`w-full bg-transparent border-b py-3 pr-12 focus:outline-none transition text-brand-softblack placeholder:text-brand-softblack/30 font-light font-mono text-sm ${error
                    ? "border-red-400 focus:border-red-500"
                    : "border-brand-softblack/15 focus:border-brand-green"
                    }`}
                  placeholder="Kata sandi Anda"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-brand-softblack transition"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Komponen kirim ulang konfirmasi - tampil saat email belum terkonfirmasi */}
            {showEmailNotConfirmed && email && (
              <ResendConfirmationEmail
                email={email}
                onSuccess={() => {
                  showToast(
                    "Email konfirmasi telah dikirim ulang! Cek kotak masuk Anda.",
                  );
                }}
                onError={(errorMsg) => {
                  showToast(errorMsg);
                }}
              />
            )}

            {/* Tombol submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green text-brand-offwhite py-4 uppercase text-[10px] tracking-[0.25em] mt-6 hover:bg-brand-softblack transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sedang masuk...</span>
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-brand-softblack/8" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 font-medium">
              atau
            </span>
            <div className="flex-1 h-px bg-brand-softblack/8" />
          </div>

          {/* Login sosial dengan Google */}
          <GoogleAuthButton
            label="Masuk dengan Google"
            onError={(errorMsg) => {
              setError(errorMsg);
              showToast(errorMsg);
            }}
          />

          <div className="mt-8 pt-6 border-t border-brand-softblack/6 space-y-3.5">
            <Link
              href="/forgot-password"
              className="block text-center text-[9px] uppercase tracking-[0.3em] text-brand-softblack/40 hover:text-brand-green transition-colors font-medium"
            >
              Lupa kata sandi?
            </Link>
            <p className="text-center text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-green hover:text-brand-softblack transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

