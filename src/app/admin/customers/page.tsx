import Link from "next/link";
import { getAdminCustomersOverviewPaged } from "@/lib/user-service";
import AdminPagination from "@/components/admin/AdminPagination";
import { buildAdminHref } from "@/lib/admin/build-admin-href";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  UserPlus,
  Download,
  Crown,
} from "lucide-react";

type AdminCustomersPageProps = {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
  }>;
};

function resolveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

const basePath = "/admin/customers";

const tierConfig: Record<string, { classes: string; dot: string }> = {
  Platinum: { classes: "bg-purple-50 text-purple-600 border-purple-200/80", dot: "bg-purple-400" },
  Gold:     { classes: "bg-amber-50 text-amber-600 border-amber-200/80",   dot: "bg-amber-400" },
  Silver:   { classes: "bg-slate-50 text-slate-500 border-slate-200/80",   dot: "bg-slate-400" },
  Bronze:   { classes: "bg-orange-50 text-orange-500 border-orange-200/80", dot: "bg-orange-400" },
};

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const page = Math.max(resolveInt(params?.page, 1), 1);
  const pageSize = Math.min(Math.max(resolveInt(params?.pageSize, 20), 10), 100);
  const q = params?.q?.trim() || "";
  const paged = await getAdminCustomersOverviewPaged({ page, pageSize, q });
  const normalizedCustomers = paged.data;
  const total = paged.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const query = { page: safePage, pageSize, q };
  const getSafeDate = (value?: string | null) => (value ? new Date(value) : null);

  const totalCustomers = total || 0;
  const activeCustomers = normalizedCustomers.filter(c => c.loyalty_points?.[0]?.points > 0).length || 0;
  const thisMonth = new Date(); thisMonth.setDate(1);
  const newCustomersThisMonth = normalizedCustomers.filter((c) => {
    const createdAt = getSafeDate(c.created_at);
    return createdAt ? createdAt >= thisMonth : false;
  }).length || 0;
  const avgPoints = normalizedCustomers.length > 0
    ? Math.round(normalizedCustomers.reduce((acc, curr) => acc + (curr.loyalty_points?.[0]?.points || 0), 0) / normalizedCustomers.length)
    : 0;
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Customer Insights</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Manajemen Pelanggan</h2>
          <p className="text-[11px] text-brand-softblack/40">Kelola data dan interaksi pelanggan benangbaju</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button type="button" className="inline-flex items-center gap-2 bg-[#F4F2EF] text-brand-softblack px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-champagne transition-all border border-brand-softblack/[0.06]">
            <Download size={13} />
            Ekspor
          </button>
          <button type="button" className="group inline-flex items-center gap-2 bg-brand-softblack text-white px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-softblack/20">
            <UserPlus size={13} className="group-hover:scale-110 transition-transform" />
            Tambah
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pelanggan", value: totalCustomers.toLocaleString(), icon: Users, iconClass: "bg-sky-50 text-sky-500" },
          { label: "Pelanggan Loyal", value: activeCustomers.toLocaleString(), icon: Crown, iconClass: "bg-purple-50 text-purple-500" },
          { label: "Baru Bulan Ini", value: newCustomersThisMonth.toLocaleString(), icon: UserPlus, iconClass: "bg-emerald-50 text-emerald-500" },
          { label: "Rata-rata Poin", value: avgPoints.toLocaleString(), icon: Filter, iconClass: "bg-amber-50 text-amber-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconClass}`}>
                <Icon size={17} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1">{stat.label}</div>
                <div className="text-xl font-light text-brand-softblack">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-brand-softblack/[0.05] flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#F4F2EF]/30">
          <form action="/admin/customers" method="get" className="relative flex-1 max-w-sm">
            {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={15} />
            <input 
              type="text" name="q" defaultValue={q}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-brand-softblack/[0.06] text-xs text-brand-softblack placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/30 outline-none transition-all"
            />
          </form>
          <Link
            href={buildAdminHref(basePath, query, { page: 1, q: undefined })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest text-brand-softblack/40 hover:text-brand-softblack bg-white border border-brand-softblack/[0.07] hover:bg-brand-champagne/40 transition-all"
          >
            <Filter size={11} />
            Reset
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-softblack/[0.04]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Pelanggan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Kontak</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35 text-center">Pesanan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Poin</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Tier</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.035]">
              {normalizedCustomers?.map((customer) => {
                const tier = customer.loyalty_points?.[0]?.tier || "Bronze";
                const tierCfg = tierConfig[tier] || tierConfig.Bronze;
                const initials = (customer.full_name || "A").split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase();
                return (
                  <tr key={customer.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-champagne to-brand-offwhite flex items-center justify-center text-[11px] font-bold text-brand-softblack border border-brand-softblack/[0.06] flex-shrink-0">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-medium text-brand-softblack">{customer.full_name || "Anonim"}</span>
                          <span className="text-[9px] text-brand-softblack/35 mt-0.5">
                            Bergabung {getSafeDate(customer.created_at)?.toLocaleDateString("id-ID", { month: "short", year: "numeric" }) || "—"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-brand-softblack/70">
                          <Mail size={11} className="text-brand-softblack/25 flex-shrink-0" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <span className="text-[9px] text-brand-softblack/35">{customer.phone}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-light text-brand-softblack">{customer.orders_count || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-brand-softblack">{(customer.loyalty_points?.[0]?.points || 0).toLocaleString()}</span>
                      <span className="text-[9px] text-brand-softblack/35 ml-1">pts</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${tierCfg.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tierCfg.dot}`} />
                        {tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-brand-softblack/20 hover:text-brand-softblack hover:bg-[#F4F2EF] rounded-xl transition-all">
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {normalizedCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Users size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">
                      {q ? "Tidak ada pelanggan yang cocok." : "Belum ada data pelanggan."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination basePath="/admin/customers" page={safePage} pageSize={pageSize} total={total} query={{ q }} />
      </div>
    </div>
  );
}
