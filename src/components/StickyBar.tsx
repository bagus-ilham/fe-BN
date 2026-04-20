"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useStickyBar } from "@/context/StickyBarContext";
import { formatPrice } from "@/utils/format";

interface StickyBarProps {
  productName: string;
  price?: number;
  productId?: string;
  onAddToCart: () => void;
  onBuyNow?: () => void;
  isOutOfStock?: boolean;
  isLoading?: boolean;
  onWaitlistClick?: () => void;
  isPresale?: boolean;
  alwaysVisible?: boolean;
  ctaPrimary?: string;
}

export default function StickyBar({
  productName,
  price,
  onAddToCart,
  onBuyNow,
  isOutOfStock = false,
  isLoading = false,
  alwaysVisible = false,
  ctaPrimary,
}: StickyBarProps) {
  const [triggerOutOfView, setTriggerOutOfView] = useState(alwaysVisible);
  const { setStickyBarVisible } = useStickyBar() ?? { setStickyBarVisible: () => {} };

  const checkVisibility = useCallback(() => {
    if (alwaysVisible) return;
    const trigger = document.querySelector("[data-sticky-bar-trigger]");
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const isOut = rect.bottom < 0;
    setTriggerOutOfView(isOut);
    setStickyBarVisible(isOut);
  }, [alwaysVisible, setStickyBarVisible]);

  useLenis(checkVisibility, [checkVisibility]);

  useEffect(() => {
    const initTimer = setTimeout(checkVisibility, 150);
    const handleScroll = () => requestAnimationFrame(checkVisibility);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [alwaysVisible, checkVisibility]);

  useEffect(() => {
    if (alwaysVisible) setStickyBarVisible(true);
  }, [alwaysVisible, setStickyBarVisible]);

  useEffect(() => () => setStickyBarVisible(false), [setStickyBarVisible]);

  const isVisible = triggerOutOfView;

  const barContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[45] bg-white/96 backdrop-blur-xl border-t border-stone-100 shadow-[0_-4px_32px_rgba(28,28,28,0.07)]"
        >
          {/* Top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
            {/* Product info */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-[0.25em] text-brand-softblack/40 font-light mb-0.5 hidden md:block">
                Sedang melihat
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-brand-softblack truncate">
                {productName}
              </p>
              {price && (
                <p className="text-xs font-light text-brand-softblack/55 mt-0.5">
                  {formatPrice(price)}
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2.5 shrink-0">
              {isOutOfStock || isLoading ? (
                <button
                  disabled
                  className="border rounded-sm px-5 py-3 min-h-[44px] uppercase tracking-[0.2em] text-[10px] font-medium whitespace-nowrap border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                  aria-label={isLoading ? "Memuat" : "Habis Terjual"}
                >
                  {isLoading ? "Memuat..." : "Habis"}
                </button>
              ) : onBuyNow ? (
                <Link
                  href="/checkout"
                  onClick={onBuyNow}
                  className="flex shrink-0 items-center justify-center gap-2 border rounded-sm px-6 py-3 min-h-[44px] uppercase tracking-[0.2em] text-[10px] font-semibold transition-all duration-300 whitespace-nowrap border-brand-green bg-brand-green text-brand-offwhite hover:bg-brand-softblack hover:border-brand-softblack shadow-sm hover:shadow-md"
                  aria-label={ctaPrimary ?? "Beli Sekarang"}
                >
                  {ctaPrimary ?? "Beli Sekarang"}
                </Link>
              ) : (
                <>
                  {/* Mobile: icon-only add to bag */}
                  <button
                    onClick={onAddToCart}
                    className="md:hidden flex items-center justify-center border rounded-sm p-3 min-h-[44px] min-w-[44px] border-brand-softblack/15 text-brand-softblack hover:border-brand-green hover:text-brand-green transition-all duration-200"
                    aria-label="Tambah ke tas"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                  </button>

                  {/* Desktop: full button */}
                  <button
                    onClick={onAddToCart}
                    className="hidden md:flex items-center justify-center gap-2 border rounded-sm px-6 py-3 min-h-[44px] uppercase tracking-[0.2em] text-[10px] font-semibold transition-all duration-300 whitespace-nowrap border-brand-green bg-brand-green text-brand-offwhite hover:bg-brand-softblack hover:border-brand-softblack shadow-sm hover:shadow-md"
                    aria-label="Tambah ke tas"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                    Tambah ke Tas
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== "undefined") {
    return createPortal(barContent, document.body);
  }
  return barContent;
}
