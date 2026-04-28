"use client";

import { useState, useEffect } from "react";
import { 
  Layout, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  Loader2,
  ExternalLink,
  Monitor,
  Layers,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { saveSiteSettings } from "@/lib/cms-service";
import Image from "next/image";

type CollectionRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  banner_url: string | null;
  is_active: boolean;
};

export default function HomepageManagerPage() {
  const { settings: globalSettings, updateSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState<"hero" | "banners" | "collections">("hero");

  const [heroSlides, setHeroSlides] = useState(globalSettings.heroSlides);
  const [banners, setBanners] = useState(globalSettings.homepageBanners);

  // Collections from DB
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  useEffect(() => {
    if (view === "collections") {
      fetchCollections();
    }
  }, [view]);

  const fetchCollections = async () => {
    setCollectionsLoading(true);
    try {
      const { listCollections } = await import("@/lib/application/products/product-admin-service");
      const data = await listCollections();
      setCollections(data as CollectionRow[]);
    } catch (err) {
      console.error("Gagal mengambil koleksi:", err);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSiteSettings({
        hero_slides: heroSlides as any,
        homepage_banners: banners as any,
      });
      updateSettings({
        heroSlides,
        homepageBanners: banners
      } as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Gagal menyimpan homepage layout:", err);
      alert("Gagal menyimpan ke database. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000",
      title: "New Collection Title",
      subtitle: "Collection Subtitle",
      cta: "Explore Now",
      link: "/collections"
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const removeSlide = (id: number) => {
    setHeroSlides(heroSlides.filter(s => s.id !== id));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSlides.length) {
      [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
      setHeroSlides(newSlides);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32">
       {/* Header */}
       <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-extralight uppercase tracking-tight text-brand-softblack">
            Home Layout Manager
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40 mt-1">
            Atur visual dan alur navigasi halaman utama benangbaju
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={loading || view === "collections"}
          className="bg-brand-softblack text-brand-offwhite px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-medium hover:bg-brand-green transition-all duration-500 flex items-center gap-3 disabled:opacity-50 shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {loading ? "Menyimpan..." : "Simpan Tata Letak"}
        </button>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] uppercase tracking-widest font-bold text-center"
        >
          ✅ Tampilan Beranda telah diperbarui.
        </motion.div>
      )}

      {/* View Switcher */}
      <div className="flex gap-1 mb-10 bg-brand-offwhite p-1 rounded-sm w-fit border border-stone-100">
        <button 
          onClick={() => setView("hero")}
          className={`px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${view === "hero" ? "bg-white text-brand-softblack shadow-sm" : "text-brand-softblack/40 hover:text-brand-softblack"}`}
        >
          <ImageIcon size={12} /> Hero Sliders
        </button>
        <button 
          onClick={() => setView("banners")}
          className={`px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${view === "banners" ? "bg-white text-brand-softblack shadow-sm" : "text-brand-softblack/40 hover:text-brand-softblack"}`}
        >
          <Layout size={12} /> Banners
        </button>
        <button 
          onClick={() => setView("collections")}
          className={`px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${view === "collections" ? "bg-white text-brand-softblack shadow-sm" : "text-brand-softblack/40 hover:text-brand-softblack"}`}
        >
          <Layers size={12} /> Collections
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === "hero" ? (
          <motion.div 
            key="hero-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Main Hero Carousel</h3>
              <button 
                onClick={addSlide}
                className="flex items-center gap-2 text-brand-green text-[9px] uppercase tracking-widest font-bold hover:opacity-70 transition-opacity"
              >
                <Plus size={14} /> Tambah Slide
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {heroSlides.map((slide, index) => (
                <div key={slide.id} className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full md:w-64 h-48 md:h-auto relative bg-brand-offwhite group">
                    {slide.image ? (
                      <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button className="p-2 bg-white rounded-full"><ImageIcon size={14} /></button>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Headline Title</label>
                        <input 
                          type="text" value={slide.title}
                          onChange={(e) => {
                            const newSlides = [...heroSlides];
                            newSlides[index].title = e.target.value;
                            setHeroSlides(newSlides);
                          }}
                          className="w-full bg-transparent border-b border-stone-100 py-2 text-sm font-medium focus:border-brand-green outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Subtitle / Category</label>
                        <input 
                          type="text" value={slide.subtitle}
                          onChange={(e) => {
                            const newSlides = [...heroSlides];
                            newSlides[index].subtitle = e.target.value;
                            setHeroSlides(newSlides);
                          }}
                          className="w-full bg-transparent border-b border-stone-100 py-2 text-xs font-light focus:border-brand-green outline-none tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">CTA Label</label>
                          <input 
                            type="text" value={slide.cta}
                            onChange={(e) => {
                              const newSlides = [...heroSlides];
                              newSlides[index].cta = e.target.value;
                              setHeroSlides(newSlides);
                            }}
                            className="w-full bg-transparent border-b border-stone-100 py-2 text-xs focus:border-brand-green outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Link URL</label>
                          <input 
                            type="text" value={slide.link}
                            onChange={(e) => {
                              const newSlides = [...heroSlides];
                              newSlides[index].link = e.target.value;
                              setHeroSlides(newSlides);
                            }}
                            className="w-full bg-transparent border-b border-stone-100 py-2 text-xs focus:border-brand-green outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Image URL</label>
                        <input 
                          type="text" value={slide.image}
                          onChange={(e) => {
                            const newSlides = [...heroSlides];
                            newSlides[index].image = e.target.value;
                            setHeroSlides(newSlides);
                          }}
                          className="w-full bg-transparent border-b border-stone-100 py-1 text-[10px] text-brand-green focus:border-brand-green outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-stone-50 md:w-16 flex md:flex-col items-center justify-center gap-2 p-4 border-t md:border-t-0 md:border-l border-stone-100">
                    <button 
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-stone-400 hover:text-brand-softblack disabled:opacity-20"
                    >
                      <MoveUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === heroSlides.length - 1}
                      className="p-2 text-stone-400 hover:text-brand-softblack disabled:opacity-20"
                    >
                      <MoveDown size={16} />
                    </button>
                    <div className="w-px h-4 md:h-px md:w-8 bg-stone-200" />
                    <button 
                      onClick={() => removeSlide(slide.id)}
                      className="p-2 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : view === "banners" ? (
          <motion.div 
            key="banners-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
             <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack mb-4">Collection Showcases</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {banners.map((banner, index) => (
                  <div key={banner.id} className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-softblack/30 tracking-widest uppercase">Banner #{index + 1}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] uppercase tracking-widest opacity-40">Layout:</span>
                           <button 
                            onClick={() => {
                              const newBans = [...banners];
                              newBans[index].reverse = !newBans[index].reverse;
                              setBanners(newBans);
                            }}
                            className={`p-1.5 border rounded-sm transition-all ${banner.reverse ? 'bg-brand-softblack text-white' : 'bg-white text-stone-400'}`}
                           >
                             <Monitor size={14} />
                           </button>
                        </div>
                     </div>

                     <div className="aspect-[16/7] relative bg-brand-offwhite rounded-sm overflow-hidden border border-stone-100">
                        {banner.image ? (
                          <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                     </div>

                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Title</label>
                              <input 
                                type="text" value={banner.title}
                                onChange={(e) => {
                                  const newBans = [...banners];
                                  newBans[index].title = e.target.value;
                                  setBanners(newBans);
                                }}
                                className="w-full bg-transparent border-b border-stone-100 py-1 text-xs font-medium focus:border-brand-green outline-none"
                              />
                           </div>
                           <div>
                              <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Label</label>
                              <input 
                                type="text" value={banner.subtitle}
                                onChange={(e) => {
                                  const newBans = [...banners];
                                  newBans[index].subtitle = e.target.value;
                                  setBanners(newBans);
                                }}
                                className="w-full bg-transparent border-b border-stone-100 py-1 text-xs font-light focus:border-brand-green outline-none"
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">CTA Text</label>
                              <input 
                                type="text" value={banner.ctaText}
                                onChange={(e) => {
                                  const newBans = [...banners];
                                  newBans[index].ctaText = e.target.value;
                                  setBanners(newBans);
                                }}
                                className="w-full bg-transparent border-b border-stone-100 py-1 text-xs focus:border-brand-green outline-none"
                              />
                           </div>
                           <div>
                              <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Link</label>
                              <input 
                                type="text" value={banner.link}
                                onChange={(e) => {
                                  const newBans = [...banners];
                                  newBans[index].link = e.target.value;
                                  setBanners(newBans);
                                }}
                                className="w-full bg-transparent border-b border-stone-100 py-1 text-xs focus:border-brand-green outline-none"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Image URL</label>
                           <input 
                              type="text" value={banner.image}
                              onChange={(e) => {
                                const newBans = [...banners];
                                newBans[index].image = e.target.value;
                                setBanners(newBans);
                              }}
                              className="w-full bg-transparent border-b border-stone-100 py-1 text-[10px] text-brand-green focus:border-brand-green outline-none font-mono"
                           />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        ) : (
          /* ─── COLLECTIONS TAB ─── */
          <motion.div
            key="collections-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-softblack">Daftar Koleksi Aktif</h3>
                <p className="text-[9px] uppercase tracking-widest text-brand-softblack/40 mt-1">Data langsung dari database — kelola di menu <strong>Koleksi</strong></p>
              </div>
              <button
                onClick={fetchCollections}
                disabled={collectionsLoading}
                className="flex items-center gap-2 text-brand-softblack/50 text-[9px] uppercase tracking-widest font-bold hover:text-brand-green transition-colors"
              >
                <RefreshCw size={13} className={collectionsLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {collectionsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-brand-softblack/30" />
              </div>
            ) : collections.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-200 rounded-sm p-16 text-center">
                <Layers size={32} className="mx-auto mb-3 text-stone-300" />
                <p className="text-sm font-light text-brand-softblack/40">Belum ada koleksi. Buat koleksi di menu <strong>Koleksi</strong>.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {collections.map((col) => (
                  <div key={col.id} className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden group">
                    <div className="aspect-video relative bg-brand-offwhite">
                      {col.image_url ? (
                        <Image src={col.image_url} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-200">
                          <Layers size={32} />
                        </div>
                      )}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-full ${col.is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-400 border border-red-200"}`}>
                        {col.is_active ? "Aktif" : "Nonaktif"}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[9px] uppercase tracking-widest text-brand-softblack/30 mb-1">ID: {col.id}</p>
                      <h4 className="text-sm font-medium text-brand-softblack">{col.name}</h4>
                      {col.description && (
                        <p className="text-[10px] text-brand-softblack/50 mt-1 line-clamp-2">{col.description}</p>
                      )}
                      <div className="mt-3 pt-3 border-t border-stone-50 flex gap-2">
                        <a
                          href={`/collections?collection=${encodeURIComponent(col.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-brand-green hover:opacity-70 transition-opacity"
                        >
                          <ExternalLink size={10} /> Lihat
                        </a>
                        <a
                          href="/admin/collections"
                          className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-brand-softblack/40 hover:text-brand-softblack transition-colors ml-auto"
                        >
                          Edit →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-20 p-8 bg-brand-offwhite border border-stone-100 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-full">
            <Layout size={24} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-softblack">Pratinjau Langsung</h4>
            <p className="text-[10px] text-brand-softblack/50 mt-0.5">Lihat hasil perubahan langsung di website utama Anda setelah menekan Simpan.</p>
          </div>
        </div>
        <button onClick={() => window.open('/', '_blank')} className="px-8 py-3 bg-white border border-stone-200 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-stone-50 transition-all">
          Buka Website <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
