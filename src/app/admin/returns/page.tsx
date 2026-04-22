import { listOrderReturnsForAdmin } from "@/lib/order-service";
import { AlertCircle } from "lucide-react";
import { formatPrice } from "@/utils/format";

export default async function AdminReturnsPage() {
  const returns = await listOrderReturnsForAdmin();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Returns Desk
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Retur Pesanan
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Kelola permintaan pengembalian barang dan dana
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface-card border border-gray-100/80 px-6 pt-6">
        <div className="flex gap-8 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {['Semua', 'Menunggu Persetujuan', 'Disetujui', 'Selesai', 'Ditolak'].map((tab, i) => (
          <button 
            key={tab}
            className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-all whitespace-nowrap ${
              i === 0 ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-softblack/40 hover:text-brand-softblack'
            }`}
          >
            {tab}
          </button>
        ))}
        </div>
      </div>

      {/* Table */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-offwhite/30">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">ID Retur / Order</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Pelanggan</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Alasan</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Dana Retur</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {returns?.map((ret: any) => (
                <tr key={ret.id} className="hover:bg-brand-offwhite/10 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-softblack">{ret.id.slice(0, 8)}...</span>
                      <span className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">{ret.order_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-brand-softblack/60">{(ret as any).orders?.customer_name}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-brand-softblack/60">
                      <AlertCircle size={14} className="text-amber-500" />
                      <span>{ret.reason}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-brand-softblack">
                    {formatPrice(ret.refund_amount || 0)}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-[0.25em] font-bold border rounded-sm ${
                      ret.status === 'requested' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green hover:underline transition-all">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {(!returns || returns.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center italic text-brand-softblack/20">
                    Tidak ada permintaan retur saat ini.
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
