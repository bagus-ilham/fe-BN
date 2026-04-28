import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Sparkles,
  CircleAlert,
  CircleCheckBig,
  BarChart2,
  Activity,
  Zap,
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
  accent?: string;
}

function SummaryCard({ title, value, label, icon: Icon, trend, isWarning, helperText, accent }: SummaryCardProps) {
  return (
    <div className={`
      relative bg-white rounded-2xl p-6 border overflow-hidden
      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group
      ${isWarning ? "border-red-100/80" : "border-brand-softblack/[0.06]"}
    `}>
      {/* Decorative background circle */}
      <div className={`
        absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.06] transition-all duration-500 group-hover:opacity-[0.1] group-hover:scale-110
        ${isWarning ? "bg-red-500" : accent || "bg-brand-gold"}
      `} />
      
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className={`
          p-3 rounded-xl transition-all duration-300 group-hover:scale-110
          ${isWarning 
            ? "bg-red-50 text-red-500" 
            : accent === "emerald" 
              ? "bg-emerald-50 text-emerald-600"
              : "bg-brand-champagne/60 text-brand-green"
          }
        `}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        {trend && (
          <span className="text-[9px] font-semibold text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-[9px] uppercase tracking-[0.25em] text-brand-softblack/40 font-medium mb-2">
          {title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-light text-brand-softblack leading-none">
            {value}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-brand-softblack/30">
            {label}
          </span>
        </div>
        <p className="text-[11px] text-brand-softblack/45 leading-relaxed">
          {helperText}
        </p>
      </div>
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
      ? { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Sehat", pct: operationalHealthScore }
      : operationalHealthScore >= 55
        ? { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "Perlu Perhatian", pct: operationalHealthScore }
        : { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", label: "Kritis", pct: operationalHealthScore };

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
    <div className="space-y-6 md:space-y-8 -mt-2">
      {/* Welcome Section */}
      <section className="bg-brand-softblack rounded-2xl p-6 md:p-8 text-brand-offwhite relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/70" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-brand-offwhite/40">
                Admin Command Center
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-brand-offwhite tracking-tight mb-3">
              Selamat Datang, <span className="font-normal italic text-brand-gold/90">Admin</span>
            </h2>
            <p className="text-sm font-light text-brand-offwhite/50 leading-relaxed max-w-xl">
              Pantau performa toko benangbaju dan jalankan tindakan cepat dari satu dashboard yang konsisten.
            </p>
          </div>

          <div className={`
            inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[9px] uppercase tracking-widest border self-start lg:self-auto
            ${hasPendingAttention
              ? "bg-amber-400/15 text-amber-300 border-amber-400/25"
              : "bg-emerald-400/15 text-emerald-300 border-emerald-400/25"
            }
          `}>
            <Sparkles size={12} />
            {hasPendingAttention ? "Perlu Tindakan" : "Semua Stabil"}
          </div>
        </div>

        {/* Period filter & Quick metrics row */}
        <div className="relative z-10 mt-7 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          {/* Period buttons */}
          <div className="flex items-center gap-2">
            {periodOptions.map((option) => {
              const isActive = selectedPeriod === option.key;
              return (
                <Link
                  key={option.key}
                  href={`/admin?period=${option.key}`}
                  className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all duration-200 border ${
                    isActive
                      ? "bg-brand-gold text-brand-softblack border-brand-gold font-semibold shadow-lg shadow-brand-gold/20"
                      : "bg-white/[0.07] text-white/50 border-white/[0.08] hover:text-white/80 hover:bg-white/[0.1]"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          {/* Mini insight tags */}
          <div className="flex flex-wrap items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1.5 text-white/35">
              <BarChart2 size={11} />
              <span>Skor Operasional:</span>
              <span className={`font-semibold ${healthTone.text.replace("text-", "text-")} text-white/80`}>
                {operationalHealthScore}/100
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider ${
                operationalHealthScore >= 80 
                  ? "bg-emerald-400/20 text-emerald-300" 
                  : operationalHealthScore >= 55 
                    ? "bg-amber-400/20 text-amber-300" 
                    : "bg-red-400/20 text-red-300"
              }`}>
                {healthTone.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
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
          accent="emerald"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Priority Panel (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Operational Snapshot */}
          <section className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-offwhite flex items-center justify-center">
                  <Activity size={16} className="text-brand-softblack/50" />
                </div>
                <h3 className="text-[10px] uppercase tracking-[0.22em] text-brand-softblack/55 font-medium">
                  Snapshot Operasional
                </h3>
              </div>
              <Clock3 size={14} className="text-brand-softblack/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Produk Aktif", value: stats.productCount, color: "bg-brand-champagne/60 text-brand-green" },
                { label: "Order Pending", value: stats.pendingOrdersCount, color: stats.pendingOrdersCount > 0 ? "bg-amber-50 text-amber-600" : "bg-brand-champagne/60 text-brand-green" },
                { label: "Low Stock", value: stats.lowStockCount, color: stats.lowStockCount > 0 ? "bg-red-50 text-red-500" : "bg-brand-champagne/60 text-brand-green" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#F4F2EF] p-5 flex flex-col gap-3">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-brand-softblack/35">{item.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-light text-brand-softblack">{item.value}</p>
                    <div className={`px-2 py-1 rounded-lg text-[9px] font-medium uppercase tracking-wide ${item.color}`}>
                      {item.value === 0 ? "aman" : "aktif"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Priority Actions */}
          <section className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand-offwhite flex items-center justify-center">
                <Zap size={16} className="text-brand-softblack/50" />
              </div>
              <h3 className="text-[10px] uppercase tracking-[0.22em] text-brand-softblack/55 font-medium">
                Prioritas Hari Ini
              </h3>
            </div>

            {!hasUrgentPriorities ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                <div className="flex items-start gap-3">
                  <CircleCheckBig size={17} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-brand-softblack">
                      Tidak ada prioritas kritis saat ini
                    </p>
                    <p className="mt-1 text-xs text-brand-softblack/55">
                      Semua indikator utama dalam kondisi aman. Lanjut optimasi katalog atau kampanye marketing.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {priorityActions.map((item) => {
                  const isUrgent = item.value > 0;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-xl border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                        isUrgent
                          ? "border-amber-200 bg-amber-50/60"
                          : "border-emerald-200 bg-emerald-50/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 ${isUrgent ? "text-amber-600" : "text-emerald-600"}`}>
                          {isUrgent ? <CircleAlert size={17} /> : <CircleCheckBig size={17} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-softblack">{item.title}</p>
                          <p className="text-xs text-brand-softblack/55 mt-0.5">{item.muted}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-5">
                        <span className="text-3xl font-light text-brand-softblack">{item.value}</span>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-brand-softblack/60 hover:text-brand-softblack transition-colors border border-brand-softblack/15 px-3 py-1.5 rounded-lg hover:bg-brand-offwhite"
                        >
                          {item.cta}
                          <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Quick Actions (1/3) */}
        <aside className="bg-brand-softblack rounded-2xl p-6 flex flex-col relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-2">
              {[
                { label: "+ Tambah Produk Baru", href: "/admin/products/new" },
                { label: "Lihat Pesanan Tertunda", href: "/admin/orders" },
                { label: "Cek Waitlist Terbaru", href: "/admin/waitlist" },
                { label: "Moderasi Ulasan", href: "/admin/reviews" },
                { label: "Kelola Flash Sales", href: "/admin/flash-sales" },
              ].map((action) => (
                <Link 
                  key={action.href}
                  href={action.href} 
                  className="w-full flex items-center justify-between py-3.5 px-4 rounded-xl border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200 text-[11px] uppercase tracking-wider font-light text-white/60 hover:text-white/90 group"
                >
                  <span>{action.label}</span>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 translate-x-0.5 group-hover:translate-x-0 transition-all duration-200 text-brand-gold/70" />
                </Link>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-6 border-t border-white/[0.08]">
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/25">
              Benangbaju Admin
            </p>
            <p className="mt-1.5 text-[11px] text-white/35 leading-relaxed">
              Fokus pada area prioritas untuk menjaga pengalaman belanja tetap konsisten.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
