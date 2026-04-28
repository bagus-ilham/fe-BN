import { listAllKitsForAdmin } from "@/lib/kit-service";
import { Package, Plus, Search, Edit, Gift } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/utils/format";

export default async function AdminKitsPage() {
  const kits = await listAllKitsForAdmin();
  const activeKits = kits?.filter((k: any) => k.is_active).length || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Bundle Manager</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Paket Produk (Kits)</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F2EF] text-[9px] uppercase tracking-wider text-brand-softblack/60">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              {activeKits} Aktif
            </span>
            <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider">
              {kits?.length || 0} total paket
            </span>
          </div>
        </div>
        <button className="group inline-flex items-center gap-2 bg-brand-softblack text-brand-offwhite px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all duration-300 shadow-lg shadow-brand-softblack/20 self-start">
          <Plus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          Buat Paket Baru
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={16} />
          <input 
            type="text"
            placeholder="Cari nama paket..."
            className="w-full bg-[#F4F2EF] rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-softblack placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
          />
        </div>
      </div>

      {/* Kits Table */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Paket Info</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Jumlah Item</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Harga Paket</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04]">
              {kits?.map((kit: any) => (
                <tr key={kit.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-11 h-14 bg-[#F4F2EF] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        {kit.image_url ? (
                          <Image
                            src={kit.image_url}
                            alt={kit.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift size={16} className="text-brand-softblack/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-brand-softblack text-[12px]">{kit.name}</span>
                        <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider mt-0.5">#{kit.id.split('-')[0]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#F4F2EF] px-3 py-1.5 rounded-lg text-[10px] text-brand-softblack/60">
                      <Package size={11} />
                      {kit.kit_items?.length || 0} produk
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-brand-softblack">{formatPrice(kit.price)}</span>
                      {kit.old_price && (
                        <span className="text-[10px] text-brand-softblack/25 line-through">{formatPrice(kit.old_price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${
                      kit.is_active
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                        : "bg-brand-softblack/5 text-brand-softblack/35 border-brand-softblack/10"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${kit.is_active ? "bg-emerald-400" : "bg-brand-softblack/25"}`} />
                      {kit.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-medium text-brand-softblack/40 hover:text-brand-green hover:bg-brand-champagne/40 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-brand-champagne">
                      <Edit size={12} />
                      Detail / Edit
                    </button>
                  </td>
                </tr>
              ))}
              {(!kits || kits.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Gift size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">Belum ada paket produk.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
