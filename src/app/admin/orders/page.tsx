import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Download
} from "lucide-react";
import { Order } from "@/types/database";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import AdminPagination from "@/components/admin/AdminPagination";
import { buildAdminHref } from "@/lib/admin/build-admin-href";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  paid: "bg-brand-green/10 text-brand-green border-brand-green/20",
  shipped: "bg-blue-50 text-blue-600 border-blue-100",
  delivered: "bg-brand-softblack text-brand-offwhite border-brand-softblack",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

type OrderRow = Order & {
  profiles?: { full_name?: string | null } | null;
};

import { getAdminOrderStatusCounts, listOrdersForAdminPaged } from "@/lib/order-service";
import type { AdminOrderStatus } from "@/lib/order-service";

type AdminOrdersPageProps = {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
    status?: string;
    q?: string;
  }>;
};

const allowedStatuses: AdminOrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

function resolveInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function resolveStatus(value: string | undefined): AdminOrderStatus | undefined {
  if (!value) return undefined;
  return (allowedStatuses as string[]).includes(value) ? (value as AdminOrderStatus) : undefined;
}

const basePath = "/admin/orders";

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const page = Math.max(resolveInt(params?.page, 1), 1);
  const pageSize = Math.min(Math.max(resolveInt(params?.pageSize, 20), 10), 100);
  const status = resolveStatus(params?.status);
  const q = params?.q?.trim() || "";

  const [counts, paged] = await Promise.all([
    getAdminOrderStatusCounts(),
    listOrdersForAdminPaged({ page, pageSize, status, q }),
  ]);

  const orders = paged.data;
  const total = paged.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const query = { page: safePage, pageSize, status, q };
  const pendingCount = counts.pending;
  const paidCount = counts.paid;
  const shippedCount = counts.shipped;
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Orders Control Room
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Monitoring Pesanan
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Pantau dan kelola urutan transaksi benangbaju
          </p>
        </div>
        
        <button type="button" className="bg-brand-offwhite text-brand-softblack px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium border border-gray-100 hover:bg-brand-softblack hover:text-white transition-all duration-500 flex items-center gap-2 self-start">
          <Download size={14} />
          Ekspor CSV
        </button>
      </div>

      {/* Summary Cards Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card border border-gray-100/80 p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Menunggu Pembayaran</div>
            <div className="text-xl font-medium text-brand-softblack">{pendingCount}</div>
          </div>
        </div>
        <div className="surface-card border border-gray-100/80 p-6 flex items-center gap-4">
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Telah Dibayar</div>
            <div className="text-xl font-medium text-brand-softblack">{paidCount}</div>
          </div>
        </div>
        <div className="surface-card border border-gray-100/80 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Sedang Dikirim</div>
            <div className="text-xl font-medium text-brand-softblack">{shippedCount}</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-offwhite/30">
           <form action="/admin/orders" method="get" className="relative flex-1 max-w-md">
             {status && <input type="hidden" name="status" value={status} />}
             {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <input
               type="text"
               name="q"
               defaultValue={q}
               placeholder="Cari ID pesanan atau email..."
               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 text-xs focus:ring-1 focus:ring-brand-green/30 outline-none"
             />
           </form>
           <div className="flex items-center gap-2">
             <Link
              href={buildAdminHref(basePath, query, { page: 1, status: "pending" })}
               className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
                 status === "pending"
                   ? "bg-brand-softblack text-white border-brand-softblack"
                   : "bg-white text-brand-softblack/60 border-gray-100 hover:text-brand-softblack"
               }`}
             >
               Pending
             </Link>
             <Link
              href={buildAdminHref(basePath, query, { page: 1, status: "paid" })}
               className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
                 status === "paid"
                   ? "bg-brand-softblack text-white border-brand-softblack"
                   : "bg-white text-brand-softblack/60 border-gray-100 hover:text-brand-softblack"
               }`}
             >
               Paid
             </Link>
             <Link
              href={buildAdminHref(basePath, query, { page: 1, status: "shipped" })}
               className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
                 status === "shipped"
                   ? "bg-brand-softblack text-white border-brand-softblack"
                   : "bg-white text-brand-softblack/60 border-gray-100 hover:text-brand-softblack"
               }`}
             >
               Shipped
             </Link>
             <Link
              href={buildAdminHref(basePath, query, { page: 1, status: undefined })}
               className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-brand-softblack/60 hover:text-brand-softblack transition-colors"
             >
               <Filter size={14} />
               Reset
             </Link>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Order ID & Date</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Customer</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Items</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Total Amount</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders as unknown as OrderRow[])?.map((order) => (
                <tr key={order.id} className="hover:bg-brand-offwhite/20 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-brand-softblack truncate max-w-[120px]">
                        #{order.id.split('-')[0].toUpperCase()}
                      </span>
                      <span className="text-[10px] text-brand-softblack/30 mt-1">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-brand-softblack">
                        {order.profiles?.full_name || order.customer_name || 'Pelanggan Tamu'}
                      </span>
                      <span className="text-[10px] text-brand-softblack/40 lowercase">
                        {order.customer_email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center border border-brand-softblack/5 group-hover:bg-brand-green/10 transition-colors">
                      <ShoppingBag size={14} className="text-brand-softblack/40 group-hover:text-brand-green" />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-brand-softblack">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-semibold border rounded-full ${statusStyles[order.status] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="p-2 text-brand-softblack/20 hover:text-brand-green hover:bg-brand-green/5 rounded-full transition-all inline-block"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}

              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-sm font-light text-brand-softblack/40 italic">
                      {q || status ? "Tidak ada hasil yang cocok dengan filter saat ini." : "Belum ada pesanan yang masuk."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          basePath="/admin/orders"
          page={safePage}
          pageSize={pageSize}
          total={total}
          query={{
            status,
            q,
          }}
        />
      </div>
    </div>
  );
}

