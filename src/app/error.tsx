"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const EASE_CUSTOM = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Kirim log error ke layanan pelaporan
    console.error("[Batas Error]", error.message, error.digest);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_CUSTOM }}
        className="max-w-xl text-center"
      >
        <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-brand-green/70 mb-8 pb-2 border-b border-stone-100">
          Kesalahan Teknis
        </span>
        
        <h1 className="text-5xl md:text-7xl font-extralight uppercase tracking-tighter text-brand-softblack mb-8">
          Sesuatu Tak <br />
          <span className="italic font-serif normal-case tracking-normal">Terduga Muncul.</span>
        </h1>
        
        <p className="text-sm font-light text-brand-softblack/50 mb-12 leading-relaxed max-w-md mx-auto">
          Mohon maaf atas ketidaknyamanan ini. Terjadi kesalahan saat memproses permintaan Anda. 
          Tim kami telah diberitahu untuk segera memperbaikinya.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            id="error_retry_button"
            type="button"
            onClick={reset}
            className="bg-brand-softblack text-white rounded-sm px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-brand-green hover:shadow-xl"
          >
            Coba Lagi
          </button>
          
          <Link
            id="error_home_link"
            href="/"
            className="bg-stone-50 text-brand-softblack border border-stone-200 rounded-sm px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-white hover:border-brand-softblack"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>

      {/* Subtle decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[40vw] font-bold text-brand-softblack">ERROR</span>
      </div>
    </div>
  );
}
