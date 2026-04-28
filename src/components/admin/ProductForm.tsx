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
import { ProductRow } from "@/types/database";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { uploadFile, BUCKETS } from "@/utils/storage";
import { saveProductViaAdminApi as saveProduct } from "@/lib/clients/admin-products-client";
import { listCategories, listCollections } from "@/lib/application/products/product-admin-service";
import { useEffect } from "react";

interface ProductFormProps {
  initialData?: Partial<ProductRow> & {
    color_variants?: any[];
    additional_images?: string[];
  };
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"info" | "visuals" | "variants" | "content">("info");

  // Form State
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    tagline: initialData?.tagline || "",
    base_price: initialData?.base_price || 0,
    category_id: initialData?.category_id || "Atasan",
    collection_id: initialData?.collection_id || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    image_url: initialData?.image_url || "",
    badge: initialData?.badge || null,
    is_active: initialData?.is_active ?? true,
    sizes: (initialData as any)?.sizes || ["S", "M", "L", "XL"],
    color_variants: initialData?.color_variants || [],
    additional_images: initialData?.additional_images || [],
    size_guide: initialData?.size_guide || "", 
    care_instructions: initialData?.care_instructions || "", 
    material: (initialData as any)?.material || "",
    key_highlights: initialData?.key_highlights || [
      { name: "Eco-Friendly", detail: "Menggunakan pewarna alami" },
      { name: "Handmade", detail: "Dikerjakan oleh pengrajin lokal" }
    ],
    stock_quantity: 100,
  });

  const [uploading, setUploading] = useState(false);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbCollections, setDbCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, cols] = await Promise.all([listCategories(), listCollections()]);
        setDbCategories(cats);
        setDbCollections(cols);
        
        // If creating new product and we have categories, select the first one as default
        if (!isEditing && cats.length > 0) {
          setFormData((prev) => {
            if (prev.category_id !== "Atasan" && prev.category_id !== "") return prev;
            return { ...prev, category_id: cats[0].id };
          });
        }
      } catch (err) {
        console.error("Failed to fetch taxonomy:", err);
      }
    };
    fetchData();
  }, [isEditing]);

  // NEW: Variant Helpers
  const addVariant = () => {
    const newVariant = { color: "#000000", name: "Warna Baru", price: formData.base_price, old_price: 0 };
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
    const { url, error } = await uploadFile(file, BUCKETS.PRODUCTS, `products/${formData.id || 'new'}`);
    setUploading(false);

    if (error) {
      setError(error);
      return;
    }

    if (url) {
      setFormData({ ...formData, image_url: url });
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { url, error } = await uploadFile(file, BUCKETS.PRODUCTS, `products/${formData.id || 'new'}/gallery`);
    setUploading(false);

    if (error) {
      setError(error);
      return;
    }

    if (url) {
      setFormData({ 
        ...formData, 
        additional_images: [...formData.additional_images, url] 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Exclude fields that are not columns in the 'products' table
      const { 
        color_variants, 
        additional_images, 
        sizes, 
        stock_quantity, 
        ...productBase 
      } = formData;
      
      await saveProduct(productBase, color_variants, additional_images);
      
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Form */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 flex items-center justify-between mb-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-brand-softblack/40 hover:text-brand-green transition-colors"
        >
          <ArrowLeft size={13} /> Kembali ke Daftar
        </Link>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Katalog</p>
          <h2 className="text-lg font-light text-brand-softblack">
            {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
        </div>
        <div className="w-28" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] mb-6 flex items-center overflow-x-auto">
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
              className={`flex items-center gap-2 py-4 px-6 text-[9px] uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-brand-gold text-brand-softblack"
                  : "border-transparent text-brand-softblack/30 hover:text-brand-softblack/60"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
        <input
          type="file"
          ref={galleryInputRef}
          onChange={handleGalleryUpload}
          className="hidden"
          accept="image/*"
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* TAB: INFO */}
            {activeTab === "info" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 mb-5">Informasi Utama</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-brand-softblack">
                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Nama Produk</label>
                      <input
                        type="text" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 focus:border-brand-gold/20 border border-transparent outline-none transition-all"
                        placeholder="misal: Atasan Linen Modern"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Kategori</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all appearance-none"
                      >
                        {dbCategories.length > 0 ? (
                          dbCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))
                        ) : (
                          <option value="">-- Tidak ada kategori --</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Koleksi</label>
                      <select
                        value={formData.collection_id || ""}
                        onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all appearance-none"
                      >
                        <option value="">-- Tanpa Koleksi --</option>
                        {dbCollections.map((col) => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Tagline</label>
                      <input
                        type="text" value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                        placeholder="misal: Bahan Linen Premium Impor"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Harga Dasar (Rp)</label>
                      <input
                        type="number" required value={formData.base_price}
                        onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Deskripsi Singkat</label>
                      <textarea
                        rows={2} value={formData.short_description}
                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Deskripsi Lengkap</label>
                      <textarea
                        rows={6} required value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: VISUALS */}
            {activeTab === "visuals" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 mb-5">Media & Galeri</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.25em] block text-brand-softblack/40 font-semibold">Gambar Utama</label>
                      <div className="aspect-[3/4] w-full bg-[#F4F2EF] border-2 border-dashed border-brand-softblack/10 rounded-2xl relative group overflow-hidden cursor-pointer hover:border-brand-gold/40 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        {formData.image_url ? (
                          <Image src={formData.image_url} alt="Main" fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-softblack/20">
                            <Upload size={28} strokeWidth={1} />
                            <span className="text-[9px] mt-2 tracking-widest uppercase">Pilih Foto</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.25em] block text-brand-softblack/40 font-semibold">Galeri Tambahan</label>
                      <div className="grid grid-cols-2 gap-3">
                        {formData.additional_images.map((img, idx) => (
                          <div key={idx} className="aspect-[3/4] relative group bg-[#F4F2EF] rounded-xl overflow-hidden">
                            <Image src={img} alt="Gallery" fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...formData.additional_images];
                                newImages.splice(idx, 1);
                                setFormData({ ...formData, additional_images: newImages });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-brand-softblack/10 rounded-xl text-brand-softblack/20 hover:text-brand-green hover:border-brand-gold/40 transition-colors"
                        >
                          <Plus size={20} strokeWidth={1.5} />
                          <span className="text-[8px] uppercase tracking-widest mt-2">Tambah</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: VARIANTS */}
            {activeTab === "variants" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7 space-y-6">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Warna & Varian</p>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.25em] block text-brand-softblack/40 font-semibold">Ukuran Tersedia (Sizes)</label>
                    <input
                      type="text" value={formData.sizes.join(", ")}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                      placeholder="misal: S, M, L, XL"
                    />
                    <p className="text-[8px] uppercase tracking-widest text-brand-softblack/25">Pisahkan dengan koma</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-brand-softblack/[0.05]">
                    <h4 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Daftar Varian Warna</h4>
                    <button
                      type="button" onClick={addVariant}
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-brand-green hover:underline"
                    >
                      <Plus size={12} /> Tambah Varian
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.color_variants.map((variant: any, idx: number) => (
                      <div key={idx} className="p-5 bg-[#F4F2EF] rounded-xl flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="flex items-center gap-3 shrink-0">
                          <input
                            type="color" value={variant.color}
                            onChange={(e) => updateVariant(idx, "color", e.target.value)}
                            className="w-9 h-9 rounded-full border-none p-0 bg-transparent cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <label className="text-[8px] uppercase tracking-widest text-brand-softblack/35">Nama Warna</label>
                            <input
                              type="text" value={variant.name}
                              onChange={(e) => updateVariant(idx, "name", e.target.value)}
                              className="bg-white rounded-lg px-3 py-1.5 text-xs w-28 focus:ring-1 focus:ring-brand-gold/30 outline-none border border-transparent"
                            />
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <label className="text-[8px] uppercase tracking-widest text-brand-softblack/35">Harga Override</label>
                            <input
                              type="number" value={variant.price || ""}
                              onChange={(e) => updateVariant(idx, "price", Number(e.target.value))}
                              className="bg-white rounded-lg px-3 py-1.5 text-xs w-full focus:ring-1 focus:ring-brand-gold/30 outline-none border border-transparent"
                              placeholder={formData.base_price.toString()}
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[8px] uppercase tracking-widest text-brand-softblack/35">Harga Coret</label>
                            <input
                              type="number" value={variant.old_price || ""}
                              onChange={(e) => updateVariant(idx, "old_price", Number(e.target.value))}
                              className="bg-white rounded-lg px-3 py-1.5 text-xs w-full focus:ring-1 focus:ring-brand-gold/30 outline-none border border-transparent"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <button type="button" onClick={() => removeVariant(idx)} className="text-brand-softblack/20 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CONTENT */}
            {activeTab === "content" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-7 space-y-6">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Konten Detail</p>

                  <div className="space-y-5">
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Panduan Ukuran (Size Guide)</label>
                      <textarea
                        rows={4} value={formData.size_guide}
                        onChange={(e) => setFormData({ ...formData, size_guide: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all text-sm font-mono"
                        placeholder={`Lingkar Dada: 100cm
Panjang Baju: 70cm`}
                      />
                      <p className="text-[8px] mt-1.5 uppercase tracking-widest text-brand-softblack/25">Muncul di tab &apos;Panduan Ukuran&apos; pada halaman produk.</p>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Material / Bahan</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all"
                        placeholder="misal: Katun Premium 100% (220 GSM)"
                      />
                      <p className="text-[8px] mt-1.5 uppercase tracking-widest text-brand-softblack/25">Muncul di accordion &apos;Detail Produk &amp; Bahan&apos; pada halaman produk.</p>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Instruksi Perawatan</label>
                      <textarea
                        rows={4} value={formData.care_instructions}
                        onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                        className="w-full bg-[#F4F2EF] rounded-xl px-4 py-3 text-brand-softblack font-light focus:ring-1 focus:ring-brand-gold/40 border border-transparent outline-none transition-all text-sm"
                        placeholder="Cuci dengan air dingin. Jangan gunakan pemutih."
                      />
                      <p className="text-[8px] mt-1.5 uppercase tracking-widest text-brand-softblack/25">Akan menimpa instruksi perawatan default (opsional).</p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-brand-softblack/[0.05] space-y-4">
                    <h4 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Key Highlights (Badge USP)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(formData.key_highlights as any[]).map((h: any, idx: number) => (
                        <div key={idx} className="p-4 bg-[#F4F2EF] rounded-xl space-y-2">
                          <input
                            type="text" value={h.name}
                            onChange={(e) => {
                              const newH = [...(formData.key_highlights as any[])];
                              newH[idx].name = e.target.value;
                              setFormData({ ...formData, key_highlights: newH });
                            }}
                            className="w-full bg-white rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-green outline-none focus:ring-1 focus:ring-brand-gold/30 border border-transparent"
                          />
                          <input
                            type="text" value={h.detail}
                            onChange={(e) => {
                              const newH = [...(formData.key_highlights as any[])];
                              newH[idx].detail = e.target.value;
                              setFormData({ ...formData, key_highlights: newH });
                            }}
                            className="w-full bg-transparent text-xs font-light text-brand-softblack/50 outline-none px-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area: Settings & Publish */}
          <div className="lg:col-span-1 space-y-4">
            {/* Publishing Panel */}
            <div className="bg-brand-softblack rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
              <div className="p-6 space-y-5">
                <h4 className="text-[9px] uppercase tracking-[0.35em] font-light text-white/40 border-b border-white/[0.07] pb-4">Publishing</h4>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-light text-white/50">Status Aktif</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${formData.is_active ? 'bg-brand-green' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.is_active ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.25em] block text-white/40 font-semibold flex items-center gap-2">
                    <Settings size={11} /> Label / Badge
                  </label>
                  <select
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: (e.target.value as any) || null })}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl text-[10px] uppercase tracking-widest px-4 py-3 text-white/70 focus:ring-1 focus:ring-brand-gold/40 outline-none cursor-pointer"
                  >
                    <option value="">No Badge</option>
                    <option value="new">New Arrival</option>
                    <option value="bestseller">Best Seller</option>
                    <option value="kit">Bundle Kit</option>
                    <option value="sale">Sale / Diskon</option>
                  </select>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-brand-offwhite text-brand-softblack rounded-xl py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-brand-green hover:text-white transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50 group mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} className="group-hover:scale-110 transition-transform" />}
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
                <p className="text-[8px] text-white/20 text-center uppercase tracking-widest">Perubahan langsung publik</p>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 space-y-2">
              <h5 className="text-[9px] uppercase tracking-widest font-semibold text-brand-softblack/40 flex items-center gap-2">
                💡 Pro Tip
              </h5>
              <p className="text-[10px] leading-relaxed text-brand-softblack/40 italic">
                Varian warna dengan harga override akan otomatis mengganti harga utama saat pelanggan memilih warna tersebut.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
