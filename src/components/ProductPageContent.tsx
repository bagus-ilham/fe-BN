"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/format";
import ProductAccordion from "@/components/ProductAccordion";
import ProductImageGallery from "@/components/ProductImageGallery";
import TextReveal from "@/components/ui/text-reveal";
import { motion, AnimatePresence } from "framer-motion";
import WaitlistModal from "@/components/WaitlistModal";
import SizeHelper from "@/components/SizeHelper";
import { ShareButton } from "@/components/shop/ShareButton";
import { ProductShippingCalculator } from "@/components/shop/ProductShippingCalculator";
import CompleteTheLook from "@/components/CompleteTheLook";
import ProductReviews from "@/components/shop/ProductReviews";
import { Product } from "@/constants/products";
import { getFrequentlyBoughtTogetherProducts } from "@/utils/recommendations";
import { useAuth } from "@/hooks/useAuth";
import CheckoutBenefitsBar from "@/components/CheckoutBenefitsBar";
import ProductTrustSeals from "@/components/ProductTrustSeals";
import ProductValueProposition from "@/components/ProductValueProposition";
import ProductDetailsTable from "@/components/ProductDetailsTable";
import StickyBar from "@/components/StickyBar";
import { trackViewItem } from "@/lib/analytics";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { InventoryStatus } from "@/types/database";

interface ProductPageContentProps {
  product: Product;
}

