import { listEmailSequences } from "@/lib/application/marketing/marketing-query-service";
import { Mail, Play, Pause, Settings, Send, Clock, CheckCircle2, PlusCircle } from "lucide-react";

export default async function AdminAutomationPage() {
  const sequences = await listEmailSequences();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Lifecycle Automation
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Otomasi Email & Marketing
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Kelola alur komunikasi otomatis ke pelanggan
          </p>
        </div>
      </div>

      {/* Grid Sequences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sequences?.map((seq: any) => (
          <div key={seq.id} className="surface-card p-8 border border-gray-100 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${seq.status === 'sent' ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
                  <Mail size={24} />
                </div>
                <div className="flex gap-2 text-[10px] text-brand-softblack/30 font-bold uppercase tracking-widest">
                  Scheduled for {new Date(seq.send_at).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-brand-softblack mb-2">{seq.sequence_type}</h3>
              <p className="text-sm text-brand-softblack/50 font-light leading-relaxed mb-8">
                Target: {seq.customer_email} <br/>
                Order: {seq.order_id}
              </p>
            </div>
            
            <div className="mt-8 flex items-center justify-between">
              <span className={`text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-sm ${
                seq.status === 'sent' ? 'bg-brand-green text-white' : 'bg-amber-400 text-white'
              }`}>
                {seq.status}
              </span>
            </div>
          </div>
        ))}
        {(!sequences || sequences.length === 0) && (
          <div className="surface-card p-10 border border-gray-100 text-center text-sm text-brand-softblack/40 italic">
            Belum ada jadwal otomasi email.
          </div>
        )}

        {/* Add New Placeholder */}
        <div className="surface-card p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4 hover:border-brand-green/30 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center group-hover:bg-brand-green/10 group-hover:text-brand-green transition-all">
            <PlusCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-brand-softblack">Tambah Alur Baru</h4>
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/30 mt-1">Buat otomatisasi kustom</p>
          </div>
        </div>
      </div>
    </div>
  );
}

