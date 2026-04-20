"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/constants/products";
import { formatPrice } from "@/utils/format";
import { useCart } from "@/context/CartContext";

interface CompleteTheLookProps {
  products: Product[];
  currentProductName: string;
}

export default function CompleteTheLook({ products, currentProductName }: CompleteTheLookProps) {
  const { addToCart } = useCart();

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-brand-gold/50" />
            <span className="text-[9px] uppercase tracking-[0.48em] font-bold text-brand-green flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" strokeWidth={1.5} />
              Sempurnakan Penampilanmu
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[-0.02em] text-brand-softblack">
            Complete The Look
          </h2>
        </div>
        <p className="text-sm text-brand-softblack/40 font-light max-w-xs md:text-right leading-relaxed">
          Kurasi stylist benangbaju untuk melengkapi{" "}
          <strong className="text-brand-softblack/60">{currentProductName}</strong>
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-brand-gold/20 via-brand-champagne to-transparent mb-10" />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {products.slice(0, 2).map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-brand-champagne/20 mb-4 rounded-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Quick Add */}
              <div className="absolute inset-0 flex items-end p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-white/92 backdrop-blur-sm text-brand-softblack py-3 text-[9px] uppercase tracking-[0.22em] font-semibold flex items-center justify-center gap-2 shadow-xl hover:bg-brand-softblack hover:text-white transition-all duration-300 rounded-sm"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Tambah ke Tas
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/product/${product.id}`}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-softblack hover:text-brand-green transition-colors leading-tight line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-xs font-medium text-brand-softblack/60 whitespace-nowrap shrink-0">
                  {formatPrice(product.price)}
                </p>
              </div>
              <p className="text-[9px] text-brand-softblack/30 uppercase tracking-widest">
                {product.category}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Style Bundle Card — Premium Redesign */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-2 lg:col-span-2 relative overflow-hidden rounded-sm border border-brand-green/10 bg-gradient-to-br from-brand-green/5 via-brand-champagne/10 to-brand-gold/5 p-8 flex flex-col justify-between min-h-[280px]"
        >
          {/* Background decorative */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-5">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-white/80 border border-brand-gold/20 flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5 text-brand-green/70" strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.42em] text-brand-gold/70 font-semibold mb-2">
                Style Bundle
              </p>
              <h3 className="text-2xl font-light text-brand-softblack leading-tight mb-3">
                Hemat <span className="font-semibold text-brand-green">15%</span> dengan Beli Set
              </h3>
              <p className="text-sm text-brand-softblack/50 leading-relaxed max-w-xs">
                Pilih item pelengkap ini dan gunakan kode{" "}
                <span className="font-mono bg-white px-2 py-0.5 border border-stone-200 text-brand-softblack text-xs font-bold rounded-sm shadow-sm">
                  BUNDLELUXE
                </span>{" "}
                di checkout.
              </p>
            </div>
          </div>

          <Link
            href="/collections"
            className="relative group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] font-semibold text-brand-softblack hover:text-brand-green transition-all duration-300 mt-4"
          >
            <span className="w-8 h-px bg-brand-softblack/30 group-hover:w-12 group-hover:bg-brand-green/50 transition-all duration-400" />
            Lihat Semua Koleksi
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
