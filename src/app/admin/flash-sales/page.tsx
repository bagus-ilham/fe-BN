import { listFlashSalesForAdmin } from "@/lib/application/marketing/marketing-query-service";
import { Clock, Plus, Search, Calendar, Tag } from "lucide-react";

export default async function AdminFlashSalesPage() {
  const flashSales = await listFlashSalesForAdmin();
  
  // Calculate real stats
  const activeCampaigns = flashSales?.filter((s: any) => s.is_active && new Date(s.start_at) <= new Date() && new Date(s.end_at) >= new Date()).length || 0;
  const upcomingCampaigns = flashSales?.filter((s: any) => s.is_active && new Date(s.start_at) > new Date()).length || 0;
  const totalProductsInSales = flashSales?.reduce((acc: number, s: any) => acc + (s.flash_sale_items?.length || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Campaign Scheduler
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Flash Sales
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Manajemen promo kilat dan penawaran terbatas waktu
          </p>
        </div>
        
        <button className="bg-brand-softblack text-brand-offwhite px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-green transition-all duration-300 flex items-center gap-2">
          <Plus size={16} />
          Buat Flash Sale Baru
        </button>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Berjalan</div>
            <div className="text-xl font-medium text-brand-softblack">{activeCampaigns} Campaign</div>
          </div>
        </div>
        <div className="surface-card p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Mendatang</div>
            <div className="text-xl font-medium text-brand-softblack">{upcomingCampaigns} Campaign</div>
          </div>
        </div>
        <div className="surface-card p-6 border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <Tag size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Total Produk Sale</div>
            <div className="text-xl font-medium text-brand-softblack">{totalProductsInSales} Item</div>
          </div>
        </div>
      </div>

      {/* Flash Sales Table */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-offwhite/30">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Nama Campaign</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Periode</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Jumlah Produk</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {flashSales?.map((sale: any) => (
                <tr key={sale.id} className="hover:bg-brand-offwhite/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-brand-softblack">{sale.name}</span>
                      <span className="text-[10px] text-brand-softblack/30 uppercase tracking-widest">ID: {sale.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col text-[11px] text-brand-softblack/60">
                      <span>Mulai: {new Date(sale.start_at).toLocaleString('id-ID')}</span>
                      <span>Selesai: {new Date(sale.end_at).toLocaleString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-brand-softblack/60">{sale.flash_sale_items?.length || 0} Produk</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-[0.25em] font-bold border rounded-sm ${
                      sale.is_active ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}>
                      {sale.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-brand-softblack/40 hover:text-brand-green transition-all">
                      Kelola Produk
                    </button>
                  </td>
                </tr>
              ))}
              {(!flashSales || flashSales.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center italic text-brand-softblack/30">
                    Belum ada campaign flash sale.
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
