"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { trackViewCart } from "@/lib/analytics";
import { formatPrice } from "@/utils/format";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import ShippingMeter from "@/components/cart/ShippingMeter";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const drawerTransition = {
  type: "tween" as const,
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as const,
};
const backdropTransition = { duration: 0.35, ease: "easeOut" as const };

export default function CartDrawer() {
  const { settings } = useSiteSettings();
  const {
    cart,
    totalPrice,
    removeFromCart,
    updateQuantity,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const isFreeShipping = totalPrice >= settings.freeShippingThreshold;

  const closeDrawer = useCallback(() => {
    setIsCartDrawerOpen(false);
  }, [setIsCartDrawerOpen]);

  const hasFiredViewCartRef = useRef(false);

  useEffect(() => {
    if (!isCartDrawerOpen) {
      hasFiredViewCartRef.current = false;
      return;
    }
    if (!hasFiredViewCartRef.current) {
      hasFiredViewCartRef.current = true;
      trackViewCart({
        value: totalPrice,
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.base_price,
          quantity: i.quantity,
          category: i.category_id || undefined,
        })),
      });
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCartDrawerOpen, closeDrawer, cart, totalPrice]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[3px]"
            aria-hidden
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={drawerTransition}
            className="fixed top-0 right-0 z-[101] flex h-full w-full flex-col overflow-hidden bg-brand-offwhite shadow-2xl md:h-full md:w-[420px] md:max-w-[100vw]"
            role="dialog"
            aria-modal="true"
            aria-label="Keranjang belanja"
          >
            {/* Top gold accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent shrink-0" />

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-6 py-5 border-b border-stone-200/60 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-brand-softblack/50" strokeWidth={1.5} />
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-softblack">
                  Keranjang Belanja
                </h2>
                {cart.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-softblack text-white text-[9px] font-bold flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-8 w-8 items-center justify-center rounded-sm text-brand-softblack/40 transition-colors hover:bg-stone-100 hover:text-brand-softblack"
                aria-label="Tutup keranjang"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {cart.length === 0 ? (
              /* ── EMPTY STATE ── */
              <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-8 relative"
                >
                  {/* Outer ring */}
                  <div className="w-28 h-28 rounded-full border border-brand-champagne flex items-center justify-center relative">
                    {/* Inner circle */}
                    <div className="w-20 h-20 rounded-full bg-brand-champagne/40 flex items-center justify-center">
                      <ShoppingBag className="w-9 h-9 text-brand-softblack/20" strokeWidth={1} />
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute top-2 right-4 w-1.5 h-1.5 rounded-full bg-brand-gold/30 animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-brand-green/25" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h3 className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-brand-softblack">
                    Tas Anda Kosong
                  </h3>
                  <p className="mb-10 max-w-[220px] mx-auto text-xs font-light leading-relaxed text-brand-softblack/45">
                    Temukan koleksi fashion premium kami dan tambahkan ke keranjang.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex w-full max-w-[260px] flex-col gap-3"
                >
                  <Link
                    href="/collections"
                    onClick={closeDrawer}
                    className="glimmer-hover flex items-center justify-center gap-2 rounded-sm bg-brand-softblack px-6 py-4 text-[10px] font-medium uppercase tracking-[0.28em] text-white transition-all hover:bg-brand-green shadow-md"
                  >
                    Mulai Belanja
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200/60" />
                    </div>
                    <span className="relative bg-brand-offwhite px-4 text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">
                      atau cari
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {["Bestseller", "New In"].map((cat) => (
                      <Link
                        key={cat}
                        href="/collections"
                        onClick={closeDrawer}
                        className="flex items-center justify-center rounded-sm border border-stone-200 bg-white py-3 text-[9px] uppercase tracking-widest text-brand-softblack/60 transition-all hover:border-brand-green/30 hover:text-brand-green"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
                {/* ── ITEM LIST ── */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-0">
                  <AnimatePresence initial={false}>
                    {cart.map((item, idx) => {
                      const itemHref = `/product/${item.id}`;
                      return (
                        <motion.li
                          key={`${item.id}-${item.isKit ? "kit" : "prod"}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4 pb-5 mb-5 border-b border-stone-100 last:border-0 last:mb-0 list-none"
                        >
                          {/* Product thumbnail */}
                          <Link
                            href={itemHref}
                            onClick={closeDrawer}
                            className="relative block h-[88px] w-[72px] shrink-0 overflow-hidden rounded-sm bg-brand-champagne/30 group"
                          >
                            <Image
                              src={item.image_url || "/images/products/glow.jpeg"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="72px"
                            />
                          </Link>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <Link
                              href={itemHref}
                              onClick={closeDrawer}
                              className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-softblack hover:text-brand-green transition-colors block leading-tight mb-1.5 truncate"
                            >
                              {item.name}
                            </Link>
                             <p className="text-sm font-light text-brand-softblack/70 mb-3">
                              {formatPrice(item.base_price)}
                              {item.quantity > 1 && (
                                <span className="ml-1 text-brand-softblack/40 text-xs">
                                  × {item.quantity}
                                </span>
                              )}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-stone-200 bg-white rounded-sm overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="flex h-7 w-7 items-center justify-center text-brand-softblack/40 transition-colors hover:bg-brand-champagne/40 hover:text-brand-softblack"
                                  aria-label="Kurangi jumlah"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-7 text-center text-xs font-medium tabular-nums text-brand-softblack border-x border-stone-200 py-1">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="flex h-7 w-7 items-center justify-center text-brand-softblack/40 transition-colors hover:bg-brand-champagne/40 hover:text-brand-softblack"
                                  aria-label="Tambah jumlah"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-sm text-brand-softblack/25 transition-all hover:bg-red-50 hover:text-red-500"
                                aria-label="Hapus dari keranjang"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Line total */}
                           <p className="shrink-0 text-right text-sm font-medium tabular-nums text-brand-softblack self-start pt-0.5">
                            {formatPrice(item.base_price * item.quantity)}
                          </p>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* ── CHECKOUT PANEL ── */}
                <div className="shrink-0 border-t border-stone-200/60 bg-white/90 backdrop-blur-sm px-5 py-5">
                  <ShippingMeter currentSubtotal={totalPrice} />

                  {/* Promo code hint */}
                  <div className="bg-brand-champagne/30 border border-brand-gold/15 rounded-sm px-4 py-2.5 flex items-center gap-2.5 mb-4">
                    <span className="text-brand-gold/70 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
                      </svg>
                    </span>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-brand-softblack/60 leading-snug">
                      Kupon <span className="font-bold text-brand-green">{settings.primaryPromoCode}</span>: Diskon 5% + Gratis Ongkir
                    </p>
                  </div>

                  {/* Total breakdown */}
                  <div className="space-y-2 border-t border-stone-100 pt-4 mb-4">
                    <div className="flex justify-between text-xs font-light text-brand-softblack/50">
                      <span className="uppercase tracking-wider">Subtotal</span>
                      <span className="tabular-nums">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-light text-brand-softblack/50">
                      <span className="uppercase tracking-wider">Ongkir</span>
                      <span className={`tabular-nums ${isFreeShipping ? "text-brand-green font-medium" : ""}`}>
                        {isFreeShipping ? "Gratis 🎉" : "Dihitung saat checkout"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-stone-100">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-softblack">Total</span>
                      <span className="text-sm font-semibold tabular-nums text-brand-softblack">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className="glimmer-hover flex items-center justify-center gap-2.5 rounded-sm bg-brand-green px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-offwhite shadow-md transition-all hover:bg-brand-softblack hover:shadow-lg"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Selesaikan Pesanan
                    </Link>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/30 hover:text-brand-softblack/60 transition-colors py-1.5"
                    >
                      ← Lanjut Belanja
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
