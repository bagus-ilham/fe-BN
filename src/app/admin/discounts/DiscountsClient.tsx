"use client";

import { useState } from "react";
import { 
  Plus, 
  X,
  Save,
  Loader2,
  Ticket,
  Percent,
  BadgeDollarSign,
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
      setFormData({ code: "", type: "percentage", value: 0, min_purchase: 0, max_discount: null, expires_at: null, usage_limit: null, is_active: true });
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

  const activeCount = promoCodes.filter(p => p.is_active).length;

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 mb-1">Promo Codes</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[9px] uppercase tracking-wider text-emerald-600 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {activeCount} Aktif
            </span>
            <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider">{promoCodes.length} total kode</span>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="group inline-flex items-center gap-2 bg-brand-softblack text-brand-offwhite px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-softblack/20"
        >
          <Plus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          Buat Kode Promo
        </button>
      </div>

      {/* Promo Code Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promoCodes.map((promo) => {
          const isExpired = promo.expires_at ? new Date(promo.expires_at) < new Date() : false;
          return (
            <motion.div 
              key={promo.id}
              layout
              className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all group ${
                promo.is_active && !isExpired ? "border-brand-softblack/[0.06]" : "border-brand-softblack/[0.04] opacity-60"
              }`}
            >
              {/* Card header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${promo.is_active && !isExpired ? "bg-brand-champagne/60 text-brand-green" : "bg-[#F4F2EF] text-brand-softblack/30"}`}>
                    <Ticket size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-brand-softblack tracking-widest uppercase">{promo.id}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {promo.discount_type === "percentage" ? (
                        <Percent size={10} className="text-brand-softblack/30" />
                      ) : (
                        <BadgeDollarSign size={10} className="text-brand-softblack/30" />
                      )}
                      <span className="text-[10px] text-brand-softblack/40">
                        {promo.discount_type === "percentage"
                          ? `${promo.discount_value}% Diskon`
                          : `Rp ${promo.discount_value.toLocaleString("id-ID")} Diskon`}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full border ${
                  promo.is_active && !isExpired 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/60" 
                    : "bg-[#F4F2EF] text-brand-softblack/30 border-brand-softblack/[0.06]"
                }`}>
                  {isExpired ? "Expired" : promo.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {/* Card details */}
              <div className="space-y-2.5 pt-4 border-t border-brand-softblack/[0.05]">
                <div className="flex justify-between text-[10px]">
                  <span className="text-brand-softblack/35 uppercase tracking-wider">Min. Belanja</span>
                  <span className="text-brand-softblack/70 font-medium">Rp {promo.min_purchase_amount.toLocaleString("id-ID")}</span>
                </div>
                {promo.max_discount_amount && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-brand-softblack/35 uppercase tracking-wider">Maks. Diskon</span>
                    <span className="text-brand-softblack/70 font-medium">Rp {promo.max_discount_amount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px]">
                  <span className="text-brand-softblack/35 uppercase tracking-wider">Berlaku s/d</span>
                  <span className={`font-medium ${isExpired ? "text-red-400" : "text-brand-softblack/70"}`}>
                    {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Selamanya"}
                  </span>
                </div>
                {promo.usage_limit && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-brand-softblack/35 uppercase tracking-wider">Batas Penggunaan</span>
                    <span className="text-brand-softblack/70 font-medium">{promo.usage_limit}×</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleOpenModal(promo)}
                className="w-full mt-4 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-medium text-brand-softblack/40 hover:text-brand-green hover:bg-brand-champagne/40 transition-all border border-transparent hover:border-brand-champagne"
              >
                Edit Promo
              </button>
            </motion.div>
          );
        })}

        {promoCodes.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-brand-softblack/[0.06] p-16 text-center">
            <Ticket size={32} className="mx-auto mb-3 text-brand-softblack/15" />
            <p className="text-sm text-brand-softblack/35">Belum ada kode promo. Buat yang pertama!</p>
          </div>
        )}
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
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="h-[3px] bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60 w-full sticky top-0" />
              <div className="p-7">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/35 mb-1">Kode Promo</p>
                    <h3 className="text-lg font-light text-brand-softblack">
                      {editingPromo ? "Edit Promo" : "Promo Baru"}
                    </h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-brand-softblack/25 hover:text-brand-softblack hover:bg-[#F4F2EF] transition-all">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Kode Kupon</label>
                    <input 
                      type="text" required
                      disabled={!!editingPromo}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="misal: BENANG10"
                      className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm font-bold tracking-widest focus:ring-1 focus:ring-brand-gold/40 outline-none disabled:opacity-50 transition-all border border-transparent focus:border-brand-gold/20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Tipe Potongan</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as PromoCodeForm["type"] })}
                        className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
                      >
                        <option value="percentage">Persentase (%)</option>
                        <option value="fixed">Nominal (Rp)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Nilai Potongan</label>
                      <input 
                        type="number" required
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                        className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Minimal Pembelian (Rp)</label>
                    <input 
                      type="number"
                      value={formData.min_purchase}
                      onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                      className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.25em] block mb-2 text-brand-softblack/40 font-semibold">Tanggal Kedaluwarsa</label>
                    <input 
                      type="date"
                      value={formData.expires_at || ""}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full bg-[#F4F2EF] rounded-xl p-3.5 text-sm focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
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
