"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

import { useSiteSettings } from "@/context/SiteSettingsContext";

interface StatItem {
  value: string;
  suffix: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

function getStats(brandStats: any): StatItem[] {
  return [
    {
      value: brandStats.customers,
      suffix: "",
      label: "Pelanggan Puas",
      desc: "Wanita Indonesia yang telah mempercayai kami",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
      ),
    },
    {
      value: brandStats.reviews,
      suffix: "",
      label: "Ulasan Positif",
      desc: "Berdasarkan ulasan pelanggan kami",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      value: brandStats.itemsSold,
      suffix: "",
      label: "Terjual",
      desc: "Produk yang sudah menemani aktivitas Anda",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      ),
    },
    {
      value: "3",
      suffix: " Hari",
      label: "Pengiriman Cepat",
      desc: "Rata-rata waktu sampai ke tangan Anda",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
    },
  ];
}

function AnimatedCounter({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <span ref={ref} className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 inline-block'}`}>
      {text}
    </span>
  );
}

export default function BrandStatsSection() {
  const { settings } = useSiteSettings();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = getStats(settings.brandStats);

  return (
    <section
      ref={ref}
      className="relative w-full bg-brand-softblack overflow-hidden py-16 md:py-24"
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-72 h-72 bg-brand-green/12 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-56 h-56 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-12 md:mb-16"
        >
          <div className="w-10 h-px bg-white/15" />
          <span className="text-[9px] uppercase tracking-[0.45em] text-white/30">Tentang Kami dalam Angka</span>
          <div className="w-10 h-px bg-white/15" />
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`group flex flex-col items-center justify-center text-center py-10 md:py-14 px-4 md:px-6 bg-brand-softblack hover:bg-white/[0.035] transition-colors duration-500 relative overflow-hidden ${
                i < 3 ? "border-r border-white/6" : ""
              } ${i < 2 ? "border-b border-white/6 md:border-b-0" : ""}`}
            >
              {/* Hover bottom line */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Hover top line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="text-brand-gold/40 group-hover:text-brand-gold/70 transition-colors duration-500 mb-4">
                {stat.icon}
              </div>

              {/* Number — gradient text */}
              <div className="gradient-text-gold text-[2.6rem] md:text-[3.2rem] font-extralight leading-none mb-3 tracking-tighter tabular-nums">
                <AnimatedCounter text={stat.value} />
                <span className="text-brand-gold">{stat.suffix}</span>
              </div>

              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.26em] font-medium text-white/50 mb-2">
                {stat.label}
              </p>
              <p className="text-[9px] text-white/22 font-light max-w-[130px] leading-relaxed hidden md:block">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/35 hover:text-brand-gold/70 transition-all duration-500 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-softblack rounded-sm px-1"
          >
            <span className="w-8 h-px bg-white/15 group-hover:w-12 group-hover:bg-brand-gold/40 transition-all duration-500" />
            Pelajari Lebih Lanjut
            <span className="w-8 h-px bg-white/15 group-hover:w-12 group-hover:bg-brand-gold/40 transition-all duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
