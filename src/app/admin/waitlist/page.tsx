import { 
  Bell,
  Mail,
  Calendar,
  TrendingDown,
  Info
} from "lucide-react";

const waitlist = [
  {
    id: "w-1",
    email: "customer1@example.com",
    created_at: "2024-05-20T10:00:00Z",
    notified_at: null,
    products: { name: "Dress Midi Batik Modern" }
  },
  {
    id: "w-2",
    email: "customer2@example.com",
    created_at: "2024-05-19T10:00:00Z",
    notified_at: "2024-05-20T11:00:00Z",
    products: { name: "Blouse Katun Combed" }
  }
];

export default async function AdminWaitlistPage() {
  

  // Calculate popularity
  type WaitlistRow = {
    id: string;
    email: string;
    created_at: string;
    notified_at?: string | null;
    products?: { name?: string | null; image_url?: string | null } | null;
  };

  const productWaitCounts = (waitlist as WaitlistRow[] || []).reduce((acc: Record<string, number>, item: WaitlistRow) => {
    const name = item.products?.name || "Unknown Product";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const sortedWaitlist = Object.entries(productWaitCounts)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
          Waitlist & Peminat Produk
        </h2>
        <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
          Daftar pelanggan yang menunggu stok kembali
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Table List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-brand-offwhite/30 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">
                    <th className="px-6 py-5">Customer Email</th>
                    <th className="px-6 py-5">Requested Product</th>
                    <th className="px-6 py-5">Registration Date</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {(waitlist as WaitlistRow[])?.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-offwhite/10 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-brand-offwhite text-brand-softblack/30">
                            <Mail size={14} />
                          </div>
                          <span className="font-medium text-brand-softblack">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 italic text-brand-softblack/60 font-light">
                        {item.products?.name || 'Memuat produk...'}
                      </td>
                      <td className="px-6 py-5 text-brand-softblack/40 flex items-center gap-2">
                        <Calendar size={12} strokeWidth={1.5} />
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest border font-bold ${item.notified_at ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-brand-offwhite text-brand-softblack/40 border-brand-softblack/10'}`}>
                          {item.notified_at ? 'Diberitahu' : 'Menunggu'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {(!waitlist || waitlist.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center italic text-brand-softblack/30">
                        Belum ada yang mengantre di waitlist.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Insights & Stats */}
        <div className="lg:col-span-1 space-y-8">
           <div className="surface-card bg-brand-softblack p-8 text-brand-offwhite rounded-sm">
             <div className="flex items-center gap-3 mb-8">
               <TrendingDown size={20} className="text-brand-green" />
               <h3 className="text-[10px] uppercase tracking-[0.3em] font-light">Insight Restok</h3>
             </div>
             
             <div className="space-y-6">
                {sortedWaitlist.slice(0, 5).map(([name, count], i) => (
                  <div key={name} className="flex justify-between items-center group">
                    <div className="flex flex-col">
                      <span className="text-xs font-light text-white/50 mb-1 group-hover:text-white transition-colors">#{i+1} {name}</span>
                      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-green" 
                          style={{ width: `${Math.min((count/10) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                    <div className="text-xl font-medium">{count}</div>
                  </div>
                ))}
                
                {sortedWaitlist.length === 0 && (
                  <p className="text-[10px] uppercase tracking-widest text-white/20 italic">Belum ada data permintaan</p>
                )}
             </div>

             <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-3 text-white/40 italic text-[10px]">
               <Info size={14} />
               <p>Gunakan data ini untuk menentukan prioritas produksi selanjutnya.</p>
             </div>
           </div>

           <div className="surface-card p-8 space-y-6">
             <div className="w-12 h-12 rounded-full bg-brand-offwhite flex items-center justify-center text-brand-green">
               <Bell size={24} />
             </div>
             <h4 className="text-sm font-medium text-brand-softblack uppercase tracking-widest">
                Otomasi Email
             </h4>
             <p className="text-xs font-light text-brand-softblack/50 leading-relaxed">
                Sistem akan otomatis mengirimkan email notifikasi ke pelanggan di atas setelah kamu mengisi ulang stok di halaman Produk.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
