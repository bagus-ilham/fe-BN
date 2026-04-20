"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  },
  heroSlides: [
    {
      id: 1,
      image: "https://thenblank.com/cdn/shop/files/New_Release_Overlock_Anytime_Long_Tee_-_Desktop_Banner.jpg?v=1776225160",
      title: "Overlock Anytime",
      subtitle: "New Collection 2.0",
      cta: "Explore Now",
      link: "/collections"
    },
    {
      id: 2,
      image: "https://thenblank.com/cdn/shop/files/THENBLANK___UI_-_Desktop_Banner.jpg?v=1774286441",
      title: "Thenblank x UI",
      subtitle: "Limited Collaboration",
      cta: "Shop The Collaboration",
      link: "/collections"
    },
    {
      id: 3,
      image: "https://thenblank.com/cdn/shop/files/Sleeveless_Shirt_-_Desktop_Banner_1950x.jpg?v=1775213988",
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
      image: "https://thenblank.com/cdn/shop/files/New_Release_Overlock_Anytime_Long_Tee_-_Desktop_Banner.jpg?v=1776225160",
      link: "/collections/new-in",
      ctaText: "Belanja Produk Baru"
    },
    {
      id: "essentials",
      title: "Anytime Essentials",
      subtitle: "Wardrobe Staples",
      image: "https://thenblank.com/cdn/shop/files/Sleeveless_Shirt_-_Desktop_Banner_1950x.jpg?v=1775213988",
      link: "/collections/tops",
      ctaText: "Lihat Semua Atasan",
      reverse: true
    },
    {
      id: "bundles",
      title: "The Complete Edit",
      subtitle: "Curated Bundles",
      image: "https://thenblank.com/cdn/shop/files/THENBLANK___UI_-_Desktop_Banner.jpg?v=1774286441",
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
