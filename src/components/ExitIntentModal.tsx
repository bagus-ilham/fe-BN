"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const STORAGE_KEY = "benangbaju_exit_intent_shown";
const DELAY_MS = 30000;

function isConversionPage(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/checkout/success")) return false;
  if (pathname.startsWith("/checkout/canceled")) return false;
  if (pathname.startsWith("/product/")) return true;
  if (pathname.startsWith("/protocol/")) return true;
  if (pathname === "/checkout") return true;
  if (pathname === "/") return true;
  return false;
}

function wasShownThisSession(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markAsShown(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

export default function ExitIntentModal() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasItemsInCart = cart.length > 0;

  const showModal = useCallback(() => {
    if (wasShownThisSession()) return;
    if (!isConversionPage(pathname)) return;
    markAsShown();
    setIsOpen(true);
  }, [pathname]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToCheckout = useCallback(() => {
    closeModal();
    router.push("/checkout");
  }, [closeModal, router]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText("BENANG10").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    if (!isConversionPage(pathname)) return;
    const timer = setTimeout(showModal, DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname, showModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(28,28,28,0.55)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-[4px]" onClick={closeModal} />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white overflow-hidden shadow-2xl rounded-sm"
          >
            {/* Top gold gradient bar */}
            <div className="h-1 bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60" />

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-brand-softblack/30 hover:text-brand-softblack transition-colors rounded-sm hover:bg-stone-100"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="p-8 pb-7">
              {/* Icon badge */}
              <div className="w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-5">
                <Tag className="w-6 h-6 text-brand-gold" strokeWidth={1.5} />
              </div>

              <p className="text-[9px] uppercase tracking-[0.45em] text-brand-gold font-semibold mb-2">
                Penawaran Eksklusif
              </p>
              <h2
                id="exit-intent-title"
                className="text-2xl font-light uppercase tracking-[-0.01em] text-brand-softblack mb-3 leading-tight"
              >
                Diskon <span className="font-semibold text-brand-green">10%</span> untuk Anda
              </h2>
              <p className="text-sm text-brand-softblack/55 font-light leading-relaxed mb-6">
                Gunakan kode di bawah saat checkout dan hemat langsung untuk pembelian pertama Anda.
              </p>

              {/* Promo code box */}
              <button
                onClick={handleCopy}
                className="w-full group flex items-center justify-between border border-dashed border-brand-gold/40 bg-brand-champagne/20 px-5 py-3.5 mb-6 rounded-sm hover:border-brand-gold/70 hover:bg-brand-champagne/40 transition-all duration-300"
                aria-label="Salin kode promo BENANG10"
              >
                <span className="font-mono text-lg font-bold tracking-[0.35em] text-brand-softblack">
                  BENANG10
                </span>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] uppercase tracking-wider text-brand-green font-semibold flex items-center gap-1.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Disalin!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[9px] uppercase tracking-wider text-brand-softblack/35 group-hover:text-brand-gold transition-colors"
                    >
                      Ketuk untuk salin
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={hasItemsInCart ? goToCheckout : closeModal}
                  className="glimmer-hover flex-1 border border-brand-green bg-brand-green text-brand-offwhite px-6 py-3.5 rounded-sm uppercase tracking-[0.18em] text-[10px] font-semibold hover:bg-brand-softblack hover:border-brand-softblack transition-all duration-300 shadow-sm"
                >
                  {hasItemsInCart ? "Ke Checkout →" : "Lanjut Belanja →"}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 border border-stone-200 text-brand-softblack/50 px-6 py-3.5 rounded-sm uppercase tracking-[0.18em] text-[10px] font-light hover:bg-stone-50 transition-colors"
                >
                  Jelajahi dulu
                </button>
              </div>
            </div>

            {/* Bottom note */}
            <div className="px-8 pb-5">
              <p className="text-[8px] text-center uppercase tracking-[0.22em] text-brand-softblack/25">
                Berlaku untuk pembelian pertama · Tidak ada minimum pembelian
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
