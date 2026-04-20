"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  userId?: string;
}

export default function WaitlistModal({
  isOpen,
  onClose,
  productId,
  productName,
  userId,
}: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Reset loading saat komponen dimuat ulang atau pengguna kembali
  useEffect(() => {
    // Reset saat mount
    setIsSubmitting(false);

    // Reset saat pengguna menekan tombol kembali browser
    const handlePopState = () => {
      setIsSubmitting(false);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          email: email.toLowerCase().trim(),
          user_id: userId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mendaftar ke daftar tunggu");
      }

      setIsSuccess(true);
      setEmail("");

      // Tutup modal setelah 3 detik
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      console.error("Gagal menambahkan ke daftar tunggu:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memproses permintaan Anda. Coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-brand-softblack/50 backdrop-blur-[4px]">
      <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden">
        {/* Top gold accent */}
        <div className="h-1 bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60" />

        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brand-softblack/30 hover:text-brand-softblack transition-colors rounded-sm hover:bg-stone-100"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="p-8">
          {!isSuccess ? (
            <>
              {/* Judul */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-px bg-brand-gold/50" />
                  <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-gold">
                    Sold Out
                  </p>
                </div>
                <h2 className="text-2xl font-light uppercase tracking-[-0.01em] text-brand-softblack mb-3">
                  Beritahu Saya
                </h2>
                <p className="text-sm text-brand-softblack/60 font-light leading-relaxed">
                  <strong className="font-medium text-brand-softblack">{productName}</strong> saat ini sedang tidak tersedia. Tinggalkan email Anda dan kami akan mengirimkan notifikasi saat item ini kembali tersedia (restock).
                </p>
              </div>

              {/* Formulir */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="waitlist-email"
                    className="block text-[10px] uppercase tracking-[0.2em] text-brand-softblack/50 mb-2 font-semibold"
                  >
                    Email
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@anda.com"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors disabled:bg-stone-50 disabled:text-stone-400"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-sm">
                    <p className="text-[10px] text-red-600 font-medium uppercase tracking-wider">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="glimmer-hover w-full bg-brand-softblack text-brand-offwhite px-6 py-4 rounded-sm uppercase tracking-[0.2em] text-[10px] font-semibold hover:bg-brand-green transition-all duration-300 disabled:bg-stone-200 disabled:text-stone-400 shadow-md"
                >
                  {isSubmitting ? "Mendaftarkan..." : "Daftar Antrean"}
                </button>
              </form>

              {/* Disclaimer */}
              <p className="mt-5 text-[9px] text-brand-softblack/30 text-center uppercase tracking-widest font-medium">
                Kami tidak akan membagikan email Anda
              </p>
            </>
          ) : (
            /* State sukses */
            <div className="text-center py-6">
              <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-green/10 rounded-full animate-pulse" />
                <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center border border-brand-green/30 relative z-10">
                  <svg
                    className="w-5 h-5 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-light uppercase tracking-[-0.01em] text-brand-softblack mb-3">
                Berhasil Terdaftar!
              </h3>
              <p className="text-sm text-brand-softblack/60 font-light leading-relaxed">
                Kami akan mengirimkan notifikasi email ke Anda segera setelah{" "}
                <strong className="font-medium text-brand-softblack">{productName}</strong> kembali
                tersedia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
