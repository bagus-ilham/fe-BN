import { getAdminWaitlistOverview } from "@/lib/application/marketing/marketing-query-service";
import { 
  Bell, Mail, Calendar, TrendingDown, Info, ListChecks
} from "lucide-react";

export default async function AdminWaitlistPage() {
  type WaitlistRow = {
    id: string;
    email: string;
    created_at: string;
    notified_at?: string | null;
    products?: { name?: string | null; image_url?: string | null } | null;
  };

  const { waitlist, sortedWaitlist } = await getAdminWaitlistOverview();

  const notifiedCount = (waitlist as WaitlistRow[])?.filter(w => w.notified_at).length || 0;
  const waitingCount = (waitlist as WaitlistRow[])?.filter(w => !w.notified_at).length || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Stock Interest</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Waitlist & Peminat Produk</h2>
          <p className="text-[11px] text-brand-softblack/40">Daftar pelanggan yang menunggu stok kembali</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F4F2EF] rounded-xl border border-brand-softblack/[0.06] text-[10px] text-brand-softblack/50">
            <ListChecks size={13} />
            <span>{(waitlist as WaitlistRow[])?.length || 0} total antrian</span>
          </div>
        </div>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Menunggu Notifikasi", value: waitingCount, iconEl: <Bell size={17} strokeWidth={1.5} />, iconClass: "bg-amber-50 text-amber-500", urgent: waitingCount > 0 },
          { label: "Sudah Diberitahu", value: notifiedCount, iconEl: <Mail size={17} strokeWidth={1.5} />, iconClass: "bg-emerald-50 text-emerald-500" },
          { label: "Produk Diminati", value: sortedWaitlist.length, iconEl: <TrendingDown size={17} strokeWidth={1.5} />, iconClass: "bg-brand-champagne/60 text-brand-green" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl border p-5 flex items-center gap-3 ${stat.urgent ? "border-amber-200/60" : "border-brand-softblack/[0.06]"}`}>
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconClass}`}>{stat.iconEl}</div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1">{stat.label}</div>
              <div className="text-xl font-light text-brand-softblack">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                    <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Email Pelanggan</th>
                    <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Produk Diminta</th>
                    <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Tanggal Daftar</th>
                    <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-softblack/[0.04]">
                  {(waitlist as WaitlistRow[])?.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-offwhite/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#F4F2EF] text-brand-softblack/30 flex-shrink-0">
                            <Mail size={13} />
                          </div>
                          <span className="text-[11px] font-medium text-brand-softblack">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] text-brand-softblack/50 italic">{item.products?.name || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-brand-softblack/40">
                          <Calendar size={11} strokeWidth={1.5} />
                          {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${
                          item.notified_at
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                            : "bg-amber-50 text-amber-600 border-amber-200/80"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.notified_at ? "bg-emerald-400" : "bg-amber-400"}`} />
                          {item.notified_at ? "Diberitahu" : "Menunggu"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {(!waitlist || (waitlist as WaitlistRow[]).length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <ListChecks size={28} className="mx-auto mb-3 text-brand-softblack/15" />
                        <p className="text-sm text-brand-softblack/35">Belum ada yang mengantre di waitlist.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Insight panel */}
        <div className="space-y-4">
          {/* Restock insight - dark card */}
          <div className="bg-brand-softblack rounded-2xl p-6 text-brand-offwhite relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/8 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown size={16} className="text-brand-gold/70" />
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/40">Insight Restok</h3>
              </div>
              
              <div className="space-y-4">
                {sortedWaitlist.slice(0, 5).map(([name, count], i) => (
                  <div key={name} className="flex justify-between items-center">
                    <div className="flex flex-col gap-1.5 flex-1 mr-4">
                      <span className="text-[10px] text-white/55">#{i+1} {name}</span>
                      <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-gold/70 to-brand-gold/40 rounded-full" 
                          style={{ width: `${Math.min((count / 10) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                    <span className="text-lg font-light text-white/80">{count}</span>
                  </div>
                ))}
                
                {sortedWaitlist.length === 0 && (
                  <p className="text-[10px] uppercase tracking-widest text-white/20">Belum ada data permintaan</p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-start gap-2 text-white/30 text-[9px]">
                <Info size={11} className="mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">Gunakan data ini untuk menentukan prioritas produksi selanjutnya.</p>
              </div>
            </div>
          </div>

          {/* Email automation info */}
          <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-brand-champagne/60 flex items-center justify-center text-brand-green">
              <Bell size={16} />
            </div>
            <h4 className="text-[10px] font-semibold text-brand-softblack uppercase tracking-widest">Otomasi Email</h4>
            <p className="text-[11px] font-light text-brand-softblack/50 leading-relaxed">
              Sistem akan otomatis mengirimkan email notifikasi ke pelanggan setelah stok diisi ulang di halaman Produk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
