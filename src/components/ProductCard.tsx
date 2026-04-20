"use client";
import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import { Product } from "@/constants/products";
import { useCart } from "@/context/CartContext";
import { trackSelectItem } from "@/lib/analytics";
import { formatPrice } from "@/utils/format";
import { motion, AnimatePresence } from "framer-motion";

function ProductCard({ product, priority, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  const hoverImage = product.additionalImages && product.additionalImages.length > 1
    ? product.additionalImages[1]
    : product.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.soldOut || isAdding) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── IMAGE CONTAINER ── */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-[3/4] bg-brand-champagne/40 overflow-hidden mb-3.5 block rounded-sm"
        onClick={() =>
          trackSelectItem({
            itemId: product.id,
            itemName: product.name,
            price: product.price,
            category: product.category,
            itemListId: "homepage",
            itemListName: "Featured products",
          })
        }
      >
        {/* Images with crossfade */}
        <AnimatePresence initial={false} mode="wait">
          {!isHovered ? (
            <motion.div
              key="primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={priority}
                loading={priority ? undefined : "lazy"}
              />
            </motion.div>
          ) : (
            <motion.div
              key="hover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={hoverImage}
                alt={`${product.name} — tampilan alternatif`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── QUICK ADD OVERLAY (Desktop) ── */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-30 hidden md:block">
          <button
            onClick={handleQuickAdd}
            disabled={product.soldOut || isAdding}
            className="glimmer-hover w-full bg-white/92 backdrop-blur-lg py-3 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack hover:bg-brand-softblack hover:text-white transition-all duration-300 shadow-[0_8px_30px_rgba(28,28,28,0.15)] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-brand-green"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Berhasil!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  {product.soldOut ? "Habis" : "Tambah ke Tas"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ── SOLD OUT OVERLAY ── */}
        {product.soldOut && (
          <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-brand-softblack/90 text-white px-5 py-2 text-[9px] uppercase tracking-[0.3em] font-semibold shadow-xl backdrop-blur-sm transform -rotate-2">
              Sold Out
            </span>
          </div>
        )}

        {/* ── BADGE NEW / BESTSELLER ── */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`px-2.5 py-1 text-[7px] md:text-[8px] uppercase tracking-[0.28em] font-semibold ${
              product.badge === 'new'
                ? 'bg-brand-gold text-white'
                : product.badge === 'bestseller'
                ? 'bg-brand-softblack text-white'
                : 'bg-brand-softblack text-white'
            }`}>
              {product.badge === 'new' ? 'New In' : product.badge === 'bestseller' ? 'Best Seller' : product.badge}
            </span>
          </div>
        )}

        {/* ── DISCOUNT BADGE ── */}
        {hasDiscount && product.oldPrice && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="bg-brand-sale-red text-white px-2 py-1 text-[9px] uppercase tracking-widest font-bold shadow-sm">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          </div>
        )}
      </Link>

      {/* ── INFO SECTION ── */}
      <div className="flex flex-col items-center text-center px-1 flex-1">
        <Link href={`/product/${product.id}`} className="block w-full">
          <h3 className="text-[10px] uppercase tracking-[0.28em] font-light text-brand-softblack/70 mb-2 truncate group-hover:text-brand-softblack transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] md:text-xs font-semibold text-brand-softblack tracking-wider">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && product.oldPrice && (
            <span className="text-[9px] md:text-[10px] text-brand-softblack/30 line-through font-light">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Color Swatches — diperbesar */}
        {product.colorVariants && product.colorVariants.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            {product.colorVariants.map((variant, i) => (
              <div
                key={i}
                className="relative group/swatch"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-brand-softblack/12 shadow-sm transition-transform duration-300 hover:scale-125 cursor-pointer ring-offset-2 hover:ring-1 hover:ring-brand-gold/50"
                  style={{ backgroundColor: variant.color }}
                  title={variant.name || variant.color}
                />
                {/* Tooltip nama warna */}
                {variant.name && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-softblack text-white text-[7px] px-2 py-0.5 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-200 pointer-events-none rounded-sm">
                    {variant.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Quick Add */}
      <div className="mt-3.5 md:hidden">
        <button
          onClick={() => !product.soldOut && addToCart(product)}
          disabled={product.soldOut}
          className="w-full border border-brand-softblack/12 py-2.5 text-[9px] uppercase tracking-widest font-medium text-brand-softblack active:bg-brand-softblack active:text-white transition-all hover:border-brand-softblack/30"
        >
          {product.soldOut ? "Habis" : "Beli"}
        </button>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);
