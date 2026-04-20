"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

interface CollectionBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  ctaText?: string;
  reverse?: boolean;
}

export default function CollectionBanner({
  title,
  subtitle,
  image,
  link,
  ctaText = "Jelajahi Koleksi",
  reverse = false,
}: CollectionBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-brand-offwhite"
    >
      <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-stretch min-h-[60vh] md:min-h-[78vh]`}>

        {/* ── Image Area ── */}
        <div className="relative w-full md:w-3/5 overflow-hidden min-h-[42vh] md:min-h-0">
          <motion.div style={{ y }} className="absolute -inset-[12%]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </motion.div>
          {/* Cinematic overlay */}
          <div className={`absolute inset-0 bg-gradient-to-${reverse ? "l" : "r"} from-transparent via-transparent to-brand-offwhite/20`} />
          {/* Bottom fade to background */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-offwhite/30 to-transparent md:hidden" />
        </div>

        {/* ── Text Area ── */}
        <motion.div
          style={{ y: textY }}
          className="w-full md:w-2/5 flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-brand-offwhite"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative top line */}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-brand-gold/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
            </div>

            {subtitle && (
              <span className="block text-[10px] uppercase tracking-[0.45em] text-brand-softblack/35 mb-4 font-medium">
                {subtitle}
              </span>
            )}

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-brand-softblack mb-8 leading-[1.08]">
              {title}
            </h2>

            {/* Premium CTA */}
            <Link
              href={link}
              className="group inline-flex items-center gap-5 text-[10px] uppercase tracking-[0.35em] font-medium text-brand-softblack hover:text-brand-green transition-all duration-500"
            >
              {ctaText}
              {/* Animated line + arrow */}
              <span className="relative flex items-center">
                <span className="relative w-12 h-px bg-brand-softblack/20 overflow-hidden">
                  <span className="absolute inset-0 bg-brand-green translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                </span>
                <svg
                  className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 text-brand-green"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
