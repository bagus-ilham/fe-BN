import { getAdminAbandonedCheckoutOverview } from "@/lib/application/marketing/marketing-query-service";
import { formatPrice } from "@/utils/format";
import { ShoppingCart, Mail, ArrowRight, TrendingUp, RefreshCcw, AlertCircle } from "lucide-react";

export default async function AdminAbandonedCartsPage() {
  const { rows, stats } = await getAdminAbandonedCheckoutOverview();
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Cart Recovery</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Keranjang Terabaikan</h2>
          <p className="text-[11px] text-brand-softblack/40">Pantau dan pulihkan transaksi yang tidak selesai</p>
        </div>
        <button className="group inline-flex items-center gap-2 bg-brand-softblack text-white px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-softblack/20 self-start">
          <Mail size={13} className="group-hover:scale-110 transition-transform" />
          Blast Pengingat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Terdeteksi", value: stats.totalDetected, icon: ShoppingCart, iconClass: "bg-sky-50 text-sky-500" },
          { label: "Berhasil Pulih", value: `${stats.recoveredCount} (${stats.recoveredRate}%)`, icon: RefreshCcw, iconClass: "bg-emerald-50 text-emerald-500" },
          { label: "Potensi Penjualan", value: stats.potentialRevenueLabel, icon: TrendingUp, iconClass: "bg-brand-champagne/60 text-brand-green" },
          { label: "Menunggu Pengingat", value: stats.pendingRemindersCount, icon: AlertCircle, iconClass: "bg-amber-50 text-amber-500", urgent: stats.pendingRemindersCount > 0 },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white rounded-2xl border p-5 flex items-center gap-3 ${"urgent" in stat && stat.urgent ? "border-amber-200/60" : "border-brand-softblack/[0.06]"}`}>
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconClass}`}>
                <Icon size={17} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1 leading-tight">{stat.label}</div>
                <div className="text-lg font-light text-brand-softblack truncate">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Pelanggan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Isi Keranjang</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Total</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Terakhir Dilihat</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04]">
              {rows?.map((item) => (
                <tr key={item.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-brand-softblack">{item.email}</span>
                      <span className="text-[9px] text-brand-softblack/30 tracking-wider">{item.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-[#F4F2EF] px-3 py-1.5 rounded-lg text-[10px] text-brand-softblack/60">
                      <ShoppingCart size={11} />
                      {Array.isArray(item.cart_items) ? item.cart_items.length : 0} Produk
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-brand-softblack">{formatPrice(item.cartTotal)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-brand-softblack/40">
                      {new Date(item.captured_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-medium text-brand-softblack/40 hover:text-brand-green hover:bg-brand-champagne/40 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-brand-champagne">
                      Kirim Pengingat <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <ShoppingCart size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">Belum ada data checkout terabaikan.</p>
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
