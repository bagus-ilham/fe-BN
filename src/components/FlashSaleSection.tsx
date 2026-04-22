"use client";
import { useState, useEffect } from "react";
import { ProductWithExtras } from "@/types/database";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface FlashSaleSectionProps {
  products: ProductWithExtras[];
  endDate: string;
}

export default function FlashSaleSection({ products, endDate }: FlashSaleSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const end = new Date(endDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <section className="bg-brand-offwhite py-20 border-t border-brand-softblack/5 overflow-hidden">
      {/* ── MARQUEE BAR ── */}
      <div className="relative bg-brand-sale-red py-2.5 mb-16 overflow-hidden">
        {/* Left/right fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-sale-red to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-sale-red to-transparent z-10" />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex items-center mx-7">
              <span className="text-[10px] font-semibold tracking-[0.42em] text-white uppercase flex items-center gap-4">
                Flash Sale
                <span className="w-1 h-1 rounded-full bg-white/50" />
                Limited Time Only
                <span className="w-1 h-1 rounded-full bg-white/50" />
                Special Offer
                <span className="w-1 h-1 rounded-full bg-white/50" />
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto px-5 md:px-10"
      >
        {/* ── HEADER & TIMER ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-20 text-center md:text-left">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              {/* Live indicator */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-brand-sale-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sale-red" />
              </span>
              <span className="text-brand-sale-red text-[10px] uppercase tracking-[0.42em] font-semibold">
                Don&apos;t Miss Out
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif italic text-brand-softblack leading-tight mb-6">
              Essential Collection <br />
              <span className="not-italic font-extralight">Flash Sale</span>
            </h2>
            <p className="text-brand-softblack/45 text-xs tracking-wide leading-relaxed font-light max-w-sm md:max-w-none">
              Limited inventory available at special pricing. Refresh your wardrobe with our signature pieces before the timer runs out.
            </p>
          </div>

          {/* Timer — dengan depth shadow dan background premium */}
          <div className="flex items-center gap-3 md:gap-5 bg-white p-7 md:p-10 shadow-[0_8px_40px_rgba(28,28,28,0.1),0_2px_8px_rgba(28,28,28,0.06)] border border-stone-100">
            <TimeUnit label="Jam" value={timeLeft.hours} />
            <div className="flex flex-col gap-2 self-center">
              <span className="w-1 h-1 rounded-full bg-brand-softblack/20" />
              <span className="w-1 h-1 rounded-full bg-brand-softblack/20" />
            </div>
            <TimeUnit label="Menit" value={timeLeft.minutes} />
            <div className="flex flex-col gap-2 self-center">
              <span className="w-1 h-1 rounded-full bg-brand-softblack/20" />
              <span className="w-1 h-1 rounded-full bg-brand-softblack/20" />
            </div>
            <TimeUnit label="Detik" value={timeLeft.seconds} />
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function TimeUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center min-w-[52px] md:min-w-[64px]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl font-extralight text-brand-softblack tabular-nums leading-none"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
      {/* Separator line */}
      <div className="w-full h-px bg-brand-softblack/8 my-2" />
      <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] font-medium text-brand-softblack/30 mt-0.5">
        {label}
      </span>
    </div>
  );
}