interface HighlightItem {
  name: string;
  detail: string;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
  const { addToCart } = useCart();
  useAuth();
  const [inventory, setInventory] = useState<InventoryStatus | null>(null);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [showSizeHelper, setShowSizeHelper] = useState(false);
  const [reviewsSummary, setReviewsSummary] = useState<{ rating: number; reviews: number } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(
    product.colorVariants && product.colorVariants.length > 0 ? product.colorVariants[0] : null
  );
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (typeof window !== "undefined" && window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
  }, [product.id]);

  useEffect(() => {
    trackViewItem({
      itemId: product.id,
      itemName: product.name,
      price: product.price,
      category: product.category,
      isKit: false,
    });
  }, [product.id, product.name, product.price, product.category]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`/api/inventory/status?product_id=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setInventory(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data inventori:", error);
        setInventory(null);
      }
    };
    fetchInventory();
  }, [product.id]);

  useEffect(() => {
    fetch("/api/reviews/summary")
      .then((r) => r.json())
      .then((data: Array<{ product_id: string; rating: number; reviews: number }>) => {
        const found = Array.isArray(data) ? data.find((s) => s.product_id === product.id) : null;
        setReviewsSummary(found ? { rating: found.rating, reviews: found.reviews } : null);
      })
      .catch(() => setReviewsSummary(null));
  }, [product.id]);

  const handleAddToCart = useCallback(() => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 2000);
  }, [addToCart, product]);

  const handleBuyNow = useCallback(() => {
    addToCart(product, false);
  }, [addToCart, product]);

  const isOutOfStock = useMemo(() => {
    if (product.soldOut) return true;
    return inventory !== null && inventory.available_quantity === 0;
  }, [inventory, product.soldOut]);

  const recommendedProducts = useMemo(
    () => getFrequentlyBoughtTogetherProducts(product.id),
    [product.id]
  );

  // benangbaju Fashion Product Content
  const getProductSpecificContent = (productId: string, primaryPromoCode: string, siteSettings: any) => {
    // 1. DYNAMIC HIGHLIGHTS (from CMS metadata)
    const keyHighlights = product.highlights && product.highlights.length > 0 
      ? product.highlights 
      : [
          { name: "Eco-Friendly", detail: "Menggunakan pewarna alami yang aman bagi lingkungan" },
          { name: "Handmade", detail: "Setiap detail dikerjakan dengan tangan terampil pengrajin lokal" },
          { name: "Ethical Fashion", detail: "Proses produksi yang adil dan transparan" },
          { name: "Premium Packaging", detail: "Dikemas eksklusif, cocok untuk hadiah" },
        ];

    // 2. DYNAMIC ACCORDION ITEMS
    const accordionItems = [
      {
        title: "Detail Produk & Bahan",
        content: (
          <div className="space-y-4">
            <p className="text-brand-softblack/70 text-sm leading-relaxed">
              Koleksi {siteSettings.storeName} dirancang dengan mengutamakan kenyamanan tanpa mengorbankan estetika. Menggunakan material berkualitas tinggi yang sejuk dan jatuh dengan indah di tubuh.
            </p>
            <ul className="space-y-2 list-none text-sm">
              <li className="flex gap-2">
                <span className="text-brand-green">•</span>
                <span className="text-brand-softblack/80 font-medium">Material: Premium Cotton / Silk Blend</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">•</span>
                <span className="text-brand-softblack/80 font-medium">Tekstur: Lembut, Ringan, & Tidak Menerawang</span>
              </li>
            </ul>
            <div className="mt-4">
              <ProductDetailsTable productId={productId} />
            </div>
          </div>
        ),
      },
      {
        title: "Panduan Ukuran",
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-brand-softblack/70 text-xs italic">
                *Ukuran dalam centimeter (cm). Toleransi 1-2cm.
              </p>
              <button 
                onClick={() => setShowSizeHelper(true)}
                className="text-[10px] uppercase tracking-widest font-bold text-brand-green border-b border-brand-green/30 hover:border-brand-green transition-all pb-0.5"
              >
                Bingung Pilih Ukuran?
              </button>
            </div>
            {product.sizeGuide ? (
              <div className="text-xs text-brand-softblack/70 whitespace-pre-line leading-relaxed font-mono bg-stone-50 p-4 border border-stone-100 italic">
                {product.sizeGuide}
              </div>
            ) : (
              <div className="text-xs text-brand-softblack/60 italic p-4 bg-stone-50 rounded-sm">
                Lihat Panduan Ukuran di tombol sebelah kanan atas.
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Instruksi Perawatan",
        content: (
          <div className="space-y-4 text-sm text-brand-softblack/70 leading-relaxed">
            {product.careInstructions ? (
              <p className="whitespace-pre-line">{product.careInstructions}</p>
            ) : (
              <p className="whitespace-pre-line">{siteSettings.productDetailSettings.defaultCareInstructions}</p>
            )}
          </div>
        ),
      },
      {
        title: "Pengiriman & Retur",
        content: (
          <div className="space-y-6 text-sm text-brand-softblack/70 leading-relaxed">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-softblack mb-2">Kebijakan Pengiriman</h4>
              <p>{siteSettings.productDetailSettings.shippingPolicy}</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-softblack mb-2">Kebijakan Retur</h4>
              <p>{siteSettings.productDetailSettings.returnPolicy}</p>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold">
              Gunakan Kupon: {primaryPromoCode} untuk Gratis Ongkir
            </p>
          </div>
        ),
      },
    ];

    return {
      accordionItems,
      keyHighlights,
    };
  };

  const { settings } = useSiteSettings();
  const { accordionItems, keyHighlights } = getProductSpecificContent(product.id, settings.primaryPromoCode, settings);

  return (
    <div className="bg-brand-offwhite min-h-screen">
      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-24 md:pt-14 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductImageGallery 
            images={Array.from(new Set([product.image, ...(product.additionalImages || [])]))} 
            alt={product.name} 
          />
          
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-green bg-brand-green/5 px-2 py-1 rounded-sm">
                  {product.category || "Fashion"}
                </span>
                {reviewsSummary && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-softblack/60">
                    <div className="flex text-brand-green">
                      {"★".repeat(Math.round(reviewsSummary.rating))}
                      {"☆".repeat(5 - Math.round(reviewsSummary.rating))}
                    </div>
                    <span>({reviewsSummary.reviews} ulasan)</span>
                  </div>
                )}
              </div>
              
              <TextReveal
                text={product.name}
                el="h1"
                className="text-4xl md:text-5xl font-light uppercase tracking-tighter text-brand-softblack"
                delay={0}
                duration={0.6}
              />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-medium text-brand-softblack">
                    {formatPrice(selectedVariant?.price ?? product.price)}
                  </span>
                  {(selectedVariant?.oldPrice ?? product.oldPrice) && (
                    <span className="text-lg text-brand-softblack/30 line-through font-light">
                      {formatPrice(selectedVariant?.oldPrice ?? product.oldPrice)}
                    </span>
                  )}
                  {((selectedVariant?.oldPrice ?? product.oldPrice) || 0) > (selectedVariant?.price ?? product.price) && (
                    <span className="ml-1 bg-brand-softblack text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                      Hemat {Math.round((((selectedVariant?.oldPrice ?? product.oldPrice ?? 0) - (selectedVariant?.price ?? product.price)) / (selectedVariant?.oldPrice ?? product.oldPrice ?? 1)) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-brand-softblack/70 text-sm md:text-base font-light leading-relaxed max-w-lg">
                  {product.description}
                </p>
                <div className="flex items-center justify-start">
                  <ShareButton title={product.name} />
                </div>
              </div>
            </div>

            <CheckoutBenefitsBar />

            <div className="space-y-4 p-6 bg-white shadow-sm border border-stone-100 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl -z-0 pointer-events-none" />

              <div className="bg-brand-champagne/20 border border-brand-gold/20 p-3 rounded-sm relative z-10">
                <p className="text-[9px] uppercase tracking-widest text-brand-softblack font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
                  Promo Eksklusif: Diskon 5% Pembayaran QRIS/Transfer
                </p>
              </div>

              {/* Color Selection */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <div className="space-y-4 py-4 border-y border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack">
                      Warna: <span className="text-brand-softblack/50 ml-1">{selectedVariant?.name || selectedVariant?.color}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colorVariants.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 relative ${
                          selectedVariant?.color === variant.color
                            ? "border-brand-green scale-110 shadow-md"
                            : "border-transparent hover:border-brand-green/30"
                        }`}
                        aria-label={`Pilih warna ${variant.name || variant.color}`}
                        style={{ backgroundColor: variant.color }}
                      >
                        {selectedVariant?.color === variant.color && (
                          <motion.div
                            layoutId="color-ring"
                            className="absolute -inset-[3px] rounded-full border border-brand-green"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2 relative z-10">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className={`glimmer-hover w-full py-4 md:py-[22px] uppercase tracking-[0.25em] text-[11px] font-semibold rounded-sm transition-all shadow-md disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none flex items-center justify-center gap-2 ${
                    isAdding 
                    ? "bg-brand-softblack text-white" 
                    : "bg-brand-green text-white hover:bg-brand-softblack"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Berhasil Ditambah
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {isOutOfStock ? "Sudah Habis" : "Tambah ke Keranjang"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full border border-stone-200 text-brand-softblack py-4 uppercase tracking-[0.25em] text-[10px] font-semibold rounded-sm hover:border-brand-softblack hover:bg-brand-softblack/[0.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOutOfStock ? "Beritahu Saat Tersedia" : "Beli Sekarang"}
                </button>
              </div>
            </div>

            <ProductTrustSeals />
            <ProductShippingCalculator productId={product.id} productPrice={product.price} />
          </div>
        </div>

        <div className="mt-20 md:mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light uppercase tracking-widest text-brand-softblack border-b border-stone-200 pb-4">
                Informasi Produk
              </h3>
              <ProductAccordion items={accordionItems} />
            </div>
            
            <ProductValueProposition product={product} />
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-light uppercase tracking-widest text-brand-softblack border-b border-stone-200 pb-4">
              Keunggulan Kami
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {keyHighlights.map((item: HighlightItem, idx: number) => (
                <div key={idx} className="p-5 bg-brand-champagne/10 border border-brand-gold/10 rounded-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300">
                  <h4 className="text-[10px] font-bold text-brand-green uppercase tracking-[0.2em] mb-2">{item.name}</h4>
                  <p className="text-xs text-brand-softblack/70 leading-relaxed font-light">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 md:mt-40 border-t border-stone-200 pt-20">
          <ProductReviews productId={product.id} />
        </div>

        <CompleteTheLook products={recommendedProducts} currentProductName={product.name} />
      </main>

      <StickyBar productName={product.name} onAddToCart={handleAddToCart} isOutOfStock={isOutOfStock} />
      <SizeHelper isOpen={showSizeHelper} onClose={() => setShowSizeHelper(false)} productName={product.name} />
      <WaitlistModal isOpen={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} productName={product.name} productId={product.id} />
    </div>
  );
}

