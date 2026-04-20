"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface AboutSectionImage {
  src: string;
  alt: string;
}

interface AboutSectionProps {
  image?: AboutSectionImage;
}

const VALUES = [
  { num: "01", label: "Kualitas", desc: "Kain premium dipilih dengan cermat" },
  { num: "02", label: "Tradisi", desc: "Terinspirasi kekayaan budaya Indonesia" },
  { num: "03", label: "Modern", desc: "Siluet kontemporer untuk hari ini" },
];

export default function AboutSection({ image }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-offwhite overflow-hidden py-2 md:py-4"
    >
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[560px] md:min-h-[640px]">

          {/* Image column */}
          {image && (
            <div className="relative order-2 md:order-1 overflow-hidden h-80 md:h-auto">
              <motion.div className="absolute inset-0" style={{ y: imageY }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={false}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-offwhite/25 hidden md:block" />
                {/* Bottom fade mobile */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-offwhite/60 to-transparent md:hidden" />
              </motion.div>

              {/* Floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
                transition={{ delay: 0.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-8 right-4 md:bottom-10 md:right-8 glass-card px-5 py-4 max-w-[220px] hidden sm:block rounded-sm"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-green mb-1.5 font-semibold">Misi Kami</p>
                <p className="text-xs text-brand-softblack/65 font-light leading-relaxed">
                  Merayakan keindahan dan identitas wanita Indonesia.
                </p>
              </motion.div>
            </div>
          )}

          {/* Text column */}
          <motion.div
            style={{ y: textY }}
            className="order-1 md:order-2 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-14 md:py-20"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 text-brand-green uppercase tracking-[0.44em] text-[9px] font-bold mb-6"
            >
              <span className="w-6 h-px bg-brand-gold/50" />
              Cerita Kami
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[-0.02em] text-brand-softblack leading-[1.06] mb-7"
            >
              Dibuat dengan penuh rasa,{" "}
              <span className="italic font-extralight text-brand-softblack/55">untuk perempuan Indonesia.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.22, duration: 0.7 }}
              className="text-brand-softblack/60 text-sm md:text-base font-light leading-[1.85] mb-10 max-w-md"
            >
              benangbaju lahir dari kecintaan pada fashion dan kebanggaan terhadap budaya Indonesia.
              Kami merancang pakaian yang nyaman dipakai sehari-hari namun tetap tampil elegan —
              karena kami percaya gaya terbaik adalah yang mencerminkan dirimu yang sesungguhnya.
            </motion.p>

            {/* Values — dengan nomor ordinal */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.32, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-10"
            >
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.38 + i * 0.08, duration: 0.5 }}
                  className="group"
                >
                  {/* Number ordinal */}
                  <span className="text-[9px] font-light text-brand-gold/50 group-hover:text-brand-gold transition-colors duration-300 tracking-widest">
                    {v.num}
                  </span>
                  <div className="h-px w-full bg-brand-gold/25 mb-3 mt-1.5 group-hover:bg-brand-gold/50 transition-colors duration-400" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-softblack mb-1">{v.label}</p>
                  <p className="text-[9px] text-brand-softblack/35 font-light leading-snug">{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.48, duration: 0.6 }}
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-brand-softblack hover:text-brand-green transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-offwhite rounded-sm px-1"
              >
                <span className="w-10 h-px bg-brand-softblack/25 group-hover:w-16 group-hover:bg-brand-green/50 transition-all duration-500" />
                Kenali Kami
                <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-champagne/60 to-transparent" />
    </section>
  );
}
