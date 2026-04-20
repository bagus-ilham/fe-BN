"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { requestPasswordReset } from "@/utils/auth";

export default function ForgotPasswordPage() {
  const errorParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("error")
      : null;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam ? decodeURIComponent(errorParam) : null,
  );
  const { showToast } = useCart();

  useEffect(() => {
    const handlePopState = () => { setLoading(false); };
    window.addEventListener("popstate", handlePopState);
    return () => { window.removeEventListener("popstate", handlePopState); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await requestPasswordReset(email.trim());

    if (result.success) {
      setSuccess(true);
      showToast("Kata sandi sementara terkirim! Periksa email Anda.");
    } else {
      setError(result.error ?? "Tidak dapat memproses. Coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="page-shell bg-brand-champagne/20 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Judul */}
              <div className="text-center mb-12">
                <Link href="/" className="inline-block text-[11px] tracking-[0.55em] uppercase text-brand-softblack/40 font-light mb-8 hover:text-brand-green transition-colors">
                  benangbaju
                </Link>
                <h1 className="text-3xl md:text-4xl font-extralight uppercase tracking-[0.15em] mb-4 text-brand-softblack">
                  Pulihkan Akses
                </h1>
                <p className="text-xs font-light text-brand-softblack/50 leading-relaxed">
                  Masukkan email Anda untuk menerima kata sandi sementara.
                  Login dan ubah di halaman Profil.
                </p>
              </div>

              {/* Kartu formulir */}
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
                  <div>
                    <label
                      htmlFor="email"
                      className="text-[10px] uppercase tracking-[0.25em] block mb-3 text-brand-softblack/50 font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className={`w-full bg-transparent border-b py-3 focus:outline-none transition text-brand-softblack placeholder:text-brand-softblack/30 font-light text-sm ${
                        error
                          ? "border-red-400 focus:border-red-500"
                          : "border-brand-softblack/15 focus:border-brand-green"
                      }`}
                      placeholder="email@anda.com"
                      required
                      autoComplete="email"
                    />
                  </div>

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
                        <span>Mengirim...</span>
                      </span>
                    ) : (
                      "Kirim Kata Sandi Sementara"
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-brand-softblack/6">
                  <Link
                    href="/login"
                    className="block text-center text-[9px] uppercase tracking-[0.3em] text-brand-softblack/40 hover:text-brand-green transition-colors font-medium"
                  >
                    ← Kembali ke Login
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="surface-card p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="flex justify-center mb-8"
              >
                <Mail className="w-20 h-20 text-brand-green" strokeWidth={1.5} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-extralight uppercase tracking-[0.15em] mb-6 text-brand-softblack"
              >
                Email Terkirim
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-light text-brand-softblack/70 leading-relaxed mb-8"
              >
                Kami mengirim kata sandi sementara ke{" "}
                <span className="font-medium text-brand-softblack">{email}</span>.
                Login dan ubah kata sandi di halaman Profil.
                <br />
                <span className="text-xs text-brand-softblack/50 mt-2 block">
                  Tidak menerima email? Periksa folder spam Anda.
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4"
              >
                <button
                  onClick={() => { setSuccess(false); setEmail(""); }}
                  className="text-brand-softblack text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-softblack/30 hover:border-brand-green hover:text-brand-green transition-colors pb-1"
                >
                  Kirim Ulang
                </button>
                <Link
                  href="/login"
                  className="text-brand-softblack text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-softblack/30 hover:border-brand-green hover:text-brand-green transition-colors pb-1"
                >
                  Kembali ke Login
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

