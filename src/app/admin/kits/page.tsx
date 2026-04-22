import { listAllKitsForAdmin } from "@/lib/kit-service";
import { Package, Plus, Search, Filter } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/utils/format";

export default async function AdminKitsPage() {
  const kits = await listAllKitsForAdmin();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Bundle Manager
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Paket Produk (Kits)
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Kelola bundling produk dan penawaran spesial
          </p>
        </div>
        
        <button className="bg-brand-softblack text-brand-offwhite px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-green transition-all duration-300 flex items-center gap-2">
          <Plus size={16} />
          Buat Paket Baru
        </button>
      </div>

      {/* Toolbar */}
      <div className="surface-card border border-gray-100/80 p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-softblack/20" size={18} />
          <input 
            type="text"
            placeholder="Cari nama paket..."
            className="w-full bg-white border border-gray-100 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green/30"
          />
        </div>
        <button className="px-6 py-3 border border-gray-100 bg-white text-xs uppercase tracking-widest text-brand-softblack/60 flex items-center gap-2 hover:bg-brand-offwhite transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Kits Table */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-offwhite/30">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Paket Info</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Jumlah Item</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Harga Paket</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {kits?.map((kit: any) => (
                <tr key={kit.id} className="hover:bg-brand-offwhite/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center text-brand-softblack/20">
                        {kit.image_url ? (
                          <Image
                            src={kit.image_url}
                            alt={kit.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-brand-softblack">{kit.name}</span>
                        <span className="text-[10px] text-brand-softblack/30 uppercase tracking-widest">ID: {kit.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-brand-softblack/60">{kit.kit_items?.length || 0} Produk</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-brand-softblack">{formatPrice(kit.price)}</span>
                      {kit.old_price && (
                        <span className="text-[10px] text-brand-softblack/20 line-through">{formatPrice(kit.old_price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-[0.25em] font-bold border rounded-sm ${
                      kit.is_active ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}>
                      {kit.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-brand-softblack/40 hover:text-brand-green transition-all">
                      Detail / Edit
                    </button>
                  </td>
                </tr>
              ))}
              {(!kits || kits.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center italic text-brand-softblack/30">
                    Belum ada paket produk.
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
