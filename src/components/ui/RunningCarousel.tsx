"use client";

import { motion } from "framer-motion";

interface RunningCarouselProps {
  items: string[];
  speed?: number;
}

// Diamond separator SVG
const DiamondSep = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="opacity-30 shrink-0" aria-hidden>
    <rect x="4" y="0" width="5.66" height="5.66" transform="rotate(45 4 4)" fill="#C9A47E" />
  </svg>
);

export default function RunningCarousel({ items, speed = 35 }: RunningCarouselProps) {
  const allItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative flex overflow-x-hidden bg-brand-softblack py-4 md:py-5 border-y border-white/8 select-none">
      {/* Left/right edge fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-brand-softblack to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-brand-softblack to-transparent pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {allItems.map((item, i) => (
          <span key={i} className="flex items-center gap-5 md:gap-8">
            <span className="text-[10px] md:text-[11px] font-light uppercase tracking-[0.36em] text-white/45 hover:text-brand-gold/70 transition-colors duration-500 cursor-default px-2">
              {item}
            </span>
            <DiamondSep />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
