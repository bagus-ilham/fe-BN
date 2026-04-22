"use client";

import { useState } from "react";
import { 
  Plus, 
  X,
  Save,
  Loader2,
  Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { savePromoCodeViaAdminApi } from "@/lib/clients/admin-products-client";
import { useRouter } from "next/navigation";
import type { PromoCode } from "@/types/database";

type PromoCodeForm = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_purchase: number;
  max_discount: number | null;
  expires_at: string | null;
  usage_limit: number | null;
  is_active: boolean;
};

const mapPromoToForm = (promo: PromoCode): PromoCodeForm => ({
  code: promo.id,
  type: promo.discount_type,
  value: promo.discount_value,
  min_purchase: promo.min_purchase_amount,
  max_discount: promo.max_discount_amount,
  expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().split("T")[0] : null,
  usage_limit: promo.usage_limit,
  is_active: promo.is_active,
});

export default function DiscountsClient({ initialPromoCodes }: { initialPromoCodes: PromoCode[] }) {
  const router = useRouter();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PromoCodeForm>({
    code: "",
    type: "percentage",
    value: 0,
    min_purchase: 0,
    max_discount: null as number | null,
    expires_at: null as string | null,
    usage_limit: null as number | null,
    is_active: true
  });

  const handleOpenModal = (promo?: PromoCode) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData(mapPromoToForm(promo));
    } else {
      setEditingPromo(null);
      setFormData({
        code: "",
        type: "percentage",
        value: 0,
        min_purchase: 0,
        max_discount: null,
        expires_at: null,
        usage_limit: null,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Partial<PromoCode> = {
        id: formData.code,
        discount_type: formData.type,
        discount_value: formData.value,
        min_purchase_amount: formData.min_purchase,
        max_discount_amount: formData.max_discount,
        expires_at: formData.expires_at,
        usage_limit: formData.usage_limit,
        is_active: formData.is_active,
      };
      const saved = await savePromoCodeViaAdminApi(payload);
      if (editingPromo) {
        setPromoCodes(promoCodes.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setPromoCodes([saved, ...promoCodes]);
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-softblack text-brand-offwhite px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-green transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={16} />
          Buat Kode Promo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoCodes.map((promo) => (
          <motion.div 
            key={promo.id}
            layout
            className="surface-card p-6 border border-gray-100 hover:border-brand-green/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                  <Ticket size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-brand-softblack tracking-wider uppercase">{promo.id}</div>
                  <div className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">
                    {promo.discount_type === "percentage"
                      ? `${promo.discount_value}% Off`
                      : `Rp ${promo.discount_value.toLocaleString()} Off`}
                  </div>
                </div>
              </div>
              <div className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded ${promo.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {promo.is_active ? 'Aktif' : 'Nonaktif'}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-softblack/30">Min. Belanja</span>
                <span className="text-brand-softblack font-medium">Rp {promo.min_purchase_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-softblack/30">Berlaku s/d</span>
                <span className="text-brand-softblack font-medium">{promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'Selamanya'}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => handleOpenModal(promo)}
                className="flex-1 py-2 text-[10px] uppercase tracking-widest font-bold text-brand-softblack/40 hover:text-brand-green hover:bg-brand-green/5 transition-all"
              >
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

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
                    {editingPromo ? "Edit Promo" : "Promo Baru"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-brand-softblack/20 hover:text-brand-softblack transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Kode Kupon</label>
                    <input 
                      type="text" 
                      required
                      disabled={!!editingPromo}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="misal: BENANG10"
                      className="w-full bg-brand-offwhite border-none p-4 text-sm font-bold tracking-widest focus:ring-1 focus:ring-brand-green outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Tipe Potongan</label>
                      <select 
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as PromoCodeForm["type"],
                          })
                        }
                        className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none"
                      >
                        <option value="percentage">Persentase (%)</option>
                        <option value="fixed">Nominal (Rp)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Nilai Potongan</label>
                      <input 
                        type="number" required
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                        className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Minimal Pembelian (Rp)</label>
                    <input 
                      type="number" 
                      value={formData.min_purchase}
                      onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                      className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-medium">Tanggal Kedaluwarsa</label>
                    <input 
                      type="date" 
                      value={formData.expires_at || ""}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full bg-brand-offwhite border-none p-4 text-sm font-light focus:ring-1 focus:ring-brand-green outline-none"
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
                      {loading ? "Menyimpan..." : "Simpan Promo"}
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
