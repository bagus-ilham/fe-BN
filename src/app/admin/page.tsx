import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: React.ElementType;
  trend?: string;
  isWarning?: boolean;
}

function SummaryCard({ title, value, label, icon: Icon, trend, isWarning }: SummaryCardProps) {
  return (
    <div className="surface-card p-8 hover:shadow-md transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${isWarning ? 'bg-red-50 text-red-500' : 'bg-brand-offwhite text-brand-softblack'} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        {trend && (
          <span className="text-[10px] font-medium text-brand-green tracking-widest uppercase bg-brand-green/5 px-3 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/40 font-medium mb-1">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-light text-brand-softblack leading-none">
          {value}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-brand-softblack/30">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-light text-brand-softblack tracking-tight mb-2">
          Selamat Datang, <span className="font-normal italic">Admin</span>
        </h2>
        <p className="text-sm font-light text-brand-softblack/50 leading-relaxed max-w-2xl">
          Pantau performa toko benangbaju dan kelola stok serta pesanan dalam satu tempat. 
          Semuanya sudah dikonfigurasi untuk kenyamanan manajemen operasional.
        </p>
      </section>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Produk" 
          value="48" 
          label="Items" 
          icon={Package} 
        />
        <SummaryCard 
          title="Pesanan Baru" 
          value="12" 
          label="Pending" 
          icon={ShoppingCart} 
          trend="+4 TODAY"
        />
        <SummaryCard 
          title="Penjualan Hari Ini" 
          value="Rp 2.4jt" 
          label="Gross" 
          icon={TrendingUp} 
        />
        <SummaryCard 
          title="Stok Berbahaya" 
          value="3" 
          label="Low Stock" 
          icon={AlertTriangle} 
          isWarning={true}
        />
      </div>

      {/* Placeholder for Quick Actions or Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 surface-card p-10 min-h-[400px] flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-brand-offwhite rounded-full flex items-center justify-center mb-6">
            <TrendingUp size={32} className="text-brand-softblack/20" />
          </div>
          <h3 className="text-lg font-light text-brand-softblack mb-2 uppercase tracking-widest">
            Aktivitas Penjualan
          </h3>
          <p className="text-sm font-light text-brand-softblack/40 max-w-sm">
            Grafik penjualan akan muncul di sini setelah data transaksi mencukupi.
          </p>
        </div>

        <div className="bg-brand-softblack p-10 flex flex-col justify-between text-brand-offwhite">
          <div>
            <h3 className="text-lg font-light uppercase tracking-[0.2em] mb-8">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left py-4 px-6 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                + Tambah Produk Baru
              </button>
              <button className="w-full text-left py-4 px-6 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                Lihat Pesanan Tertunda
              </button>
              <button className="w-full text-left py-4 px-6 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                Cek Waitlist Terbaru
              </button>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              System Version v1.0.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

