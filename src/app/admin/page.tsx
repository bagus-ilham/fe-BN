import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Sparkles,
  CircleAlert,
  CircleCheckBig
} from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";
import { formatPrice } from "@/utils/format";
import { getDashboardStats } from "@/lib/dashboard-service";
import type { DashboardPeriod } from "@/lib/dashboard-service";

interface SummaryCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: ElementType;
  trend?: string;
  isWarning?: boolean;
  helperText: string;
}

function SummaryCard({ title, value, label, icon: Icon, trend, isWarning, helperText }: SummaryCardProps) {
  return (
    <div className="surface-card p-6 md:p-7 border border-gray-100/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-5">
        <div className={`p-3 rounded-xl ${isWarning ? 'bg-red-50 text-red-500' : 'bg-brand-offwhite text-brand-softblack'} group-hover:scale-105 transition-transform duration-300`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        {trend && (
          <span className="text-[10px] font-medium text-brand-green tracking-widest uppercase bg-brand-green/10 px-2.5 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/40 font-medium mb-1.5">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-light text-brand-softblack leading-none">
          {value}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-brand-softblack/35">
          {label}
        </span>
      </div>
      <p className="mt-3 text-xs text-brand-softblack/55 leading-relaxed">
        {helperText}
      </p>
    </div>
  );
}

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    period?: string;
  }>;
};

const periodOptions: Array<{ key: DashboardPeriod; label: string }> = [
  { key: "today", label: "Hari Ini" },
  { key: "7d", label: "7 Hari" },
  { key: "30d", label: "30 Hari" },
];

function resolvePeriod(period?: string): DashboardPeriod {
  if (period === "7d" || period === "30d" || period === "today") {
    return period;
  }
  return "today";
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const selectedPeriod = resolvePeriod(params?.period);
  const stats = await getDashboardStats(selectedPeriod);
  const hasPendingAttention = stats.pendingOrdersCount > 0 || stats.lowStockCount > 0;
  const operationalHealthScore = Math.max(
    0,
    100 - stats.pendingOrdersCount * 4 - stats.lowStockCount * 6
  );
  const healthTone =
    operationalHealthScore >= 80
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : operationalHealthScore >= 55
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-700 bg-red-50 border-red-200";
  const priorityActions = [
    {
      title: "Pesanan menunggu diproses",
      value: stats.pendingOrdersCount,
      href: "/admin/orders",
      cta: "Buka pesanan",
      muted: "Tangani order baru agar SLA pengiriman tetap terjaga.",
    },
    {
      title: "Produk hampir habis",
      value: stats.lowStockCount,
      href: "/admin/inventory",
      cta: "Cek inventaris",
      muted: "Segera restock item kritis untuk mencegah lost sales.",
    },
  ];
  const hasUrgentPriorities = priorityActions.some((item) => item.value > 0);
  const salesLabel =
    selectedPeriod === "today"
      ? "Hari Ini"
      : selectedPeriod === "7d"
        ? "7 Hari"
        : "30 Hari";

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Welcome Section */}
      <section className="surface-card border border-gray-100/80 p-5 md:p-9">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35 mb-3">
              Admin Command Center
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-brand-softblack tracking-tight mb-3">
              Selamat Datang, <span className="font-normal italic">Admin</span>
            </h2>
            <p className="text-sm font-light text-brand-softblack/55 leading-relaxed max-w-2xl">
              Pantau performa toko benangbaju, evaluasi risiko operasional, dan jalankan tindakan cepat dari satu dashboard yang konsisten.
            </p>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border ${
            hasPendingAttention
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-brand-green/10 text-brand-green border-brand-green/20"
          }`}>
            <Sparkles size={14} />
            {hasPendingAttention ? "Perlu Tindakan" : "Semua Stabil"}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {periodOptions.map((option) => {
            const isActive = selectedPeriod === option.key;
            return (
              <Link
                key={option.key}
                href={`/admin?period=${option.key}`}
                className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest transition-colors border ${
                  isActive
                    ? "bg-brand-softblack text-white border-brand-softblack"
                    : "bg-white text-brand-softblack/60 border-gray-200 hover:text-brand-softblack hover:border-gray-300"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white/90 px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/35">Insight Mingguan</p>
            <p className="mt-1 text-sm text-brand-softblack/70">Arus order stabil, fokus percepat fulfillment.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/90 px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/35">Target Operasional</p>
            <p className="mt-1 text-sm text-brand-softblack/70">Pending order ideal di bawah 5 order.</p>
          </div>
          <div className={`rounded-xl border px-4 py-3 ${healthTone}`}>
            <p className="text-[10px] uppercase tracking-widest">Skor Kesehatan Operasi</p>
            <p className="mt-1 text-sm font-medium">{operationalHealthScore}/100</p>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <SummaryCard 
          title="Total Produk" 
          value={stats.productCount} 
          label="Items" 
          icon={Package} 
          helperText="Jumlah seluruh produk aktif yang tampil di katalog."
        />
        <SummaryCard 
          title="Pesanan Baru" 
          value={stats.pendingOrdersCount} 
          label="Pending" 
          icon={ShoppingCart} 
          trend="LIVE"
          helperText="Order yang butuh konfirmasi pembayaran atau proses lanjutan."
        />
        <SummaryCard 
          title={`Penjualan ${salesLabel}`}
          value={formatPrice(stats.totalSalesInPeriod)}
          label="Gross" 
          icon={TrendingUp} 
          helperText={`Akumulasi nilai penjualan ${salesLabel.toLowerCase()} sebelum potongan.`}
        />
        <SummaryCard 
          title="Stok Berbahaya" 
          value={stats.lowStockCount} 
          label="Low Stock" 
          icon={AlertTriangle} 
          isWarning={true}
          helperText="Produk prioritas yang stoknya sudah melewati ambang aman."
        />
      </div>

      {/* Priority + Quick Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">
        <div className="lg:col-span-2 space-y-5 md:space-y-6">
          <section className="surface-card border border-gray-100/80 p-5 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-offwhite flex items-center justify-center">
                <Clock3 size={18} className="text-brand-softblack/50" />
              </div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-brand-softblack/60">
                Snapshot Operasional
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-brand-offwhite/70 p-5">
                <p className="text-[10px] uppercase tracking-widest text-brand-softblack/35 mb-2">Produk Aktif</p>
                <p className="text-2xl font-light text-brand-softblack">{stats.productCount}</p>
              </div>
              <div className="rounded-2xl bg-brand-offwhite/70 p-5">
                <p className="text-[10px] uppercase tracking-widest text-brand-softblack/35 mb-2">Order Pending</p>
                <p className="text-2xl font-light text-brand-softblack">{stats.pendingOrdersCount}</p>
              </div>
              <div className="rounded-2xl bg-brand-offwhite/70 p-5">
                <p className="text-[10px] uppercase tracking-widest text-brand-softblack/35 mb-2">Low Stock</p>
                <p className="text-2xl font-light text-brand-softblack">{stats.lowStockCount}</p>
              </div>
            </div>
          </section>

          <section className="surface-card border border-gray-100/80 p-5 md:p-10">
            <h3 className="text-sm uppercase tracking-[0.2em] text-brand-softblack/60 mb-6">
              Prioritas Hari Ini
            </h3>
            {!hasUrgentPriorities ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <CircleCheckBig size={18} className="mt-1 text-emerald-700" />
                  <div>
                    <p className="text-sm font-medium text-brand-softblack">
                      Tidak ada prioritas kritis saat ini
                    </p>
                    <p className="mt-1 text-xs text-brand-softblack/60">
                      Semua indikator utama dalam kondisi aman. Anda bisa lanjut optimasi katalog atau kampanye marketing.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {priorityActions.map((item) => {
                  const isUrgent = item.value > 0;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-2xl border p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                        isUrgent
                          ? "border-amber-200 bg-amber-50/60"
                          : "border-emerald-200 bg-emerald-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 ${isUrgent ? "text-amber-700" : "text-emerald-700"}`}
                          aria-hidden
                        >
                          {isUrgent ? <CircleAlert size={18} /> : <CircleCheckBig size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-softblack">{item.title}</p>
                          <p className="text-xs text-brand-softblack/60 mt-1">{item.muted}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                        <span className="text-2xl font-light text-brand-softblack">{item.value}</span>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-softblack/70 hover:text-brand-softblack transition-colors"
                        >
                          {item.cta}
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="bg-brand-softblack p-5 md:p-10 flex flex-col justify-between text-brand-offwhite">
          <div>
            <h3 className="text-lg font-light uppercase tracking-[0.2em] mb-8">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Link href="/admin/products/new" className="w-full flex items-center justify-between py-4 px-5 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                <span>+ Tambah Produk Baru</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link href="/admin/orders" className="w-full flex items-center justify-between py-4 px-5 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                <span>Lihat Pesanan Tertunda</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link href="/admin/waitlist" className="w-full flex items-center justify-between py-4 px-5 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                <span>Cek Waitlist Terbaru</span>
                <ArrowUpRight size={14} />
              </Link>
              <Link href="/admin/reviews" className="w-full flex items-center justify-between py-4 px-5 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest font-light">
                <span>Moderasi Ulasan</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              Benangbaju Admin
            </p>
            <p className="mt-2 text-xs text-white/45 leading-relaxed">
              Fokus pada area prioritas untuk menjaga pengalaman belanja tetap konsisten.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

