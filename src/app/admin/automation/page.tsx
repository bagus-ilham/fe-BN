import { listEmailSequences } from "@/lib/application/marketing/marketing-query-service";
import { Mail, PlusCircle, CheckCircle2, Clock } from "lucide-react";

export default async function AdminAutomationPage() {
  const sequences = await listEmailSequences();
  const sentCount = sequences?.filter((s: any) => s.status === "sent").length || 0;
  const pendingCount = sequences?.filter((s: any) => s.status !== "sent").length || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Lifecycle Automation</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Otomasi Email & Marketing</h2>
          <p className="text-[11px] text-brand-softblack/40">Kelola alur komunikasi otomatis ke pelanggan</p>
        </div>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Sequence", value: sequences?.length || 0, icon: Mail, iconClass: "bg-sky-50 text-sky-500" },
          { label: "Terkirim", value: sentCount, icon: CheckCircle2, iconClass: "bg-emerald-50 text-emerald-500" },
          { label: "Terjadwal", value: pendingCount, icon: Clock, iconClass: "bg-amber-50 text-amber-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconClass}`}><Icon size={17} strokeWidth={1.5} /></div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1">{stat.label}</div>
                <div className="text-xl font-light text-brand-softblack">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sequence cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sequences?.map((seq: any) => {
          const isSent = seq.status === "sent";
          return (
            <div key={seq.id} className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col justify-between hover:shadow-md transition-all group">
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${isSent ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"}`}>
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-brand-softblack/30">
                    <Clock size={10} className="inline mr-1" />
                    {new Date(seq.send_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-brand-softblack mb-2 uppercase tracking-wider">{seq.sequence_type}</h3>
                <div className="space-y-1 text-[10px] text-brand-softblack/40">
                  <p>Target: <span className="text-brand-softblack/70">{seq.customer_email}</span></p>
                  <p>Order: <span className="text-brand-softblack/70 font-mono">{seq.order_id?.slice(0, 8)}</span></p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-softblack/[0.05] flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${
                  isSent
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                    : "bg-amber-50 text-amber-600 border-amber-200/80"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSent ? "bg-emerald-400" : "bg-amber-400"}`} />
                  {isSent ? "Terkirim" : "Terjadwal"}
                </span>
              </div>
            </div>
          );
        })}

        {(!sequences || sequences.length === 0) && (
          <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-16 text-center">
            <Mail size={32} className="mx-auto mb-3 text-brand-softblack/15" />
            <p className="text-sm text-brand-softblack/35">Belum ada jadwal otomasi email.</p>
          </div>
        )}

        {/* Add New */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-brand-softblack/[0.08] p-8 flex flex-col items-center justify-center text-center space-y-3 hover:border-brand-gold/40 transition-colors cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-[#F4F2EF] text-brand-softblack/25 flex items-center justify-center group-hover:bg-brand-champagne/60 group-hover:text-brand-green transition-all">
            <PlusCircle size={20} />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-brand-softblack/50 uppercase tracking-widest">Tambah Alur Baru</h4>
            <p className="text-[9px] uppercase tracking-widest text-brand-softblack/25 mt-1">Buat otomatisasi kustom</p>
          </div>
        </div>
      </div>
    </div>
  );
}
