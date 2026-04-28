"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  X,
  Save,
  Loader2,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveCategoryViaAdminApi, deleteCategoryViaAdminApi } from "@/lib/clients/admin-products-client";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: ""
  });

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ id: cat.id, name: cat.name, description: cat.description || "" });
    } else {
      setEditingCategory(null);
      setFormData({ id: "", name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = await saveCategoryViaAdminApi(formData);
      if (editingCategory) {
        setCategories(categories.map(c => c.id === saved.id ? saved : c));
      } else {
        setCategories([...categories, saved]);
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini? Produk yang terkait mungkin akan bermasalah.")) return;
    try {
      await deleteCategoryViaAdminApi(id);
      setCategories(categories.filter(c => c.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <>
      {/* Search & Action */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={16} />
          <input 
            type="text" 
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F2EF] rounded-xl border border-transparent text-sm placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="group inline-flex items-center gap-2 bg-brand-softblack text-brand-offwhite px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all duration-300 shadow-lg shadow-brand-softblack/20 self-start"
        >
          <Plus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          Tambah Kategori
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">ID / Slug</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Nama Kategori</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Deskripsi</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04]">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 bg-[#F4F2EF] px-3 py-1.5 rounded-lg">
                      <Tag size={11} className="text-brand-softblack/30" />
                      <span className="text-[10px] font-mono text-brand-softblack/60 uppercase tracking-wider">{cat.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-brand-softblack">{cat.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] text-brand-softblack/45 line-clamp-1 max-w-xs italic">{cat.description || "—"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="p-2 text-brand-softblack/35 hover:text-brand-green hover:bg-brand-champagne/40 transition-all rounded-xl"
                      >
                        <Edit size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-brand-softblack/35 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <Tag size={28} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm text-brand-softblack/35">Tidak ada kategori ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-softblack/60"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Gold top bar */}
              <div className="h-[3px] bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60 w-full" />
              <div className="p-7">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/35 mb-1">Kategori</p>
                    <h3 className="text-lg font-light text-brand-softblack">
                      {editingCategory ? "Edit Kategori" : "Kategori Baru"}
                    </h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-brand-softblack/25 hover:text-brand-softblack hover:bg-[#F4F2EF] transition-all">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">ID / Slug (Unik)</label>
                    <input 
                      type="text" required
                      disabled={!!editingCategory}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/ /g, '-') })}
                      placeholder="misal: baju-atasan"
                      className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm font-light focus:ring-1 focus:ring-brand-gold/40 outline-none disabled:opacity-50 transition-all border border-transparent focus:border-brand-gold/20"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Nama Tampilan</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="misal: Baju Atasan"
                      className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm font-light focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Deskripsi (Opsional)</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm font-light focus:ring-1 focus:ring-brand-gold/40 outline-none resize-none transition-all border border-transparent focus:border-brand-gold/20"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest text-brand-softblack/40 hover:bg-[#F4F2EF] transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" disabled={loading}
                      className="flex-[2] bg-brand-softblack text-brand-offwhite px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-softblack/20"
                    >
                      {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {loading ? "Menyimpan..." : "Simpan Kategori"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
