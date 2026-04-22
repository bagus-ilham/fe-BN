"use client";

import { useState } from "react";
import { 
  Search, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import Image from "next/image";
import { updateStockViaAdminApi } from "@/lib/clients/admin-products-client";
import { useRouter } from "next/navigation";

export default function InventoryClient({ initialInventory }: { initialInventory: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.products.name.toLowerCase().includes(search.toLowerCase()) ||
    item.color_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = async (id: string, newQty: number) => {
    setLoadingId(id);
    try {
      await updateStockViaAdminApi(id, newQty);
      setItems(items.map(item => 
        item.id === id 
          ? { ...item, inventory: { ...item.inventory, stock_quantity: newQty } }
          : item
      ));
      router.refresh();
    } catch (err: any) {
      alert("Gagal memperbarui stok: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface-card p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari produk atau varian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-brand-offwhite/50 border-none text-sm outline-none"
          />
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-brand-offwhite/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-medium text-brand-softblack/40">Produk</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-medium text-brand-softblack/40">Varian</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-medium text-brand-softblack/40">Stok Saat Ini</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-medium text-brand-softblack/40 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.map((item) => {
              const currentStock = item.inventory?.stock_quantity ?? 0;
              const isLow = currentStock <= (item.inventory?.low_stock_threshold ?? 10);
              
              return (
                <tr key={item.id} className="hover:bg-brand-offwhite/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-brand-offwhite shrink-0">
                        {item.products.image_url && (
                          <Image src={item.products.image_url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-brand-softblack">{item.products.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-brand-softblack/60">{item.color_name || "Default"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        defaultValue={currentStock}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (val !== currentStock) handleUpdate(item.id, val);
                        }}
                        className={`w-20 px-3 py-2 bg-brand-offwhite text-sm font-bold outline-none border-b-2 ${
                          isLow ? 'border-red-400 text-red-600' : 'border-transparent text-brand-softblack'
                        }`}
                      />
                      {isLow && <AlertTriangle size={14} className="text-red-400" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {loadingId === item.id ? (
                      <Loader2 size={16} className="animate-spin text-brand-green ml-auto" />
                    ) : (
                      <span className="text-[10px] text-brand-softblack/20 uppercase tracking-widest">Auto-save on blur</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
