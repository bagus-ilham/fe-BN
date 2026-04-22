"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { getPublishedCMSPageBySlug } from "@/lib/cms-service";
import CMSBlocksRenderer from "@/components/cms/CMSBlocksRenderer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CmsPage, CmsBlock } from "@/types/database";

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const [cmsPage, setCmsPage] = useState<CmsPage | null>(null);

  useEffect(() => {
    getPublishedCMSPageBySlug("about").then(setCmsPage);
  }, []);
  
  if (cmsPage && (cmsPage.blocks as any[])?.length > 0) {
    return (
      <main className="bg-brand-offwhite page-shell">
        <CMSBlocksRenderer blocks={cmsPage.blocks as unknown as CmsBlock[]} />
      </main>
    );
  }

  return (
    <main className="bg-brand-offwhite">
      {/* ── Hero Section ── */}
      <section className="group relative h-[65svh] md:h-[75svh] w-full flex items-end justify-center overflow-hidden bg-brand-softblack pt-14">
        {/* Background */}
        <div className="absolute inset-0 transform-gpu will-change-transform md:transition-transform md:duration-700 md:ease-out md:group-hover:scale-105">
          <Image
            src="https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/fundadores.png"
            alt="Tim benangbaju"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center grayscale opacity-60"
          />
        </div>

        {/* Gradient overlay — bottom up */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-softblack/90 via-brand-softblack/30 to-transparent z-[1]" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16 md:pb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block uppercase tracking-[0.55em] text-[9px] mb-4 text-brand-gold font-medium"
          >
            Cerita Kami
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extralight uppercase tracking-tighter text-brand-offwhite leading-none mb-4"
          >
            Tentang<br />{settings.storeName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-brand-offwhite/60 text-sm font-light tracking-wide max-w-xl"
          >
            Dirajut dari rasa, dihadirkan untuk perempuan Indonesia.
          </motion.p>
        </div>
      </section>

      {/* ── Cerita Brand ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-16">
          <span className="text-brand-green uppercase tracking-[0.45em] text-[9px] font-semibold mb-6 block">
            Asal Usul
          </span>
          <h2 className="text-brand-softblack text-3xl md:text-4xl font-light uppercase tracking-tighter leading-tight mb-10">
            Dibuat dengan penuh rasa
          </h2>
        </div>

        <div className="space-y-6 text-brand-softblack/65 text-sm md:text-[15px] font-light leading-[1.85] tracking-wide">
          <p>
            {settings.storeName} lahir dari keyakinan sederhana namun kuat: setiap perempuan
            berhak berpakaian dengan nyaman, elegan, dan percaya diri — tanpa harus
            mengorbankan satu dari ketiganya.
          </p>
          <p>
            Kami memulai dari rasa frustasi yang familiar: mencari pakaian bagus
            tapi sulit menemukan yang benar-benar pas di tubuh, sesuai dengan gaya
            hidup Indonesia yang dinamis. Dari sana, kami memutuskan untuk
            merancang sendiri.
          </p>
          <p>
            Setiap koleksi kami dirancang dengan mempertimbangkan kualitas bahan,
            kenyamanan pemakaian sepanjang hari, dan estetika yang timeless —
            bukan sekadar mengikuti tren yang lewat begitu saja.
          </p>
          <p>
            {settings.storeName} bukan hanya tentang pakaian. Ini tentang bagaimana kamu
            ingin dilihat, bagaimana kamu ingin merasa, dan cerita apa yang ingin
            kamu sampaikan ke dunia lewat setiap helai benang yang kamu kenakan.
          </p>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-20 border-y border-stone-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-4xl font-extralight text-brand-softblack mb-2">{settings.brandStats.customers}</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Pelanggan Setia</p>
          </div>
          <div>
            <p className="text-4xl font-extralight text-brand-softblack mb-2">{settings.brandStats.reviews}</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Ulasan Positif</p>
          </div>
          <div>
            <p className="text-4xl font-extralight text-brand-softblack mb-2">{settings.brandStats.itemsSold}</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Produk Terjual</p>
          </div>
        </div>
      </section>

      {/* ── Nilai-nilai ── */}
      <section className="bg-brand-offwhite py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-green uppercase tracking-[0.45em] text-[9px] font-semibold mb-6 block">
              Nilai Kami
            </span>
            <h2 className="text-brand-softblack text-3xl md:text-4xl font-light uppercase tracking-tighter leading-tight">
              Yang menggerakkan kami
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-10 h-10 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "Kualitas",
                desc: "Setiap produk dibuat dari bahan pilihan yang telah melewati seleksi ketat — nyaman di kulit, tahan lama di waktu.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-10 h-10 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: "Ketulusan",
                desc: "Kami merancang untuk perempuan nyata — bukan untuk foto di majalah. Kejujuran menjadi fondasi setiap keputusan.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-10 h-10 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                ),
                title: "Keberlanjutan",
                desc: "Kami memilih bahan yang ramah lingkungan dan proses produksi yang bertanggung jawab — karena bumi ini juga milik generasi berikutnya.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="group text-center p-8 transition-all duration-400 ease-out hover:bg-brand-champagne/40 rounded-sm"
              >
                <div className="transition-transform duration-400 ease-out group-hover:-translate-y-1">
                  <div className="mb-6 text-brand-green">{v.icon}</div>
                  <h3 className="text-brand-gold text-[11px] font-semibold uppercase tracking-[0.3em] mb-4 group-hover:text-brand-green transition-colors duration-400">
                    {v.title}
                  </h3>
                  <p className="text-brand-softblack/55 text-sm font-light leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote CTA ── */}
      <section className="bg-brand-softblack py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-offwhite/80 text-lg md:text-2xl font-extralight leading-[1.7] tracking-wide italic mb-12">
            &ldquo;Fashion adalah cara termudah untuk mengekspresikan siapa dirimu
            tanpa harus mengucapkan sepatah kata pun.&rdquo;
          </p>
          <div className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-medium mb-14">
            — Tim {settings.storeName}
          </div>
          <Link
            href="/collections"
            className="inline-block border border-brand-offwhite/80 px-12 py-4 text-[10px] uppercase tracking-[0.3em] text-brand-offwhite hover:bg-brand-offwhite hover:text-brand-softblack transition-all duration-300 font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-softblack"
          >
            Lihat Koleksi
          </Link>
        </div>
      </section>
    </main>
  );
}

