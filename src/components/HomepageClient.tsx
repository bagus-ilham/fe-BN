"use client";

import { useMemo } from "react";
import HomeHero from "@/components/HomeHero";
import HomeProductsGrid from "@/components/HomeProductsGrid";
import CheckoutBenefitsBar from "@/components/CheckoutBenefitsBar";
import AboutSection from "@/components/AboutSection";
import ProductTestimonialsSection from "@/components/ProductTestimonialsSection";
import BrandStatsSection from "@/components/BrandStatsSection";
import CollectionBanner from "@/components/CollectionBanner";
import RunningCarousel from "@/components/ui/RunningCarousel";
import FlashSaleSection from "@/components/FlashSaleSection";
import { Product } from "@/constants/products";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface HomepageClientProps {
  products: Product[];
}

export default function HomepageClient({ products }: HomepageClientProps) {
  const { settings } = useSiteSettings();

  const newProducts = products.filter((p) => p.badge === "new").slice(0, 3);
  const bestSellerProducts = products.filter((p) => p.badge === "bestseller").slice(0, 3);
  const essentialsProducts = products.filter((p) => p.category === "Atasan").slice(0, 3);
  const bundlesProducts = products.filter((p) => p.badge === "kit").slice(0, 3);
  const saleProducts = products.filter((p) => p.oldPrice && p.oldPrice > p.price);
  const flashSaleEndDate = "2024-12-31T23:59:59Z";

  return (
    <main className="bg-brand-offwhite">
      {/* ── MAIN HERO ── */}
      <HomeHero />

      {/* ── FLASH SALE ── */}
      {saleProducts.length > 0 && (
        <FlashSaleSection products={saleProducts} endDate={flashSaleEndDate} />
      )}

      {/* ── MARQUEE ── */}
      <section className="py-2 md:py-3 bg-brand-softblack">
        <RunningCarousel items={settings.marqueeText} />
      </section>

      {/* ── DYNAMIC BANNERS ── */}
      {settings.homepageBanners.map((banner, idx) => (
        <section key={banner.id} className={`py-20 md:py-32 ${idx % 2 === 1 ? 'bg-white' : ''}`}>
          <CollectionBanner
            title={banner.title}
            subtitle={banner.subtitle}
            image={banner.image}
            link={banner.link}
            ctaText={banner.ctaText}
            reverse={banner.reverse}
          />
          <div className="max-w-7xl mx-auto px-4 md:px-10 mt-16 md:mt-24">
            <HomeProductsGrid 
              products={
                idx === 0 ? newProducts : 
                idx === 1 ? essentialsProducts : 
                bundlesProducts
              } 
            />
          </div>
        </section>
      ))}

      {/* ── BRAND STATS ── */}
      <BrandStatsSection />

      {/* ── TESTIMONIALS ── */}
      <ProductTestimonialsSection />

      {/* ── BENEFITS ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-16">
        <CheckoutBenefitsBar />
      </div>

      {/* ── ABOUT ── */}
      <AboutSection
        image={{
          src: "/images/products/linen-atasan.png",
          alt: "benangbaju craftsmanship — dedikasi terhadap kualitas fashion",
        }}
      />
    </main>
  );
}
