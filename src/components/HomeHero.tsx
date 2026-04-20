"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useMobileViewportHeight } from "@/hooks/useMobileViewportHeight";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const SLIDE_DURATION = 7000; // 7 seconds

export default function HomeHero() {
  const { settings } = useSiteSettings();
  const slides = settings.heroSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const viewportHeight = useMobileViewportHeight();
  const lenis = useLenis();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const heroStyle = useMemo(
    () => ({ height: viewportHeight ? `${viewportHeight}px` : "100svh" }),
    [viewportHeight]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextSlide();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [nextSlide, currentSlide]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-brand-softblack"
      style={heroStyle}
    >
      {/* ── BACKGROUND IMAGES ── */}
      <AnimatePresence mode="wait">
        {slides[currentSlide]?.image && (
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover opacity-55"
            />
            {/* Multi-stop cinematic gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-softblack/45 via-brand-softblack/10 via-50% to-brand-softblack/60" />
            {/* Subtle vignette kiri */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-softblack/30 via-transparent to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DECORATIVE TOP LINE ── */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent z-20" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            {/* Subtitle with gold line decoration */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <span className="w-6 h-px bg-brand-gold/50" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.55em] text-white/65 font-medium">
                {slides[currentSlide].subtitle}
              </span>
              <span className="w-6 h-px bg-brand-gold/50" />
            </motion.div>

            {/* Main title */}
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif italic text-white mb-10 leading-[1.05]">
              {slides[currentSlide].title}
            </h1>

            {/* CTA Button — glimmer on hover */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href={slides[currentSlide].link}
                className="glimmer-hover inline-block border border-white/30 bg-white/10 backdrop-blur-md px-10 py-4 text-[10px] uppercase tracking-[0.35em] text-white hover:bg-white hover:text-brand-softblack transition-all duration-500 rounded-sm group"
              >
                <span className="flex items-center gap-3">
                  {slides[currentSlide].cta}
                  <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── SLIDE NUMBER INDICATOR (top right) ── */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-medium -rotate-90 mb-3">
          0{currentSlide + 1}
        </span>
        <div className="w-px h-12 bg-white/10">
          <motion.div
            className="w-full bg-brand-gold/60"
            style={{ height: `${progress}%` }}
          />
        </div>
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-medium -rotate-90 mt-3">
          0{slides.length}
        </span>
      </div>

      {/* ── CIRCULAR PROGRESS DOTS ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => handleDotClick(index)}
            className="group relative w-8 h-8 flex items-center justify-center transition-all duration-300"
            aria-label={`Go to slide ${index + 1}`}
          >
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="13"
                stroke="white"
                strokeWidth="0.5"
                fill="transparent"
                className="opacity-15"
              />
              {currentSlide === index && (
                <motion.circle
                  cx="16"
                  cy="16"
                  r="13"
                  stroke="#C9A47E"
                  strokeWidth="1.5"
                  fill="transparent"
                  strokeDasharray="82"
                  animate={{ strokeDashoffset: 82 - (82 * progress) / 100 }}
                  transition={{ ease: "linear", duration: 0.05 }}
                />
              )}
            </svg>
            <div
              className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-400 ${
                currentSlide === index
                  ? "bg-brand-gold scale-100"
                  : "bg-white/30 scale-75 group-hover:scale-100 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-10 right-6 md:right-10 z-20 hidden md:flex flex-col items-center gap-2 animate-scroll-bounce">
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-medium">Scroll</span>
        <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* ── BOTTOM DECORATIVE LINE ── */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}
