"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/cms-service";
import { listCategories, listCollections } from "@/lib/application/products/product-admin-service";
import { getPublicBrandStats } from "@/lib/dashboard-service";

interface SiteSettings {
  storeName: string;
  marqueeText: string[];
  freeShippingThreshold: number;
  primaryPromoCode: string;
  categories: string[];
  collections: string[];
  brandStats: {
    customers: string;
    reviews: string;
    itemsSold: string;
    avgRating: string;
  };
  heroSlides: Array<{
    id: number;
    image: string;
    title: string;
    subtitle: string;
    cta: string;
    link: string;
  }>;
  homepageBanners: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    ctaText: string;
    reverse?: boolean;
  }>;
  contactInfo: {
    whatsapp: string;
    email: string;
    address: string;
    mapLink: string;
  };
  socialLinks: {
    instagram: string;
    tiktok: string;
    facebook: string;
  };
  productDetailSettings: {
    shippingPolicy: string;
    returnPolicy: string;
    sizeGuideUrl: string;
    defaultCareInstructions: string;
  };
  navigation: {
    main: Array<{
      label: string;
      href: string;
      megaMenu?: Array<{
        title: string;
        items: Array<{ label: string; href: string }>;
      }>;
    }>;
    footer: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
  };
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "benangbaju",
  marqueeText: [
    "Dapatkan Diskon 5% untuk Pembayaran QRIS / Transfer",
    "Koleksi Terbaru Batik Modern Telah Tersedia",
    "Gratis Ongkir Jabodetabek dengan kupon BENANG10",
  ],
  freeShippingThreshold: 500000,
  primaryPromoCode: "BENANG10",
  categories: ["Atasan", "Bawahan", "Dress", "Aksesoris", "Outerwear"],
  collections: ["Summer 2025", "Essentials", "Raya Edition"],
  brandStats: {
    customers: "10k+",
    reviews: "4.8k+",
    itemsSold: "25k+",
    avgRating: "4.9",
  },
  heroSlides: [
    {
      id: 1,
      image: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg",
      title: "Overlock Anytime",
      subtitle: "New Collection 2.0",
      cta: "Explore Now",
      link: "/collections"
    },
    {
      id: 2,
      image: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-2.jpg",
      title: "benangbaju x Style",
      subtitle: "Limited Collaboration",
      cta: "Shop The Collaboration",
      link: "/collections"
    },
    {
      id: 3,
      image: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg",
      title: "Modern Basics",
      subtitle: "Essential Sleeveless",
      cta: "View Collection",
      link: "/collections"
    }
  ],
  homepageBanners: [
    {
      id: "new-in",
      title: "New In: Overlock Anytime",
      subtitle: "Latest Release",
      image: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg",
      link: "/collections/new-in",
      ctaText: "Belanja Produk Baru"
    },
    {
      id: "essentials",
      title: "Anytime Essentials",
      subtitle: "Wardrobe Staples",
      image: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg",
      link: "/collections/tops",
      ctaText: "Lihat Semua Atasan",
      reverse: true
    },
    {
      id: "bundles",
      title: "The Complete Edit",
      subtitle: "Curated Bundles",
      image: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-2.jpg",
      link: "/collections/bundles",
      ctaText: "Hemat dengan Bundles"
    }
  ],
  contactInfo: {
    whatsapp: "6285001001234",
    email: "halo@benangbaju.com",
    address: "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12930",
    mapLink: "https://maps.google.com"
  },
  socialLinks: {
    instagram: "https://instagram.com/benangbaju",
    tiktok: "https://tiktok.com/@benangbaju",
    facebook: "https://facebook.com/benangbaju"
  },
  productDetailSettings: {
    shippingPolicy: "Pesanan diproses dalam 1-2 hari kerja. Pengiriman menggunakan JNE/J&T/SiCepat.",
    returnPolicy: "Pengembalian barang berlaku 7 hari setelah barang diterima. Barang harus dalam kondisi baru dengan tag lengkap.",
    sizeGuideUrl: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/size-guide.jpg",
    defaultCareInstructions: "Cuci dengan air dingin. Jangan gunakan pemutih. Setrika dengan suhu rendah."
  },
  navigation: {
    main: [
      { 
        label: "Shop", 
        href: "/collections",
        megaMenu: [
          {
            title: "Highlights",
            items: [
              { label: "Best Seller", href: "/collections/best-seller" },
              { label: "New In", href: "/collections/new-in" }
            ]
          },
          {
            title: "Category",
            items: [
              { label: "Tops", href: "/collections/tops" },
              { label: "Bottoms", href: "/collections/bottoms" },
              { label: "Dresses", href: "/collections/dresses" }
            ]
          }
        ]
      },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ],
    footer: [
      {
        title: "Menu",
        links: [
          { label: "Produk", href: "/collections" },
          { label: "Tentang Kami", href: "/about" },
          { label: "Kontak", href: "/contact" }
        ]
      },
      {
        title: "Bantuan",
        links: [
          { label: "Pengiriman", href: "/returns" },
          { label: "Layanan Pelanggan", href: "/contact" }
        ]
      }
    ]
  }
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSettings = async () => {
      try {
        const [dbSettings, dbCats, dbCols, dbStats] = await Promise.all([
          getSiteSettings(),
          listCategories(),
          listCollections(),
          getPublicBrandStats()
        ]);

        if (dbSettings) {
          setSettings(prev => ({
            ...prev,
            storeName: dbSettings.store_name || prev.storeName,
            marqueeText: Array.isArray(dbSettings.marquee_text)
              ? (dbSettings.marquee_text as SiteSettings["marqueeText"])
              : prev.marqueeText,
            freeShippingThreshold: dbSettings.free_shipping_threshold ? Number(dbSettings.free_shipping_threshold) : prev.freeShippingThreshold,
            primaryPromoCode: dbSettings.primary_promo_code || prev.primaryPromoCode,
            brandStats: {
              customers: dbStats.customers > 100 ? `${(dbStats.customers / 1000).toFixed(1)}k+` : `${dbStats.customers}+`,
              reviews: dbStats.reviews > 100 ? `${(dbStats.reviews / 1000).toFixed(1)}k+` : `${dbStats.reviews}+`,
              itemsSold: dbStats.itemsSold > 100 ? `${(dbStats.itemsSold / 1000).toFixed(1)}k+` : `${dbStats.itemsSold}+`,
              avgRating: dbStats.avgRating
            },
            heroSlides: Array.isArray(dbSettings.hero_slides)
              ? (dbSettings.hero_slides as SiteSettings["heroSlides"])
              : prev.heroSlides,
            homepageBanners: Array.isArray(dbSettings.homepage_banners)
              ? (dbSettings.homepage_banners as SiteSettings["homepageBanners"])
              : prev.homepageBanners,
            contactInfo:
              dbSettings.contact_info && typeof dbSettings.contact_info === "object"
                ? (dbSettings.contact_info as SiteSettings["contactInfo"])
                : prev.contactInfo,
            socialLinks:
              dbSettings.social_links && typeof dbSettings.social_links === "object"
                ? (dbSettings.social_links as SiteSettings["socialLinks"])
                : prev.socialLinks,
            productDetailSettings: prev.productDetailSettings,
            navigation:
              dbSettings.navigation && typeof dbSettings.navigation === "object"
                ? (dbSettings.navigation as SiteSettings["navigation"])
                : {
                    ...prev.navigation,
                    main: [
                      {
                        label: "Kategori",
                        href: "/collections",
                        megaMenu: [
                          {
                            title: "Pilih Kategori",
                            items: dbCats.map((c: any) => ({
                              label: c.name,
                              href: `/collections?category=${encodeURIComponent(c.name)}`,
                            })),
                          },
                        ],
                      },
                      {
                        label: "Koleksi",
                        href: "/collections",
                        megaMenu: [
                          {
                            title: "Koleksi Spesial",
                            items: dbCols.map((c: any) => ({
                              label: c.name,
                              href: `/collections?collection=${encodeURIComponent(c.name)}`,
                            })),
                          },
                        ],
                      },
                      {
                        label: "Favorit",
                        href: "/collections",
                        megaMenu: [
                          {
                            title: "Eksklusif",
                            items: [
                              { label: "New Arrivals", href: "/collections?badge=new" },
                              { label: "Best Sellers", href: "/collections?badge=bestseller" },
                              { label: "Kits & Bundles", href: "/collections?badge=kit" },
                            ],
                          },
                        ],
                      },
                      { label: "Tentang Kami", href: "/about" },
                    ],
                  },
            // Categories and Collections from their own tables
            categories: dbCats.length > 0 ? dbCats.map((c: any) => c.name) : prev.categories,
            collections: dbCols.length > 0 ? dbCols.map((c: any) => c.name) : prev.collections,
          }));
        } else {
          // If no settings in DB, still update categories/collections if they exist
          if (dbCats.length > 0 || dbCols.length > 0) {
            setSettings(prev => ({
              ...prev,
              categories: dbCats.length > 0 ? dbCats.map((c: any) => c.name) : prev.categories,
              collections: dbCols.length > 0 ? dbCols.map((c: any) => c.name) : prev.collections,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load site settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSettings();
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
