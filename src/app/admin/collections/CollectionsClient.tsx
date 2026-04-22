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
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveCollectionViaAdminApi, deleteCollectionViaAdminApi } from "@/lib/clients/admin-products-client";
import { useRouter } from "next/navigation";

interface Collection {
  id: string;
  name: string;
  description: string | null;
}

export default function CollectionsClient({ initialCollections }: { initialCollections: any[] }) {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: ""
  });

  const filteredCollections = collections.filter(col => 
    col.name.toLowerCase().includes(search.toLowerCase()) ||
    col.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (col?: Collection) => {
    if (col) {
      setEditingCollection(col);
      setFormData({
        id: col.id,
        name: col.name,
        description: col.description || ""
      });
    } else {
      setEditingCollection(null);
      setFormData({ id: "", name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = await saveCollectionViaAdminApi(formData);
      if (editingCollection) {
        setCollections(collections.map(c => c.id === saved.id ? saved : c));
      } else {
        setCollections([...collections, saved]);
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
    if (!confirm("Hapus koleksi ini?")) return;
    
    try {
      await deleteCollectionViaAdminApi(id);
      setCollections(collections.filter(c => c.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <>
      {/* Search & Action */}
      <div className="surface-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari koleksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-brand-offwhite/50 border-none text-sm focus:ring-1 focus:ring-brand-green/30 outline-none"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-softblack text-brand-offwhite px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-green transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={16} />
          Tambah Koleksi
        </button>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-offwhite/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">ID / Slug</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Nama Koleksi</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Deskripsi</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCollections.map((col) => (
                <tr key={col.id} className="hover:bg-brand-offwhite/20 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono text-brand-softblack/60 bg-brand-offwhite px-2 py-1 uppercase tracking-tighter">
                      {col.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-brand-softblack">{col.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] text-brand-softblack/50 line-clamp-1 max-w-xs">{col.description || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(col)}
                        className="p-2 text-brand-softblack/40 hover:text-brand-green hover:bg-brand-green/5 transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(col.id)}
                        className="p-2 text-brand-softblack/40 hover:text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-brand-softblack/30 text-xs uppercase tracking-widest">
                    Tidak ada koleksi ditemukan
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
              className="absolute inset-0 bg-brand-softblack/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white shadow-2xl overflow-hidden"
            >
              <div className="h-2 bg-brand-green w-full" />
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-light text-brand-softblack uppercase tracking-tight">
                    {editingCollection ? "Edit Koleksi" : "Koleksi Baru"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-brand-softblack/20 hover:text-brand-softblack transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">ID / Slug (Unik)</label>
                    <input 
                      type="text" 
                      required
                      disabled={!!editingCollection}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/ /g, '-') })}
                      placeholder="misal: summer-2025"
                      className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Nama Tampilan</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="misal: Summer 2025"
                      className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Deskripsi (Opsional)</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-softblack/40 hover:bg-brand-offwhite transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-brand-softblack text-brand-offwhite px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-green transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {loading ? "Menyimpan..." : "Simpan Koleksi"}
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
