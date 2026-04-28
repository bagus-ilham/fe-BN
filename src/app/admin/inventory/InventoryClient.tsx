"use client";

import { useState } from "react";
import { 
  Search, 
  Loader2,
  AlertTriangle,
  Package,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { updateStockViaAdminApi } from "@/lib/clients/admin-products-client";
import { useRouter } from "next/navigation";

export default function InventoryClient({ initialInventory }: { initialInventory: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.products.name.toLowerCase().includes(search.toLowerCase()) ||
    item.color_name?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = filteredItems.filter(item => (item.inventory?.stock_quantity ?? 0) <= (item.inventory?.low_stock_threshold ?? 10)).length;

  const handleUpdate = async (id: string, newQty: number) => {
    setLoadingId(id);
    try {
      await updateStockViaAdminApi(id, newQty);
      setItems(items.map(item => 
        item.id === id 
          ? { ...item, inventory: { ...item.inventory, stock_quantity: newQty } }
          : item
      ));
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
      router.refresh();
    } catch (err: any) {
      alert("Gagal memperbarui stok: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search + summary */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={16} />
          <input 
            type="text" 
            placeholder="Cari produk atau varian warna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F2EF] rounded-xl border border-transparent text-sm placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all"
          />
        </div>
        {lowStockCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-[10px] uppercase tracking-wider text-red-500 flex-shrink-0">
            <AlertTriangle size={13} />
            {lowStockCount} item perlu restock
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Produk</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Varian</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Stok Saat Ini</th>
              <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-softblack/[0.04]">
            {filteredItems.map((item) => {
              const currentStock = item.inventory?.stock_quantity ?? 0;
              const threshold = item.inventory?.low_stock_threshold ?? 10;
              const isLow = currentStock <= threshold;
              
              return (
                <tr key={item.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-13 bg-[#F4F2EF] rounded-xl overflow-hidden shrink-0 shadow-sm" style={{height: "52px"}}>
                        {item.products.image_url ? (
                          <Image src={item.products.image_url} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={14} className="text-brand-softblack/20" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-brand-softblack">{item.products.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#F4F2EF] px-3 py-1.5 rounded-lg text-[10px] text-brand-softblack/55">
                      {item.color_name || "Default"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        defaultValue={currentStock}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val !== currentStock) handleUpdate(item.id, val);
                        }}
                        className={`
                          w-20 px-3 py-2 rounded-xl text-sm font-bold outline-none border-2 text-center transition-all
                          ${isLow 
                            ? "border-red-300 bg-red-50 text-red-600 focus:border-red-400" 
                            : "border-brand-softblack/[0.08] bg-[#F4F2EF] text-brand-softblack focus:border-brand-gold/40"
                          }
                        `}
                      />
                      <span className="text-[9px] uppercase tracking-wider text-brand-softblack/30">pcs</span>
                      {isLow && <AlertTriangle size={14} className="text-red-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {loadingId === item.id ? (
                      <Loader2 size={15} className="animate-spin text-brand-gold ml-auto" />
                    ) : savedId === item.id ? (
                      <div className="flex items-center justify-end gap-1.5 text-emerald-500">
                        <CheckCircle2 size={14} />
                        <span className="text-[9px] uppercase tracking-widest">Tersimpan</span>
                      </div>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider bg-red-50 text-red-400 border border-red-100 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Restock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-500 border border-emerald-100 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Aman
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <Package size={28} className="mx-auto mb-3 text-brand-softblack/15" />
                  <p className="text-sm text-brand-softblack/35">Tidak ada item inventaris ditemukan</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
