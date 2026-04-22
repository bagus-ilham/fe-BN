"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatDatabaseError, logDatabaseError } from "@/utils/errorHandler";
import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AuthPageSkeleton from "@/components/ui/AuthPageSkeleton";
import { createBrowserClient } from "@supabase/ssr";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { showToast } = useCart();

  // Reset loading saat komponen dimuat ulang atau saat pengguna kembali
  useEffect(() => {
    // Reset saat pengguna menekan tombol kembali browser
    const handlePopState = () => {
      setLoading(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    // Periksa apakah pengguna memiliki sesi recovery yang valid
    async function checkSession() {
      try {
        
        // Tunggu sebentar agar cookie tersinkronisasi
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Coba beberapa kali (sesi bisa terlambat tersinkronisasi)
        let attempts = 0;
        const maxAttempts = 3;
        let sessionFound = false;

        while (attempts < maxAttempts && !sessionFound) {
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          
          // Periksa sesi saat ini
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            if (process.env.NODE_ENV === "development") {
              console.error(
                `❌ Gagal memeriksa sesi (percobaan ${attempts + 1}):`,
                sessionError,
              );
            }
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 500));
              continue;
            }
            setError("Sesi tidak valid. Minta tautan reset baru.");
            setCheckingSession(false);
            return;
          }

          if (session) {
            // Periksa apakah pengguna tersedia
            const {
              data: { user },
              error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
              if (process.env.NODE_ENV === "development") {
                console.error("❌ Gagal memeriksa pengguna:", userError);
              }
              setError(
                "Pengguna tidak ditemukan. Minta tautan reset baru.",
              );
              setCheckingSession(false);
              return;
            }

            // Sesi valid - pengguna dapat melanjutkan
            if (process.env.NODE_ENV === "development") {
              console.log(
                "✅ Sesi valid ditemukan untuk recovery (percobaan",
                attempts + 1,
                ")",
              );
            }
            setHasValidSession(true);
            setCheckingSession(false);
            sessionFound = true;
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            if (process.env.NODE_ENV === "development") {
              console.log(
                `⚠️ Sesi tidak ditemukan (percobaan ${attempts}), mencoba lagi...`,
              );
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        // Jika sampai sini, sesi tidak ditemukan setelah semua percobaan
        if (process.env.NODE_ENV === "development") {
          console.error(
            "❌ Tidak ada sesi ditemukan setelah",
            maxAttempts,
            "percobaan",
          );
        }
        setError(
          "Tautan tidak valid atau kedaluwarsa. Minta tautan reset baru.",
        );
        setCheckingSession(false);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("❌ Terjadi exception saat memeriksa sesi:", err);
        }
        setError(
          "Kesalahan verifikasi autentikasi. Minta tautan reset baru.",
        );
        setCheckingSession(false);
      }
    }
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!password) {
      setError("Kata sandi wajib diisi");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    setLoading(true);

    setLoading(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      showToast("Kata sandi berhasil diperbarui!");
    } catch (err: any) {
      console.error("❌ Gagal update password:", err);
      setError(err.message || "Gagal memperbarui kata sandi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state saat memeriksa sesi
  if (checkingSession) {
    return <AuthPageSkeleton />;
  }

  // State error untuk sesi tidak valid
  if (!hasValidSession && error) {
    return (
      <div className="page-shell bg-brand-offwhite flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="surface-card max-w-md w-full p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center mb-8"
          >
            <Lock className="w-20 h-20 text-red-500" strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-light uppercase tracking-widest mb-6 text-brand-softblack"
          >
            Tautan Tidak Valid
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-light text-brand-softblack/70 leading-relaxed mb-8"
          >
            {error}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4"
          >
            <Link
              href="/forgot-password"
              className="w-full bg-brand-green text-brand-offwhite py-4 uppercase text-xs tracking-[0.2em] hover:bg-brand-softblack transition-all duration-500 font-medium text-center"
            >
              Minta Tautan Baru
            </Link>
            <Link
              href="/login"
              className="text-brand-softblack text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-softblack/30 hover:border-brand-green hover:text-brand-green transition-colors pb-1 text-center"
            >
              Kembali ke Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-shell bg-brand-offwhite flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {!success ? (
            // Form kata sandi baru
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-4 text-brand-softblack">
                  Kata Sandi Baru
                </h1>
                <p className="text-sm font-light text-brand-softblack/60 leading-relaxed">
                  Masukkan kata sandi baru untuk melanjutkan.
                </p>
              </div>

              {/* Form */}
              <div className="surface-card p-8 md:p-12">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-600 text-sm text-center rounded-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Nova Senha */}
                  <div>
                    <label
                      htmlFor="password"
                      className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack"
                    >
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        className={`w-full bg-transparent border-b py-3 pr-12 focus:outline-none transition text-brand-softblack placeholder:text-gray-400 font-light font-mono ${
                          error
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-300 focus:border-brand-green"
                        }`}
                        placeholder="Minimal 8 karakter"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-brand-softblack transition"
                        aria-label={
                          showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                        }
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

                  {/* Confirmar Senha */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack"
                    >
                      Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        className={`w-full bg-transparent border-b py-3 pr-12 focus:outline-none transition text-brand-softblack placeholder:text-gray-400 font-light font-mono ${
                          error
                            ? "border-red-400 focus:border-red-500"
                            : "border-gray-300 focus:border-brand-green"
                        }`}
                        placeholder="Masukkan kata sandi kembali"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-brand-softblack transition"
                        aria-label={
                          showConfirmPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                        }
                      >
                        {showConfirmPassword ? (
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

                  {/* Tombol submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-green text-brand-offwhite py-4 uppercase text-xs tracking-[0.2em] mt-8 hover:bg-brand-softblack transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Menyimpan...</span>
                      </span>
                    ) : (
                      "Simpan Kata Sandi Baru"
                    )}
                  </button>
                </form>

                {/* Tautan ke halaman login */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="block text-center text-[10px] uppercase tracking-widest opacity-60 text-brand-softblack hover:text-brand-green transition-colors"
                  >
                    ← Kembali ke login
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            // State sukses
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="surface-card p-8 md:p-12 text-center"
            >
              {/* Ikon sukses */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="flex justify-center mb-8"
              >
                <CheckCircle2
                  className="w-20 h-20 text-brand-green"
                  strokeWidth={1.5}
                />
              </motion.div>

              {/* Título */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-light uppercase tracking-widest mb-6 text-brand-softblack"
              >
                Kata Sandi Diperbarui
              </motion.h2>

              {/* Mensagem */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-light text-brand-softblack/70 leading-relaxed mb-8"
              >
                Kata sandi Anda berhasil diperbarui.
                <br />
                <span className="text-xs text-brand-softblack/60 mt-2 block">
                  Login dengan email dan kata sandi baru Anda.
                </span>
              </motion.p>

              {/* Ação */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/login?password-reset=true"
                  className="inline-block text-brand-softblack text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-softblack/30 hover:border-brand-green hover:text-brand-green transition-colors pb-1"
                >
                  Ke Halaman Login →
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
