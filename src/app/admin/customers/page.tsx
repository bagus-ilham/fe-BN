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
  Download
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

  // Calculate real stats
  const totalCustomers = total || 0;
  const activeCustomers = normalizedCustomers.filter(c => c.loyalty_points?.[0]?.points > 0).length || 0;
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newCustomersThisMonth =
    normalizedCustomers.filter((c) => {
      const createdAt = getSafeDate(c.created_at);
      return createdAt ? createdAt >= thisMonth : false;
    }).length || 0;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Customer Insights
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Manajemen Pelanggan
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Kelola data dan interaksi pelanggan benangbaju
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button type="button" className="bg-brand-offwhite text-brand-softblack px-4 py-2 text-[10px] uppercase tracking-widest font-medium border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download size={14} />
            Ekspor
          </button>
          <button type="button" className="bg-brand-softblack text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-brand-softblack/90 transition-all flex items-center gap-2">
            <UserPlus size={14} />
            Tambah Pelanggan
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Pelanggan", value: totalCustomers.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pelanggan Loyal", value: activeCustomers.toLocaleString(), icon: Users, color: "text-green-600", bg: "bg-green-50" },
          { label: "Baru (Bulan Ini)", value: newCustomersThisMonth.toLocaleString(), icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" },
            {
              label: "Rata-rata Poin",
              value:
                normalizedCustomers.length > 0
                  ? Math.round(
                      normalizedCustomers.reduce((acc, curr) => acc + (curr.loyalty_points?.[0]?.points || 0), 0) /
                        normalizedCustomers.length
                    )
                  : 0,
              icon: Filter,
              color: "text-purple-600",
              bg: "bg-purple-50",
            }
        ].map((stat, idx) => (
          <div key={idx} className="surface-card border border-gray-100/80 p-6 flex items-center gap-4">
            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">{stat.label}</div>
              <div className="text-xl font-medium text-brand-softblack">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-offwhite/30">
           <form action="/admin/customers" method="get" className="relative flex-1 max-w-md">
             {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <input 
               type="text" 
               name="q"
               defaultValue={q}
               placeholder="Cari pelanggan berdasarkan nama atau email..."
               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 text-xs focus:ring-1 focus:ring-brand-green/30 outline-none"
             />
           </form>
           <Link
             href={buildAdminHref(basePath, query, { page: 1, q: undefined })}
             className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-brand-softblack/60 hover:text-brand-softblack transition-colors"
           >
             <Filter size={14} />
             Reset
           </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Pelanggan</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Kontak</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-center">Pesanan</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Total Belanja</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {normalizedCustomers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-brand-offwhite/20 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center text-[10px] font-medium text-brand-softblack border border-gray-100">
                        {(customer.full_name || 'A').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-brand-softblack">{customer.full_name || "Anonim"}</span>
                        <span className="text-[10px] text-brand-softblack/30 mt-0.5">
                          Bergabung {getSafeDate(customer.created_at)?.toLocaleDateString("id-ID", { month: "short", year: "numeric" }) || "-"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-xs text-brand-softblack">
                        <Mail size={12} className="text-brand-softblack/20" />
                        {customer.email}
                      </div>
                      <span className="text-[10px] text-brand-softblack/40 mt-1">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-xs text-brand-softblack">
                    {customer.orders_count || 0}
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-brand-softblack">
                    {customer.loyalty_points?.[0]?.points || 0} Pts
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-semibold border rounded-full ${
                      customer.loyalty_points?.[0]?.tier === 'Platinum' 
                        ? "bg-brand-green/10 text-brand-green border-brand-green/20" 
                        : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                      {customer.loyalty_points?.[0]?.tier || 'Bronze'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-brand-softblack/20 hover:text-brand-softblack hover:bg-gray-50 rounded-full transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {normalizedCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-sm text-brand-softblack/40 italic">
                    {q ? "Tidak ada pelanggan yang cocok dengan pencarian." : "Belum ada data pelanggan."}
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
