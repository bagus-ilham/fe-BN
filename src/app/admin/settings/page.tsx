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
import { saveSiteSettings } from "@/lib/cms-service";
import { useEffect } from "react";

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

  useEffect(() => {
    setSettings({
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
  }, [globalSettings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        store_name: settings.store_name,
        marquee_text: settings.marquee_text.split(" • "),
        free_shipping_threshold: settings.free_shipping_threshold,
        primary_promo_code: settings.primary_promo_code,
        brand_stats: settings.stats,
        contact_info: settings.contact,
        social_links: settings.social,
        hero_slides: settings.hero_slides,
        homepage_banners: settings.banners,
        product_detail_settings: settings.product_policies,
        navigation: globalSettings.navigation
      };

      await saveSiteSettings(payload);

      updateSettings({
        storeName: settings.store_name,
        marqueeText: payload.marquee_text,
        freeShippingThreshold: settings.free_shipping_threshold,
        primaryPromoCode: settings.primary_promo_code,
        brandStats: settings.stats,
        contactInfo: settings.contact,
        socialLinks: settings.social,
        heroSlides: settings.hero_slides,
        homepageBanners: settings.banners,
        productDetailSettings: settings.product_policies
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan ke database.");
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Site Configuration</p>
          <h2 className="text-xl font-light text-brand-softblack">Pengaturan Situs</h2>
          <p className="text-[11px] text-brand-softblack/40">Manajemen menyeluruh identitas dan konten benangbaju</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="group inline-flex items-center gap-2 bg-brand-softblack text-white px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-softblack/20 disabled:opacity-50 self-start"
        >
          {loading ? <Loader2 className="animate-spin" size={13} /> : <Save size={13} />}
          {loading ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] mb-5 flex items-center overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-6 text-[9px] uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? "border-brand-gold text-brand-softblack" : "border-transparent text-brand-softblack/30 hover:text-brand-softblack/60"
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl text-emerald-600 text-[10px] uppercase tracking-widest font-semibold text-center flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Konfigurasi situs berhasil diperbarui.
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-5">
        
        {/* TAB: GENERAL */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
                  <Globe size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Identitas Dasar</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 text-brand-softblack/40 font-medium">Nama Toko</label>
                    <input 
                      type="text" value={settings.store_name}
                      onChange={(e) => setSettings({...settings, store_name: e.target.value})}
                      className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-sm text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 text-brand-softblack/40 font-medium">Marquee Promo Text</label>
                    <textarea 
                      rows={3} value={settings.marquee_text}
                      onChange={(e) => setSettings({...settings, marquee_text: e.target.value})}
                      className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs font-light text-brand-softblack focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                    />
                    <p className="text-[8px] text-brand-softblack/30 mt-2 uppercase tracking-widest">Gunakan • sebagai pemisah</p>
                  </div>
                </div>
              </div>

              {/* Taxonomy (Categories & Collections) */}
              <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Pengaturan Taksonomi</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/50 font-medium">Daftar Kategori Produk</label>
                    <input 
                      type="text" value={settings.categories.join(", ")}
                      onChange={(e) => setSettings({...settings, categories: e.target.value.split(",").map(c => c.trim()).filter(Boolean)})}
                      className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                      placeholder="misal: Atasan, Bawahan, Dress"
                    />
                    <p className="text-[8px] uppercase tracking-widest text-brand-softblack/30">Pisahkan dengan koma</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/50 font-medium">Daftar Koleksi (Collections)</label>
                    <input 
                      type="text" value={settings.collections.join(", ")}
                      onChange={(e) => setSettings({...settings, collections: e.target.value.split(",").map(c => c.trim()).filter(Boolean)})}
                      className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                      placeholder="misal: Summer 2025, Essentials"
                    />
                    <p className="text-[8px] uppercase tracking-widest text-brand-softblack/30">Pisahkan dengan koma</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
                  <BarChart3 size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Statistik Brand</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Pelanggan</label>
                      <input type="text" value={settings.stats.customers} onChange={(e) => setSettings({...settings, stats: {...settings.stats, customers: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs font-bold outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                   </div>
                   <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Ulasan</label>
                      <input type="text" value={settings.stats.reviews} onChange={(e) => setSettings({...settings, stats: {...settings.stats, reviews: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs font-bold outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                   </div>
                   <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Terjual</label>
                      <input type="text" value={settings.stats.itemsSold} onChange={(e) => setSettings({...settings, stats: {...settings.stats, itemsSold: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs font-bold outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
                  <Mail size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Kontak & Sosial</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">WhatsApp</label>
                      <input type="text" value={settings.contact.whatsapp} onChange={(e) => setSettings({...settings, contact: {...settings.contact, whatsapp: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Email</label>
                      <input type="text" value={settings.contact.email} onChange={(e) => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Alamat Kantor</label>
                    <textarea rows={2} value={settings.contact.address} onChange={(e) => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-50">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">Instagram URL</label>
                      <input type="text" value={settings.social.instagram} onChange={(e) => setSettings({...settings, social: {...settings.social, instagram: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest opacity-40 mb-1 block">TikTok URL</label>
                      <input type="text" value={settings.social.tiktok} onChange={(e) => setSettings({...settings, social: {...settings.social, tiktok: e.target.value}})} className="w-full bg-[#F4F2EF] rounded-lg px-3 py-2 text-xs outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/30 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HOMEPAGE */}
        {activeTab === "homepage" && (
          <div className="space-y-5">
            {/* Hero Slides */}
            <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
              <div className="flex items-center justify-between mb-8 border-b border-stone-50 pb-4">
                <div className="flex items-center gap-3">
                  <ImageIcon size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Hero Slides Management</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {settings.hero_slides.map((slide, idx) => (
                  <div key={slide.id} className="p-5 bg-[#F4F2EF] rounded-2xl space-y-3">
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
                <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Promo Banners</h3>
              </div>
              <div className="space-y-6">
                {settings.banners.map((banner, idx) => (
                  <div key={banner.id} className="flex flex-col md:flex-row gap-6 p-6 border border-stone-100 rounded-sm">
                    <div className="w-full md:w-44 aspect-[4/3] relative bg-brand-softblack/5 rounded-xl overflow-hidden shrink-0">
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
          <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7 max-w-4xl">
            <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
              <ShieldCheck size={16} className="text-brand-green" strokeWidth={1.5} />
              <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Product & Store Policies</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] block mb-3 text-brand-softblack/40 font-bold">Shipping Policy Summary</label>
                  <textarea 
                    rows={5} value={settings.product_policies.shippingPolicy}
                    onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, shippingPolicy: e.target.value}})}
                    className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs leading-relaxed outline-none focus:ring-1 focus:ring-brand-gold/40 border border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] block mb-3 text-brand-softblack/40 font-bold">Return Policy Summary</label>
                  <textarea 
                    rows={5} value={settings.product_policies.returnPolicy}
                    onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, returnPolicy: e.target.value}})}
                    className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs leading-relaxed outline-none focus:ring-1 focus:ring-brand-gold/40 border border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-3 text-brand-softblack/40 font-bold">Default Care Instructions</label>
                <textarea 
                  rows={3} value={settings.product_policies.defaultCareInstructions}
                  onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, defaultCareInstructions: e.target.value}})}
                  className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs leading-relaxed outline-none focus:ring-1 focus:ring-brand-gold/40 border border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 text-brand-softblack/40 font-bold">Size Guide Image URL</label>
                <input 
                  type="text" value={settings.product_policies.sizeGuideUrl}
                  onChange={(e) => setSettings({...settings, product_policies: {...settings.product_policies, sizeGuideUrl: e.target.value}})}
                  className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-gold/40 border border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: OPERATIONAL */}
        {activeTab === "operational" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
                  <Truck size={18} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Pengiriman</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-4 opacity-50">Batas Gratis Ongkir (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-xs">Rp</span>
                      <input 
                        type="number" value={settings.free_shipping_threshold}
                        onChange={(e) => setSettings({...settings, free_shipping_threshold: Number(e.target.value)})}
                        className="w-full bg-[#F4F2EF] rounded-xl p-4 pl-10 text-xl font-light tabular-nums outline-none border border-transparent focus:ring-1 focus:ring-brand-gold/40 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] block mb-2 opacity-50">Kupon Utama</label>
                    <input 
                      type="text" value={settings.primary_promo_code}
                      onChange={(e) => setSettings({...settings, primary_promo_code: e.target.value.toUpperCase()})}
                      className="w-full bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-3 text-sm font-bold tracking-widest text-brand-green outline-none uppercase focus:ring-1 focus:ring-emerald-300 transition-all"
                    />
                  </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                <div className="flex items-center gap-3 mb-6 border-b border-brand-softblack/[0.05] pb-4">
                  <Tag size={16} className="text-brand-green" strokeWidth={1.5} />
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-softblack/60">Kategori Aktif</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {settings.categories.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F2EF] text-[9px] uppercase tracking-widest font-semibold text-brand-softblack/60 rounded-full border border-brand-softblack/[0.06]">
                        {cat}
                        <X size={9} className="text-brand-softblack/25 cursor-pointer hover:text-red-500 transition-colors" />
                      </span>
                    ))}
                </div>
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200/60 rounded-xl text-[9px] uppercase tracking-widest text-amber-600 leading-relaxed font-semibold">
                  Sistem akan otomatis menggunakan kategori ini untuk filter di halaman Koleksi.
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
