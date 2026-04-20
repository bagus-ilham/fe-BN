"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import { formatDatabaseError, logDatabaseError } from "@/utils/errorHandler";
import { useCart } from "@/context/CartContext";
import GoogleAuthButton from "@/components/google-auth-button";

interface FormErrors {
  full_name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useCart();

  useEffect(() => {
    const handlePopState = () => { setLoading(false); };
    window.addEventListener('popstate', handlePopState);
    return () => { window.removeEventListener('popstate', handlePopState); };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Nama lengkap wajib diisi";
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = "Nama harus memiliki minimal 3 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Kata sandi wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Kata sandi harus memiliki minimal 8 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);



    // Simulação de registro bem-sucedido (Mockup Mode)
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      showToast("Mock: Akun berhasil dibuat! Silakan cek email Anda untuk konfirmasi.");
    }, 1500);
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast("Email terkirim! Periksa kotak masuk Anda.");
      } else {
        showToast(result.error || "Gagal mengirim ulang email. Coba lagi.");
      }
    } catch {
      showToast("Gagal mengirim ulang email. Coba lagi.");
    }
  };

  return (
    <div className="page-shell bg-brand-champagne/20 flex items-center justify-center px-4 md:px-6">
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
                  Buat Akun
                </h1>
                <p className="text-xs font-light text-brand-softblack/50 leading-relaxed">
                  Bergabung dengan komunitas benangbaju. Mulai gaya terbaikmu.
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
                  {/* Nama Lengkap */}
                  <div>
                    <label
                      htmlFor="full_name"
                      className="text-[10px] uppercase tracking-[0.25em] block mb-3 text-brand-softblack/50 font-medium"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => {
                        setFormData({ ...formData, full_name: e.target.value });
                        if (errors.full_name) setErrors({ ...errors, full_name: undefined });
                      }}
                      className={`w-full bg-transparent border-b py-3 focus:outline-none transition text-brand-softblack placeholder:text-brand-softblack/30 font-light text-sm ${errors.full_name
                        ? "border-red-400 focus:border-red-500"
                        : "border-brand-softblack/15 focus:border-brand-green"
                        }`}
                      placeholder="Nama lengkap Anda"
                      required
                      autoComplete="name"
                    />
                    {errors.full_name && (
                      <p className="text-[10px] text-red-500 mt-2">{errors.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
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
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full bg-transparent border-b py-3 focus:outline-none transition text-brand-softblack placeholder:text-brand-softblack/30 font-light text-sm ${errors.email
                        ? "border-red-400 focus:border-red-500"
                        : "border-brand-softblack/15 focus:border-brand-green"
                        }`}
                      placeholder="email@anda.com"
                      required
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 mt-2">{errors.email}</p>
                    )}
                  </div>

                  {/* Kata Sandi */}
                  <div>
                    <label
                      htmlFor="password"
                      className="text-[10px] uppercase tracking-[0.25em] block mb-3 text-brand-softblack/50 font-medium"
                    >
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        className={`w-full bg-transparent border-b py-3 pr-12 focus:outline-none transition text-brand-softblack placeholder:text-brand-softblack/30 font-light font-mono text-sm ${errors.password
                          ? "border-red-400 focus:border-red-500"
                          : "border-brand-softblack/15 focus:border-brand-green"
                          }`}
                        placeholder="Minimal 8 karakter"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-brand-softblack/30 hover:text-brand-green transition"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-red-500 mt-2">{errors.password}</p>
                    )}
                  </div>

                  {/* Tombol Daftar */}
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
                        <span>Membuat akun...</span>
                      </span>
                    ) : (
                      "Daftar"
                    )}
                  </button>
                </form>

                {/* Separator */}
                <div className="flex items-center gap-4 my-7">
                  <div className="flex-1 h-px bg-brand-softblack/8" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 font-medium">atau</span>
                  <div className="flex-1 h-px bg-brand-softblack/8" />
                </div>

                {/* Login Google */}
                <GoogleAuthButton
                  label="Daftar dengan Google"
                  onError={(errorMsg) => {
                    setError(errorMsg);
                    showToast(errorMsg);
                  }}
                />

                {/* Tautan login */}
                <div className="mt-8 pt-6 border-t border-brand-softblack/6">
                  <p className="text-center text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="font-semibold text-brand-green hover:text-brand-softblack transition-colors">
                      Masuk sekarang
                    </Link>
                  </p>
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
                Cek Kotak Masuk Anda
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-light text-brand-softblack/70 leading-relaxed mb-8 max-w-md mx-auto"
              >
                Kami mengirim tautan konfirmasi ke{" "}
                <span className="font-medium text-brand-softblack">{formData.email}</span>.
                <br />
                Klik tautan tersebut untuk mengaktifkan akun Anda.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={handleResendEmail}
                  className="text-brand-softblack text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-softblack/30 hover:border-brand-green hover:text-brand-green transition-colors pb-1"
                >
                  Kirim Ulang Email
                </button>
                <span className="text-brand-softblack/30 hidden sm:inline">•</span>
                <Link
                  href="/login"
                  className="text-brand-softblack text-xs uppercase tracking-[0.2em] font-medium border-b border-brand-softblack/30 hover:border-brand-green hover:text-brand-green transition-colors pb-1"
                >
                  Kembali ke Login
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[10px] text-brand-softblack/50 mt-8 font-light"
              >
                Tidak menerima email? Periksa folder spam atau junk Anda.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

