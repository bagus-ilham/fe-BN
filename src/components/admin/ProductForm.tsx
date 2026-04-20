"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  X, 
  Plus, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Image as ImageIcon, 
  Palette, 
  Layout, 
  FileText,
  Trash2,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ProductDB } from "@/types/database";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface ProductFormProps {
  initialData?: Partial<ProductDB>;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<"info" | "visuals" | "variants" | "content">("info");
  
  // Form State
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    tagline: initialData?.tagline || "",
    price: initialData?.price || 0,
    old_price: initialData?.old_price || 0,
    category: initialData?.category || "Atasan",
    collection: initialData?.collection || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    image_url: initialData?.image_url || "",
    badge: initialData?.badge || null,
    is_active: initialData?.is_active ?? true,
    sizes: ["S", "M", "L", "XL"], // Default mock sizes
    color_variants: initialData?.color_variants || [],
    additional_images: initialData?.additional_images || [],
    size_guide: "", // Panduan Ukuran
    care_instructions: "", // Instruksi Perawatan
    key_highlights: initialData?.key_highlights || [
      { name: "Eco-Friendly", detail: "Menggunakan pewarna alami" },
      { name: "Handmade", detail: "Dikerjakan oleh pengrajin lokal" }
    ],
    stock_quantity: 100,
  });

  const [uploading, setUploading] = useState(false);
  
  // NEW: Variant Helpers
  const addVariant = () => {
    const newVariant = { color: "#000000", name: "Warna Baru", price: formData.price, old_price: formData.old_price };
    setFormData({ ...formData, color_variants: [...formData.color_variants, newVariant] });
  };

  const removeVariant = (index: number) => {
    const newVariants = [...formData.color_variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, color_variants: newVariants });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.color_variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, color_variants: newVariants });
  };

  // Accordion Helpers removed since we use explicit Size Guide & Care Instructions

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate image upload delay
    await new Promise(r => setTimeout(r, 1500));
    setUploading(false);

    // Use a placeholder or a mock URL (for demo we just use a valid local path if available, or stay with what we have)
    // Actually, just keep the same image or use a base64 for demo
    setFormData({ ...formData, image_url: "/images/products/batik-dress.png" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate database save delay
    await new Promise(r => setTimeout(r, 1200));

    try {
      console.log("Mock: Saving product", formData);
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError("Gagal menyimpan produk (Simulasi).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Form */}
      <div className="flex items-center justify-between mb-12">
        <Link 
          href="/admin/products"
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-brand-softblack/40 hover:text-brand-green transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Daftar
        </Link>
        <h2 className="text-2xl font-extralight uppercase tracking-widest text-brand-softblack">
          {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-brand-softblack/10 mb-10 overflow-x-auto no-scrollbar">
        {[
          { id: "info", label: "Informasi Utama", icon: FileText },
          { id: "visuals", label: "Media & Galeri", icon: ImageIcon },
          { id: "variants", label: "Warna & Varian", icon: Palette },
          { id: "content", label: "Konten Detail", icon: Layout },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 text-[10px] uppercase tracking-[0.2em] font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-brand-green text-brand-softblack"
                  : "border-transparent text-brand-softblack/30 hover:text-brand-softblack/60"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest italic">
                {error}
              </div>
            )}

            {/* TAB: INFO */}
            {activeTab === "info" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-brand-softblack">
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Nama Produk</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors"
                      placeholder="misal: Atasan Linen Modern"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors appearance-none"
                    >
                      {settings.categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Koleksi</label>
                    <select 
                      value={formData.collection}
                      onChange={(e) => setFormData({...formData, collection: e.target.value})}
                      className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors appearance-none"
                    >
                      <option value="">-- Tanpa Koleksi --</option>
                      {settings.collections.map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Tagline</label>
                    <input 
                      type="text" value={formData.tagline}
                      onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                      className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors"
                      placeholder="misal: Bahan Linen Premium Impor"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Harga Dasar (Rp)</label>
                    <input 
                      type="number" required value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Harga Coret (Rp)</label>
                    <input 
                      type="number" value={formData.old_price}
                      onChange={(e) => setFormData({...formData, old_price: Number(e.target.value)})}
                      className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors placeholder:opacity-30"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Deskripsi Singkat (Tampil di Bawah Judul & Card)</label>
                    <textarea 
                      rows={2} value={formData.short_description}
                      onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                      className="w-full bg-brand-offwhite border-none p-4 text-brand-softblack font-light focus:ring-1 focus:ring-brand-green outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Deskripsi Lengkap / Detail Produk & Bahan</label>
                    <textarea 
                      rows={6} required value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-brand-offwhite border-none p-4 text-brand-softblack font-light focus:ring-1 focus:ring-brand-green outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: VISUALS */}
            {activeTab === "visuals" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/50 font-medium italic">Gambar Utama</label>
                    <div className="aspect-[3/4] w-full bg-brand-offwhite border border-dashed border-brand-softblack/10 relative group overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {formData.image_url ? (
                        <Image src={formData.image_url} alt="Main" fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-softblack/20">
                          <Upload size={32} strokeWidth={1} />
                          <span className="text-[10px] mt-2 tracking-widest">PILIH FOTO</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/50 font-medium italic">Galeri Tambahan</label>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.additional_images.map((img, idx) => (
                        <div key={idx} className="aspect-[3/4] relative group bg-brand-offwhite border border-brand-softblack/5 rounded-sm overflow-hidden">
                          <Image src={img} alt="Gallery" fill className="object-cover" />
                          <button 
                            type="button" 
                            onClick={() => {
                              const newImages = [...formData.additional_images];
                              newImages.splice(idx, 1);
                              setFormData({...formData, additional_images: newImages});
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button"
                        className="aspect-[3/4] flex flex-col items-center justify-center border border-dashed border-brand-softblack/10 text-brand-softblack/20 hover:text-brand-green transition-colors"
                      >
                        <Plus size={24} strokeWidth={1} />
                        <span className="text-[8px] uppercase tracking-[0.2em] mt-2">Tambah Foto</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: VARIANTS */}
            {activeTab === "variants" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-softblack">Pengaturan Varian Produk</h4>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.25em] block text-brand-softblack/40 font-medium">Ukuran Tersedia (Sizes)</label>
                  <input 
                    type="text" value={formData.sizes.join(", ")}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
                    className="w-full bg-transparent border-b border-brand-softblack/10 py-3 text-brand-softblack font-light focus:border-brand-green outline-none transition-colors"
                    placeholder="misal: S, M, L, XL"
                  />
                  <p className="text-[8px] uppercase tracking-widest text-brand-softblack/30">Pisahkan dengan koma</p>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-softblack">Daftar Varian Warna</h4>
                  <button 
                    type="button" onClick={addVariant}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-green hover:underline"
                  >
                    <Plus size={14} /> Tambah Varian Warna
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.color_variants.map((variant: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white border border-stone-100 rounded-sm flex flex-col md:flex-row gap-6 items-start md:items-center group">
                      <div className="flex items-center gap-4 shrink-0">
                        <input 
                          type="color" value={variant.color}
                          onChange={(e) => updateVariant(idx, "color", e.target.value)}
                          className="w-10 h-10 rounded-full border-none p-0 bg-transparent cursor-pointer"
                        />
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest opacity-40">Nama Warna</label>
                          <input 
                            type="text" value={variant.name}
                            onChange={(e) => updateVariant(idx, "name", e.target.value)}
                            className="bg-transparent border-b border-stone-100 text-xs w-28 focus:border-brand-green outline-none py-1"
                          />
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest opacity-40">Harga Override (Optional)</label>
                          <input 
                            type="number" value={variant.price || ""}
                            onChange={(e) => updateVariant(idx, "price", Number(e.target.value))}
                            className="bg-transparent border-b border-stone-100 text-xs w-full focus:border-brand-green outline-none py-1 tabular-nums"
                            placeholder={formData.price.toString()}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest opacity-40">Harga Coret Variant</label>
                          <input 
                            type="number" value={variant.old_price || ""}
                            onChange={(e) => updateVariant(idx, "old_price", Number(e.target.value))}
                            className="bg-transparent border-b border-stone-100 text-xs w-full focus:border-brand-green outline-none py-1 tabular-nums"
                            placeholder={formData.old_price.toString()}
                          />
                        </div>
                      </div>

                      <button type="button" onClick={() => removeVariant(idx)} className="text-stone-300 hover:text-red-500 transition-colors self-end md:self-center">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: CONTENT (ACCORDION) */}
            {activeTab === "content" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-softblack">Informasi Produk Spesifik</h4>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Panduan Ukuran (Size Guide)</label>
                      <textarea 
                        rows={4} value={formData.size_guide}
                        onChange={(e) => setFormData({...formData, size_guide: e.target.value})}
                        className="w-full bg-brand-offwhite border-none p-4 text-brand-softblack font-light focus:ring-1 focus:ring-brand-green outline-none transition-all text-sm font-mono"
                        placeholder="Lingkar Dada: 100cm&#10;Panjang Baju: 70cm"
                      />
                      <p className="text-[8px] mt-2 uppercase tracking-widest text-brand-softblack/30">Ini akan muncul di tab &apos;Panduan Ukuran&apos; pada halaman produk.</p>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Instruksi Perawatan</label>
                      <textarea 
                        rows={4} value={formData.care_instructions}
                        onChange={(e) => setFormData({...formData, care_instructions: e.target.value})}
                        className="w-full bg-brand-offwhite border-none p-4 text-brand-softblack font-light focus:ring-1 focus:ring-brand-green outline-none transition-all text-sm"
                        placeholder="Cuci dengan air dingin. Jangan gunakan pemutih."
                      />
                      <p className="text-[8px] mt-2 uppercase tracking-widest text-brand-softblack/30">Akan menimpa instruksi perawatan default (opsional).</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-brand-softblack/5 space-y-6">
                   <h4 className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-softblack">Key Highlights (Badge USP)</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.key_highlights.map((h: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white border border-stone-100 rounded-sm space-y-2">
                           <input 
                              type="text" value={h.name}
                              onChange={(e) => {
                                const newH = [...formData.key_highlights];
                                newH[idx].name = e.target.value;
                                setFormData({...formData, key_highlights: newH});
                              }}
                              className="w-full bg-transparent border-b border-stone-100 text-[10px] font-bold uppercase tracking-widest text-brand-green py-1 outline-none focus:border-brand-green"
                           />
                           <input 
                              type="text" value={h.detail}
                              onChange={(e) => {
                                const newH = [...formData.key_highlights];
                                newH[idx].detail = e.target.value;
                                setFormData({...formData, key_highlights: newH});
                              }}
                              className="w-full bg-transparent text-xs font-light text-brand-softblack/60 outline-none"
                           />
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area: Settings & Publish */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-brand-softblack text-brand-offwhite rounded-sm space-y-8">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-light border-b border-white/10 pb-5">Publishing</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-light opacity-50">Active Status</span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${formData.is_active ? 'bg-brand-green' : 'bg-white/10 shadow-inner'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.is_active ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-[10px] uppercase tracking-[0.3em] block opacity-40 font-medium italic flex items-center gap-2">
                  <Settings size={12} /> Label / Badge
                </label>
                <select 
                  value={formData.badge || ""} 
                  onChange={(e) => setFormData({...formData, badge: (e.target.value as any) || null})}
                  className="w-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest p-4 focus:ring-1 focus:ring-brand-green outline-none rounded-none cursor-pointer"
                >
                  <option value="">No Badge</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="new">New Arrival</option>
                  <option value="vegan">Ethical / Vegan</option>
                  <option value="kit">Bundle Kit</option>
                </select>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-brand-offwhite text-brand-softblack py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-green hover:text-white transition-all duration-700 flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
                <p className="mt-4 text-[9px] text-white/20 text-center uppercase tracking-widest italic">Perubahan akan langsung publik</p>
              </div>
            </div>

            {/* Help / Tip */}
            <div className="p-6 border border-brand-softblack/5 bg-white/50 text-brand-softblack/50 space-y-4">
               <h5 className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                 💡 Pro Tip
               </h5>
               <p className="text-[10px] leading-relaxed italic">
                 Varian warna dengan harga override akan otomatis mengganti harga utama saat pelanggan memilih warna tersebut di website.
               </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
