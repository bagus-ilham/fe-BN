"use client";

import { useState } from "react";
import { 
  Settings, 
  Tag, 
  Truck, 
  Layout, 
  BarChart3, 
  Save, 
  Plus, 
  X,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Image as ImageIcon,
  ShieldCheck,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function AdminSettingsPage() {
  const { settings: globalSettings, updateSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Local state for form buffer
  const [settings, setSettings] = useState({
    store_name: globalSettings.storeName,
    marquee_text: globalSettings.marqueeText.join(" • "),
    free_shipping_threshold: globalSettings.freeShippingThreshold,
    primary_promo_code: globalSettings.primaryPromoCode,
    categories: globalSettings.categories || [],
    collections: globalSettings.collections || [],
    stats: globalSettings.brandStats,
    contact: globalSettings.contactInfo,
    social: globalSettings.socialLinks,
    hero_slides: globalSettings.heroSlides,
    banners: globalSettings.homepageBanners,
    product_policies: globalSettings.productDetailSettings
  });

  const [activeTab, setActiveTab] = useState("general");
  const [newCategory, setNewCategory] = useState("");

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      updateSettings({
        storeName: settings.store_name,
        marqueeText: settings.marquee_text.split(" • "),
        freeShippingThreshold: settings.free_shipping_threshold,
        primaryPromoCode: settings.primary_promo_code,
        categories: settings.categories,
        collections: settings.collections,
        brandStats: settings.stats,
        contactInfo: settings.contact,
        socialLinks: settings.social,
        heroSlides: settings.hero_slides,
        homepageBanners: settings.banners,
        productDetailSettings: settings.product_policies
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  const updateHeroSlide = (index: number, field: string, value: string) => {
    const newSlides = [...settings.hero_slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSettings({ ...settings, hero_slides: newSlides });
  };

  const updateBanner = (index: number, field: string, value: any) => {
    const newBanners = [...settings.banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setSettings({ ...settings, banners: newBanners });
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Globe },
    { id: "homepage", label: "Homepage", icon: Layout },
    { id: "policies", label: "Kebijakan", icon: ShieldCheck },
    { id: "operational", label: "Operasional", icon: Truck },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-extralight uppercase tracking-tight text-brand-softblack">
            Pengaturan Situs
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40 mt-1">
            Manajemen menyeluruh identitas dan konten benangbaju
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-softblack text-brand-offwhite px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-brand-green transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {loading ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-10 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2
              ${activeTab === tab.id ? "border-brand-green text-brand-green bg-brand-green/5" : "border-transparent text-brand-softblack/40 hover:text-brand-softblack hover:bg-stone-50"}
            `}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] uppercase tracking-widest font-bold text-center"
        >
          ✅ Konfigurasi situs berhasil diperbarui.
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-10">
        
        {/* TAB: GENERAL */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                  <Globe size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Identitas Dasar</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 text-brand-softblack/40 font-medium">Nama Toko</label>
                    <input 
                      type="text" value={settings.store_name}
                      onChange={(e) => setSettings({...settings, store_name: e.target.value})}
                      className="w-full bg-transparent border-b border-stone-100 py-3 text-sm text-brand-softblack font-light focus:border-brand-green outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 text-brand-softblack/40 font-medium">Marquee Promo Text</label>
                    <textarea 
                      rows={3} value={settings.marquee_text}
                      onChange={(e) => setSettings({...settings, marquee_text: e.target.value})}
                      className="w-full bg-brand-offwhite border border-stone-100 p-4 text-xs font-light text-brand-softblack focus:ring-1 focus:ring-brand-green outline-none"
                    />
                    <p className="text-[8px] text-brand-softblack/30 mt-2 uppercase tracking-widest">Gunakan • sebagai pemisah</p>
                  </div>
                </div>
              </div>

              {/* Taxonomy (Categories & Collections) */}
              <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Pengaturan Taksonomi</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/50 font-medium">Daftar Kategori Produk</label>
                    <input 
                      type="text" value={settings.categories.join(", ")}
                      onChange={(e) => setSettings({...settings, categories: e.target.value.split(",").map(c => c.trim()).filter(Boolean)})}
                      className="w-full bg-brand-offwhite border-none py-3 px-4 text-xs text-brand-softblack font-light focus:ring-1 focus:ring-brand-green outline-none"
                      placeholder="misal: Atasan, Bawahan, Dress"
                    />
                    <p className="text-[8px] uppercase tracking-widest text-brand-softblack/30">Pisahkan dengan koma</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/50 font-medium">Daftar Koleksi (Collections)</label>
                    <input 
                      type="text" value={settings.collections.join(", ")}
                      onChange={(e) => setSettings({...settings, collections: e.target.value.split(",").map(c => c.trim()).filter(Boolean)})}
                      className="w-full bg-brand-offwhite border-none py-3 px-4 text-xs text-brand-softblack font-light focus:ring-1 focus:ring-brand-green outline-none"
                      placeholder="misal: Summer 2025, Essentials"
                    />
                    <p className="text-[8px] uppercase tracking-widest text-brand-softblack/30">Pisahkan dengan koma</p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                  <BarChart3 size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Statistik Brand</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Pelanggan</label>
                      <input type="text" value={settings.stats.customers} onChange={(e) => setSettings({...settings, stats: {...settings.stats, customers: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs font-bold outline-none border-none" />
                   </div>
                   <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Ulasan</label>
                      <input type="text" value={settings.stats.reviews} onChange={(e) => setSettings({...settings, stats: {...settings.stats, reviews: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs font-bold outline-none border-none" />
                   </div>
                   <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Terjual</label>
                      <input type="text" value={settings.stats.itemsSold} onChange={(e) => setSettings({...settings, stats: {...settings.stats, itemsSold: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs font-bold outline-none border-none" />
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                  <Mail size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Kontak & Sosial</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">WhatsApp</label>
                      <input type="text" value={settings.contact.whatsapp} onChange={(e) => setSettings({...settings, contact: {...settings.contact, whatsapp: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs outline-none border-none" />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Email</label>
                      <input type="text" value={settings.contact.email} onChange={(e) => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs outline-none border-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Alamat Kantor</label>
                    <textarea rows={2} value={settings.contact.address} onChange={(e) => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs outline-none border-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-50">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Instagram URL</label>
                      <input type="text" value={settings.social.instagram} onChange={(e) => setSettings({...settings, social: {...settings.social, instagram: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs outline-none border-none" />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">TikTok URL</label>
                      <input type="text" value={settings.social.tiktok} onChange={(e) => setSettings({...settings, social: {...settings.social, tiktok: e.target.value}})} className="w-full bg-brand-offwhite px-3 py-2 text-xs outline-none border-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HOMEPAGE */}
        {activeTab === "homepage" && (
          <div className="space-y-10">
            {/* Hero Slides */}
            <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
              <div className="flex items-center justify-between mb-8 border-b border-stone-50 pb-4">
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Hero Slides Management</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {settings.hero_slides.map((slide, idx) => (
                  <div key={slide.id} className="p-5 border border-stone-100 bg-brand-offwhite/30 space-y-4">
                    <div className="relative aspect-video bg-stone-100 overflow-hidden">
                       <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                       <div className="absolute top-2 left-2 px-2 py-1 bg-brand-softblack text-white text-[8px] uppercase tracking-widest font-bold">Slide {idx+1}</div>
                    </div>
                    <input 
                      type="text" value={slide.title} placeholder="Title"
                      onChange={(e) => updateHeroSlide(idx, "title", e.target.value)}
                      className="w-full bg-transparent border-b border-stone-200 py-1 text-xs font-bold outline-none"
                    />
                    <input 
                      type="text" value={slide.subtitle} placeholder="Subtitle"
                      onChange={(e) => updateHeroSlide(idx, "subtitle", e.target.value)}
                      className="w-full bg-transparent border-b border-stone-100 py-1 text-[10px] outline-none"
                    />
                    <input 
                      type="text" value={slide.image} placeholder="Image URL"
                      onChange={(e) => updateHeroSlide(idx, "image", e.target.value)}
                      className="w-full bg-transparent border-b border-stone-100 py-1 text-[8px] opacity-40 outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" value={slide.cta} placeholder="Tombol CTA"
                        onChange={(e) => updateHeroSlide(idx, "cta", e.target.value)}
                        className="w-1/2 bg-transparent border-b border-stone-100 py-1 text-[9px] outline-none"
                      />
                      <input 
                        type="text" value={slide.link} placeholder="Link CTA"
                        onChange={(e) => updateHeroSlide(idx, "link", e.target.value)}
                        className="w-1/2 bg-transparent border-b border-stone-100 py-1 text-[9px] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Homepage Banners */}
            <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                <Layout size={18} className="text-brand-green" strokeWidth={1.5} />
                <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Promo Banners</h3>
              </div>
              <div className="space-y-6">
                {settings.banners.map((banner, idx) => (
                  <div key={banner.id} className="flex flex-col md:flex-row gap-6 p-6 border border-stone-100 rounded-sm">
                    <div className="w-full md:w-48 aspect-[4/3] relative bg-stone-100 shrink-0">
                      <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Judul Banner</label>
                        <input type="text" value={banner.title} onChange={(e) => updateBanner(idx, "title", e.target.value)} className="w-full bg-transparent border-b border-stone-200 py-1 text-xs font-bold outline-none" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Subtitle</label>
                        <input type="text" value={banner.subtitle} onChange={(e) => updateBanner(idx, "subtitle", e.target.value)} className="w-full bg-transparent border-b border-stone-200 py-1 text-xs outline-none" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Image URL</label>
                        <input type="text" value={banner.image} onChange={(e) => updateBanner(idx, "image", e.target.value)} className="w-full bg-transparent border-b border-stone-200 py-1 text-[9px] outline-none" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">CTA Label</label>
                        <input type="text" value={banner.ctaText} onChange={(e) => updateBanner(idx, "ctaText", e.target.value)} className="w-full bg-transparent border-b border-stone-200 py-1 text-[9px] outline-none" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">CTA Link</label>
                        <input type="text" value={banner.link} onChange={(e) => updateBanner(idx, "link", e.target.value)} className="w-full bg-transparent border-b border-stone-200 py-1 text-[9px] outline-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: POLICIES */}
        {activeTab === "policies" && (
          <div className="surface-card p-8 max-w-4xl bg-white border border-stone-100 rounded-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
              <ShieldCheck size={18} className="text-brand-green" strokeWidth={1.5} />
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Product & Store Policies</h3>
            </div>
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] block mb-3 text-brand-softblack/40 font-bold">Shipping Policy Summary</label>
                  <textarea 
                    rows={5} value={settings.product_policies.shippingPolicy}
                    onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, shippingPolicy: e.target.value}})}
                    className="w-full bg-brand-offwhite border border-stone-100 p-4 text-xs leading-relaxed outline-none focus:ring-1 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] block mb-3 text-brand-softblack/40 font-bold">Return Policy Summary</label>
                  <textarea 
                    rows={5} value={settings.product_policies.returnPolicy}
                    onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, returnPolicy: e.target.value}})}
                    className="w-full bg-brand-offwhite border border-stone-100 p-4 text-xs leading-relaxed outline-none focus:ring-1 focus:ring-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-3 text-brand-softblack/40 font-bold">Default Care Instructions</label>
                <textarea 
                  rows={3} value={settings.product_policies.defaultCareInstructions}
                  onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, defaultCareInstructions: e.target.value}})}
                  className="w-full bg-brand-offwhite border border-stone-100 p-4 text-xs leading-relaxed outline-none focus:ring-1 focus:ring-brand-green"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 text-brand-softblack/40 font-bold">Size Guide Image URL</label>
                <input 
                  type="text" value={settings.product_policies.sizeGuideUrl}
                  onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, sizeGuideUrl: e.target.value}})}
                  className="w-full bg-transparent border-b border-stone-200 py-3 text-xs outline-none focus:border-brand-green"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: OPERATIONAL */}
        {activeTab === "operational" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                  <Truck size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Pengiriman</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-4 opacity-50">Batas Gratis Ongkir (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-xs">Rp</span>
                      <input 
                        type="number" value={settings.free_shipping_threshold}
                        onChange={(e) => setSettings({...settings, free_shipping_threshold: Number(e.target.value)})}
                        className="w-full bg-brand-offwhite border border-stone-100 p-4 pl-10 text-xl font-light tabular-nums outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 opacity-50">Kupon Utama</label>
                    <input 
                      type="text" value={settings.primary_promo_code}
                      onChange={(e) => setSettings({...settings, primary_promo_code: e.target.value.toUpperCase()})}
                      className="w-full bg-brand-green/5 border border-brand-green/10 p-4 text-xs font-bold text-brand-green outline-none uppercase"
                    />
                  </div>
                </div>
             </div>

             <div className="surface-card p-8 bg-white border border-stone-100 rounded-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-stone-50 pb-4">
                  <Tag size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Kategori</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {settings.categories.map(cat => (
                      <span key={cat} className="px-3 py-1 bg-stone-50 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 border border-stone-100">
                        {cat}
                        <X size={10} className="text-stone-300 cursor-pointer hover:text-red-500" />
                      </span>
                    ))}
                </div>
                <p className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-sm text-[9px] uppercase tracking-widest text-amber-600 leading-relaxed font-bold">
                  Sistem akan otomatis menggunakan kategori ini untuk filter di halaman Koleksi.
                </p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
