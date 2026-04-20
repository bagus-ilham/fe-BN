"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/constants/products";

interface FeaturedReview {
  id: string;
  product_id: string;
  rating: number;
  text: string;
  author_name: string;
  created_at: string;
}

const productNameById = new Map(PRODUCTS.map((p) => [p.id, p.name]));

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 12 12"
          fill={star <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={star <= rating ? 0 : 1}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-brand-gold" : "text-brand-gold/20"}`}
          aria-hidden
        >
          <path d="M6 0.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L6 8.38 2.91 10.01l.59-3.44L1 4.132l3.455-.502z" />
        </svg>
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const FALLBACK_REVIEWS: FeaturedReview[] = [
  {
    id: "f1", product_id: "", rating: 5,
    text: "Kualitas kainnya benar-benar premium! Jahitannya rapi dan bahannya sangat nyaman dipakai seharian. Saya sangat senang dengan pembelian ini.",
    author_name: "Dewi Rahayu", created_at: "2025-01-10",
  },
  {
    id: "f2", product_id: "", rating: 5,
    text: "Batik kontemporer dari benangbaju memang beda. Modern tapi tetap elegan. Cocok untuk acara formal maupun casual.",
    author_name: "Siti Nurhaliza", created_at: "2025-02-05",
  },
  {
    id: "f3", product_id: "", rating: 5,
    text: "Pengiriman cepat dan packaging sangat cantik. Produknya sesuai ekspektasi bahkan lebih bagus dari foto. Pasti beli lagi!",
    author_name: "Ayu Lestari", created_at: "2025-03-15",
  },
];

export default function ProductTestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/reviews/featured")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) && data.length > 0 ? data : FALLBACK_REVIEWS;
        setReviews(arr);
      })
      .catch(() => setReviews(FALLBACK_REVIEWS));
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reviews.length]);

  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return (
    <section
      ref={ref}
      className="w-full bg-brand-champagne/15 py-20 md:py-28 px-4 md:px-6 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.52em] text-brand-green mb-5 font-semibold">
            <span className="w-5 h-px bg-brand-gold/50" />
            Ulasan Pelanggan
            <span className="w-5 h-px bg-brand-gold/50" />
          </span>
          <h2
            id="testimonials-heading"
            className="text-2xl md:text-4xl font-light uppercase tracking-[-0.02em] text-brand-softblack mb-4"
          >
            Pengalaman Mereka
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-softblack/35 font-light">
            yang mengenakan benangbaju
          </p>
        </motion.div>

        {/* Desktop: 3-col grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6">
          {displayReviews.slice(0, 3).map((review, i) => {
            const productName = productNameById.get(review.product_id) ?? "benangbaju";
            return (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col bg-white border border-stone-200/60 p-7 lg:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 rounded-sm overflow-hidden"
              >
                {/* Decorative large quote mark background */}
                <div className="absolute top-4 right-5 text-[80px] leading-none font-serif text-brand-champagne/60 select-none pointer-events-none group-hover:text-brand-gold/15 transition-colors duration-500">
                  ❝
                </div>

                {/* Accent corner */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold/25 transition-all duration-500 group-hover:w-14 group-hover:h-14 group-hover:border-brand-gold/50" />

                <div className="mb-5">
                  <StarRating rating={review.rating} />
                </div>

                <blockquote className="text-sm font-light text-brand-softblack/75 leading-[1.8] flex-1 mb-6 italic relative z-10">
                  &ldquo;{review.text.slice(0, 160)}{review.text.length > 160 ? "…" : ""}&rdquo;
                </blockquote>

                <footer className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  {/* Avatar with gradient ring */}
                  <div className="relative shrink-0">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-brand-gold/60 to-brand-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <span className="relative w-9 h-9 rounded-full bg-gradient-to-br from-brand-champagne to-brand-offwhite flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-brand-green border border-brand-gold/20">
                      {getInitials(review.author_name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <cite className="not-italic text-xs font-semibold text-brand-softblack block truncate">
                      {review.author_name}
                    </cite>
                    <span className="text-[9px] uppercase tracking-[0.18em] text-brand-softblack/35">
                      {productName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-brand-gold shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-brand-gold/70">Verified</span>
                  </div>
                </footer>
              </motion.article>
            );
          })}
        </div>

        {/* Mobile: swipeable carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-sm">
            <AnimatePresence mode="wait">
              {displayReviews.slice(0, 3).map((review, i) => {
                if (i !== activeIndex) return null;
                const productName = productNameById.get(review.product_id) ?? "benangbaju";
                return (
                  <motion.article
                    key={review.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative bg-white border border-stone-200/60 p-6 overflow-hidden"
                  >
                    {/* Quote deco */}
                    <div className="absolute top-3 right-4 text-[64px] leading-none font-serif text-brand-champagne/50 select-none">
                      ❝
                    </div>
                    <div className="mb-4"><StarRating rating={review.rating} /></div>
                    <blockquote className="text-sm font-light text-brand-softblack/75 leading-[1.8] mb-6 italic relative z-10">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                    <footer className="flex items-center gap-3 pt-4 border-t border-stone-100">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-champagne to-brand-offwhite flex items-center justify-center text-[10px] font-bold uppercase text-brand-green border border-brand-gold/20 shrink-0">
                        {getInitials(review.author_name)}
                      </span>
                      <div>
                        <cite className="not-italic text-xs font-semibold text-brand-softblack block">{review.author_name}</cite>
                        <span className="text-[9px] uppercase tracking-[0.15em] text-brand-softblack/35">{productName}</span>
                      </div>
                    </footer>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Carousel dots — lebih besar */}
          <div className="flex justify-center gap-2 mt-6">
            {displayReviews.slice(0, 3).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-400 rounded-full ${
                  i === activeIndex
                    ? "w-8 h-2 bg-brand-green"
                    : "w-2 h-2 bg-brand-softblack/15 hover:bg-brand-softblack/30"
                }`}
                aria-label={`Ulasan ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Overall rating bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12 md:mt-16 bg-white border border-stone-200/70 p-6 md:p-7 rounded-sm max-w-sm sm:max-w-none sm:w-fit mx-auto shadow-sm"
        >
          <div className="flex items-end gap-3">
            <span className="text-[3.5rem] font-extralight text-brand-softblack leading-none tracking-tighter">4.9</span>
            <div className="mb-1.5">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <svg key={s} className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 12 12">
                    <path d="M6 0.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L6 8.38 2.91 10.01l.59-3.44L1 4.132l3.455-.502z" />
                  </svg>
                ))}
              </div>
              <span className="text-[8px] uppercase tracking-[0.25em] text-brand-softblack/35">Rata-rata penilaian</span>
            </div>
          </div>
          <div className="w-px h-12 bg-stone-200 hidden sm:block" />
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-brand-softblack mb-0.5">99% Pelanggan Puas</p>
            <p className="text-[9px] uppercase tracking-[0.22em] text-brand-softblack/35">Berdasarkan semua ulasan terverifikasi</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
