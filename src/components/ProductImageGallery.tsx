"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleThumbnailClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* ── MAIN IMAGE ── */}
      <div
        className={`relative bg-brand-champagne/20 aspect-[3/4] overflow-hidden rounded-sm group/zoom ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Skeleton behind */}
        <div className="absolute inset-0 z-0 shimmer" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-10 touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -100) {
                // Swipe left -> next
                setActiveIndex((prev) => (prev + 1) % images.length);
              } else if (swipe > 100) {
                // Swipe right -> prev
                setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
              }
            }}
            style={
              isZoomed
                ? {
                    transform: `scale(2)`,
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transition: "transform-origin 0.05s linear",
                  }
                : { transform: "scale(1)", transition: "transform 0.4s ease" }
            }
          >
            <Image
              src={images[activeIndex]}
              alt={`${alt} — gambar ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={activeIndex === 0}
              quality={92}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint — hidden when zoomed */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-3 py-1.5 shadow-sm border border-white/60 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 pointer-events-none rounded-sm">
            <ZoomIn className="w-3 h-3 text-brand-softblack/50" />
            <span className="text-[9px] uppercase tracking-widest text-brand-softblack/50 font-medium">Perbesar</span>
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/60">
            <span className="text-[9px] uppercase tracking-widest text-brand-softblack/50 font-medium tabular-nums">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm border border-white/60 rounded-sm flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-all hover:bg-white shadow-sm"
              aria-label="Gambar sebelumnya"
            >
              <svg className="w-4 h-4 text-brand-softblack" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm border border-white/60 rounded-sm flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-all hover:bg-white shadow-sm"
              aria-label="Gambar berikutnya"
            >
              <svg className="w-4 h-4 text-brand-softblack" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Mobile Dot Indicators overlay */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5 md:hidden">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx ? "w-4 h-1.5 bg-brand-softblack" : "w-1.5 h-1.5 bg-brand-softblack/30"
                }`}
                aria-label={`Lihat gambar ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── THUMBNAIL STRIP (Desktop only) ── */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2.5 justify-center flex-wrap">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-[72px] h-[88px] shrink-0 overflow-hidden rounded-sm border-2 transition-all duration-300 ${
                activeIndex === index
                  ? "border-brand-softblack shadow-sm"
                  : "border-transparent hover:border-brand-softblack/30"
              }`}
              aria-label={`Lihat gambar ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="72px"
                className={`object-cover transition-all duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-60 hover:opacity-90"
                }`}
              />
              {/* Active indicator bar at bottom */}
              {activeIndex === index && (
                <motion.div
                  layoutId="thumb-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-softblack"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
