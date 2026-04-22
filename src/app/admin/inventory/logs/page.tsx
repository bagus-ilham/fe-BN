import { listInventoryMovements, type InventoryMovementItem } from "@/lib/log-service";
import { Search, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default async function AdminInventoryLogsPage() {
  const movements = await listInventoryMovements();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Inventory Ledger
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Riwayat Stok & Pergerakan
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Audit log perubahan inventaris produk
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="surface-card border border-gray-100/80 p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-softblack/20" size={18} />
          <input 
            type="text"
            placeholder="Cari produk atau variant..."
            className="w-full bg-white border border-gray-100 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green/30"
          />
        </div>
        <button className="px-6 py-3 border border-gray-100 bg-white text-xs uppercase tracking-widest text-brand-softblack/60 flex items-center gap-2 hover:bg-brand-offwhite transition-colors">
          <Filter size={16} />
          Tipe Gerakan
        </button>
      </div>

      {/* Table */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-offwhite/30">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Waktu & Admin</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Produk / Variant</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-center">Perubahan</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-center">Stok Akhir</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {movements?.map((mov: InventoryMovementItem) => (
                <tr key={mov.id} className="hover:bg-brand-offwhite/10 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs text-brand-softblack font-medium">{new Date(mov.created_at).toLocaleString('id-ID')}</span>
                      <span className="text-[10px] text-brand-softblack/30 uppercase tracking-widest">
                        {mov.profiles?.full_name || 'System'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-brand-softblack">{mov.product_variants?.products?.name}</span>
                      <span className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">
                        {mov.product_variants?.size} / {mov.product_variants?.color_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex items-center gap-1 font-bold ${
                      mov.quantity_change > 0 ? 'text-brand-green' : 'text-red-400'
                    }`}>
                      {mov.quantity_change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      {mov.quantity_change > 0 ? `+${mov.quantity_change}` : mov.quantity_change}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-brand-softblack">
                    {mov.quantity_after}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-brand-softblack/60 text-xs italic">{mov.reason}</span>
                  </td>
                </tr>
              ))}
              {(!movements || movements.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center italic text-brand-softblack/30">
                    Belum ada riwayat pergerakan stok.
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
