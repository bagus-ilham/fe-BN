import { listFlashSalesForAdmin } from "@/lib/application/marketing/marketing-query-service";
import { Clock, Plus, Calendar, Tag, Zap } from "lucide-react";

export default async function AdminFlashSalesPage() {
  const flashSales = await listFlashSalesForAdmin();
  
  const now = new Date();
  const activeCampaigns = flashSales?.filter((s: any) => s.is_active && new Date(s.start_at) <= now && new Date(s.end_at) >= now).length || 0;
  const upcomingCampaigns = flashSales?.filter((s: any) => s.is_active && new Date(s.start_at) > now).length || 0;
  const totalProductsInSales = flashSales?.reduce((acc: number, s: any) => acc + (s.flash_sale_items?.length || 0), 0) || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Campaign Scheduler</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Flash Sales</h2>
          <p className="text-[11px] text-brand-softblack/40">Manajemen promo kilat dan penawaran terbatas waktu</p>
        </div>
        <button className="group inline-flex items-center gap-2 bg-brand-softblack text-brand-offwhite px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-softblack/20 self-start">
          <Plus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          Buat Flash Sale Baru
        </button>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Sedang Berjalan", value: `${activeCampaigns} Campaign`, icon: Clock, iconClass: "bg-emerald-50 text-emerald-500", urgent: activeCampaigns > 0 },
          { label: "Mendatang", value: `${upcomingCampaigns} Campaign`, icon: Calendar, iconClass: "bg-sky-50 text-sky-500" },
          { label: "Total Produk Sale", value: `${totalProductsInSales} Item`, icon: Tag, iconClass: "bg-amber-50 text-amber-500" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${card.urgent ? "border-emerald-200/60" : "border-brand-softblack/[0.06]"}`}>
              <div className={`p-3 rounded-xl flex-shrink-0 ${card.iconClass}`}>
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-brand-softblack/40 mb-1">{card.label}</div>
                <div className="text-xl font-light text-brand-softblack">{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flash Sales Table */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Nama Campaign</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Periode</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Produk</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04]">
              {flashSales?.map((sale: any) => {
                const saleStart = new Date(sale.start_at);
                const saleEnd = new Date(sale.end_at);
                const isLive = sale.is_active && saleStart <= now && saleEnd >= now;
                const isUpcoming = sale.is_active && saleStart > now;

                return (
                  <tr key={sale.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-sale-red/10 to-amber-50 flex items-center justify-center flex-shrink-0">
                          <Zap size={15} className="text-brand-sale-red" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-brand-softblack text-[12px]">{sale.name}</span>
                          <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider">#{sale.id.split("-")[0]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-[10px] text-brand-softblack/55 gap-0.5">
                        <span>▶ {saleStart.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        <span>■ {saleEnd.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#F4F2EF] px-3 py-1.5 rounded-lg text-[10px] text-brand-softblack/60">
                        <Tag size={11} />
                        {sale.flash_sale_items?.length || 0} produk
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full bg-emerald-50 text-emerald-600 border-emerald-200/80">
                          <span className="relative flex w-1.5 h-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
                          </span>
                          Live
                        </span>
                      ) : isUpcoming ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full bg-sky-50 text-sky-600 border-sky-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          Mendatang
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full bg-brand-softblack/5 text-brand-softblack/35 border-brand-softblack/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-softblack/25" />
                          Selesai
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-medium text-brand-softblack/50 hover:text-brand-green hover:bg-brand-champagne/40 transition-all border border-transparent hover:border-brand-champagne">
                        Kelola Produk
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!flashSales || flashSales.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Zap size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">Belum ada campaign flash sale.</p>
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
