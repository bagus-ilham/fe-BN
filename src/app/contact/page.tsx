"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { getPublishedCMSPageBySlug } from "@/lib/cms-service";
import CMSBlocksRenderer from "@/components/cms/CMSBlocksRenderer";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { CmsPage, CmsBlock } from "@/types/database";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [cmsPage, setCmsPage] = useState<CmsPage | null>(null);

  useEffect(() => {
    getPublishedCMSPageBySlug("contact").then(setCmsPage);
  }, []);
  
  if (cmsPage && (cmsPage.blocks as any[])?.length > 0) {
    return (
      <main className="bg-brand-offwhite page-shell">
        <CMSBlocksRenderer blocks={cmsPage.blocks as unknown as CmsBlock[]} />
      </main>
    );
  }

  return (
    <main className="page-shell bg-brand-offwhite overflow-x-hidden">
      {/* ── Hero Section ── */}
      <div className="relative bg-brand-softblack text-brand-offwhite pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative grain / texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="block uppercase tracking-[0.55em] text-[9px] mb-5 text-brand-gold font-medium">
            Bantuan
          </span>
          <h1 className="text-4xl md:text-6xl font-extralight uppercase tracking-[0.15em] mb-6 leading-none">
            Layanan<br />Pelanggan
          </h1>
          <p className="text-sm md:text-base font-light tracking-wider opacity-60 leading-relaxed max-w-xl mx-auto">
            Kami di sini untuk memastikan pengalaman berbelanja Anda
            menyenangkan dari awal hingga akhir.
          </p>
        </div>
      </div>

      {/* ── Kontak Utama ── */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {/* Email */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="surface-card relative p-8 md:p-10 h-full hover:border-brand-green/40 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-11 h-11 bg-brand-champagne flex items-center justify-center group-hover:bg-brand-green group-hover:scale-105 transition-all duration-300">
                  <Mail className="w-4 h-4 text-brand-green group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[9px] uppercase tracking-[0.35em] text-brand-softblack/40 mb-3 font-semibold">
                    Email
                  </h3>
                  <a
                    href={`mailto:${settings.contactInfo.email}`}
                    className="text-lg md:text-xl font-light text-brand-softblack hover:text-brand-green transition-colors duration-300"
                  >
                    {settings.contactInfo.email}
                  </a>
                  <p className="text-xs text-brand-softblack/40 mt-3 font-light leading-relaxed">
                    Balasan dalam 1 × 24 jam kerja
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="surface-card relative p-8 md:p-10 h-full hover:border-brand-green/40 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-11 h-11 bg-brand-champagne flex items-center justify-center group-hover:bg-brand-green group-hover:scale-105 transition-all duration-300">
                  <MessageCircle className="w-4 h-4 text-brand-green group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[9px] uppercase tracking-[0.35em] text-brand-softblack/40 mb-3 font-semibold">
                    WhatsApp
                  </h3>
                  <a
                    href={`https://wa.me/${settings.contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg md:text-xl font-light text-brand-softblack hover:text-brand-green transition-colors duration-300"
                  >
                    {settings.contactInfo.whatsapp}
                  </a>
                  <p className="text-xs text-brand-softblack/40 mt-3 font-light leading-relaxed">
                    Senin–Jumat, pukul 09.00–18.00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="border-t border-brand-softblack/8 pt-16">
          <h2 className="text-xl font-light uppercase tracking-[0.25em] text-brand-softblack mb-12 text-center">
            Informasi Lainnya
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-champagne/60 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-brand-green" />
              </div>
              <div>
                <h3 className="text-[9px] uppercase tracking-[0.35em] text-brand-softblack/40 mb-2.5 font-semibold">
                  Alamat
                </h3>
                <p className="text-sm font-light text-brand-softblack/70 leading-relaxed">
                  {settings.contactInfo.address}
                </p>
                {settings.contactInfo.mapLink && (
                  <a href={settings.contactInfo.mapLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-green hover:underline mt-2 inline-block uppercase tracking-widest font-bold">
                    Lihat di Google Maps
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-champagne/60 flex items-center justify-center">
                <Clock className="w-4 h-4 text-brand-green" />
              </div>
              <div>
                <h3 className="text-[9px] uppercase tracking-[0.35em] text-brand-softblack/40 mb-2.5 font-semibold">
                  Jam Operasional
                </h3>
                <p className="text-sm font-light text-brand-softblack/70 leading-relaxed">
                  Senin – Jumat: 09.00 – 18.00 WIB<br />
                  Sabtu: 09.00 – 13.00 WIB<br />
                  Minggu & Hari Libur: Tutup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-brand-champagne/25 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-light uppercase tracking-[0.25em] text-brand-softblack mb-3 text-center">
            Pertanyaan Umum
          </h2>
          <p className="text-xs text-brand-softblack/45 text-center mb-12 font-light tracking-wide">
            Sebelum menghubungi kami, cek dulu apakah pertanyaanmu sudah terjawab di sini
          </p>

          <div className="space-y-px">
            {[
              {
                q: "Bagaimana cara pengiriman pesanan?",
                a: `Pengiriman dihitung otomatis saat checkout berdasarkan lokasi Anda. Kami bekerja sama dengan JNE, J&T, dan SiCepat. Gratis ongkir untuk pembelian di atas Rp ${settings.freeShippingThreshold.toLocaleString('id-ID')}.`,
              },
              {
                q: "Bagaimana cara penukaran atau pengembalian produk?",
                a: "Anda memiliki waktu 7 hari kalender setelah barang diterima untuk mengajukan penukaran atau pengembalian. Hubungi kami via email atau WhatsApp untuk panduan prosesnya.",
              },
              {
                q: "Apa saja metode pembayaran yang diterima?",
                a: "Kami menerima Kartu Kredit (Visa, Mastercard, JCB), Transfer Bank, GoPay, OVO, Dana, dan QRIS. Semua transaksi diproses dengan aman.",
              },
              {
                q: "Bahan pakaian apa yang digunakan oleh benangbaju?",
                a: "Kami menggunakan campuran bahan premium seperti katun combed, linen, dan viscose yang nyaman dipakai seharian. Detail bahan tersedia di setiap halaman produk.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group border border-brand-softblack/8 bg-white open:border-brand-green/25"
              >
                <summary className="flex justify-between items-center gap-4 cursor-pointer px-6 py-5 hover:bg-brand-champagne/30 transition-colors">
                  <span className="text-[11px] font-light uppercase tracking-wider text-brand-softblack min-w-0 flex-1 group-open:text-brand-green transition-colors">
                    {q}
                  </span>
                  <svg
                    className="w-4 h-4 shrink-0 text-brand-softblack/30 transition-transform duration-300 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-sm text-brand-softblack/60 font-light leading-relaxed border-t border-brand-softblack/6 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="text-brand-green uppercase tracking-[0.45em] text-[9px] font-semibold mb-5 block">
          Masih ada pertanyaan?
        </span>
        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.15em] text-brand-softblack mb-4">
          Kami Siap Membantu
        </h2>
        <p className="text-sm text-brand-softblack/50 mb-12 font-light max-w-xl mx-auto leading-relaxed">
          Tim kami senang membantu Anda. Jangan ragu untuk menghubungi kami
          melalui kanal di atas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`mailto:${settings.contactInfo.email}`}
            className="inline-flex items-center justify-center gap-2.5 border border-brand-green bg-brand-green text-brand-offwhite px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-brand-softblack hover:border-brand-softblack transition-all duration-300"
          >
            <Mail className="w-3.5 h-3.5" />
            Kirim Email
          </a>
          <a
            href={`https://wa.me/${settings.contactInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 border border-brand-softblack/20 bg-white text-brand-softblack px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-brand-softblack hover:text-white hover:border-brand-softblack transition-all duration-300"
          >
            <Phone className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

