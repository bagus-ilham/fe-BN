import { listOrderReturnsForAdmin } from "@/lib/order-service";
import { AlertCircle, RotateCcw, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/utils/format";

const returnStatusConfig: Record<string, { classes: string; dot: string; label: string }> = {
  requested:  { classes: "bg-amber-50 text-amber-600 border-amber-200/80",   dot: "bg-amber-400",   label: "Menunggu" },
  approved:   { classes: "bg-emerald-50 text-emerald-600 border-emerald-200/80", dot: "bg-emerald-400", label: "Disetujui" },
  completed:  { classes: "bg-sky-50 text-sky-600 border-sky-200/80",         dot: "bg-sky-400",     label: "Selesai" },
  rejected:   { classes: "bg-red-50 text-red-500 border-red-200/80",          dot: "bg-red-400",     label: "Ditolak" },
};

export default async function AdminReturnsPage() {
  const returns = await listOrderReturnsForAdmin();
  
  const pendingCount = returns?.filter((r: any) => r.status === "requested").length || 0;
  const approvedCount = returns?.filter((r: any) => r.status === "approved").length || 0;
  const completedCount = returns?.filter((r: any) => r.status === "completed").length || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Returns Desk</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Retur Pesanan</h2>
          <p className="text-[11px] text-brand-softblack/40">Kelola permintaan pengembalian barang dan dana</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Menunggu Persetujuan", value: pendingCount, icon: Clock, iconClass: "bg-amber-50 text-amber-500", urgent: pendingCount > 0 },
          { label: "Disetujui", value: approvedCount, icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-500" },
          { label: "Selesai Diproses", value: completedCount, icon: XCircle, iconClass: "bg-sky-50 text-sky-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white rounded-2xl border p-5 flex items-center gap-4 ${stat.urgent ? "border-amber-200/60" : "border-brand-softblack/[0.06]"}`}>
              <div className={`p-3 rounded-xl flex-shrink-0 ${stat.iconClass}`}>
                <Icon size={17} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1">{stat.label}</div>
                <div className="text-2xl font-light text-brand-softblack">{stat.value}</div>
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
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">ID Retur</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Pelanggan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Alasan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Dana Retur</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04]">
              {returns?.map((ret: any) => {
                const cfg = returnStatusConfig[ret.status] || returnStatusConfig.requested;
                return (
                  <tr key={ret.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-brand-softblack tracking-wider">#{ret.id.slice(0, 8).toUpperCase()}</span>
                        <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider mt-0.5">Order: {ret.order_id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-medium text-brand-softblack">{(ret as any).orders?.customer_name || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[11px] text-brand-softblack/60 max-w-xs">
                        <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />
                        <span className="line-clamp-1">{ret.reason}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-brand-softblack">{formatPrice(ret.refund_amount || 0)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${cfg.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-medium text-brand-softblack/40 hover:text-brand-green hover:bg-brand-champagne/40 transition-all opacity-0 group-hover:opacity-100">
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!returns || returns.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <RotateCcw size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">Tidak ada permintaan retur saat ini.</p>
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
