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

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-600 border-amber-200/80",        dot: "bg-amber-400" },
  paid:      { label: "Dibayar",   classes: "bg-emerald-50 text-emerald-600 border-emerald-200/80",  dot: "bg-emerald-400" },
  shipped:   { label: "Dikirim",   classes: "bg-sky-50 text-sky-600 border-sky-200/80",              dot: "bg-sky-400" },
  delivered: { label: "Selesai",   classes: "bg-brand-softblack/90 text-brand-offwhite border-brand-softblack/80", dot: "bg-brand-gold" },
  cancelled: { label: "Dibatalkan", classes: "bg-red-50 text-red-500 border-red-200/80",             dot: "bg-red-400" },
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
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">
            Orders Control Room
          </p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">
            Monitoring Pesanan
          </h2>
          <p className="text-[11px] text-brand-softblack/40">
            Pantau dan kelola seluruh transaksi benangbaju
          </p>
        </div>
        
        <button 
          type="button" 
          className="group inline-flex items-center gap-2 bg-[#F4F2EF] text-brand-softblack px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-champagne transition-all border border-brand-softblack/[0.06] self-start"
        >
          <Download size={14} />
          Ekspor CSV
        </button>
      </div>

      {/* Summary Cards Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Clock, label: "Menunggu Pembayaran", value: pendingCount, iconClass: "bg-amber-50 text-amber-500", valueClass: pendingCount > 0 ? "text-amber-600" : "text-brand-softblack" },
          { icon: CheckCircle2, label: "Telah Dibayar", value: paidCount, iconClass: "bg-emerald-50 text-emerald-500", valueClass: "text-brand-softblack" },
          { icon: Truck, label: "Sedang Dikirim", value: shippedCount, iconClass: "bg-sky-50 text-sky-500", valueClass: "text-brand-softblack" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${card.iconClass}`}>
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-brand-softblack/40 mb-1">{card.label}</div>
                <div className={`text-2xl font-light ${card.valueClass}`}>{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        {/* Table toolbar */}
        <div className="p-4 border-b border-brand-softblack/[0.05] flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#F4F2EF]/40">
          <form action="/admin/orders" method="get" className="relative flex-1 max-w-sm">
            {status && <input type="hidden" name="status" value={status} />}
            {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={15} />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari ID pesanan atau email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-brand-softblack/[0.06] text-xs text-brand-softblack placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/30 outline-none transition-all"
            />
          </form>
          <div className="flex items-center gap-2 flex-wrap">
            {(["pending", "paid", "shipped"] as AdminOrderStatus[]).map((s) => (
              <Link
                key={s}
                href={buildAdminHref(basePath, query, { page: 1, status: s })}
                className={`px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest transition-all ${
                  status === s
                    ? "bg-brand-softblack text-white shadow-sm"
                    : "bg-white text-brand-softblack/55 border border-brand-softblack/[0.07] hover:bg-brand-champagne/40"
                }`}
              >
                {statusConfig[s]?.label || s}
              </Link>
            ))}
            <Link
              href={buildAdminHref(basePath, query, { page: 1, status: undefined })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest text-brand-softblack/40 hover:text-brand-softblack bg-white border border-brand-softblack/[0.07] hover:bg-brand-champagne/40 transition-all"
            >
              <Filter size={11} />
              Reset
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-softblack/[0.04]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Order ID & Tanggal</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Pelanggan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Item</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Total</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.035]">
              {(orders as unknown as OrderRow[])?.map((order) => {
                const cfg = statusConfig[order.status] || { label: order.status, classes: "bg-gray-50 text-gray-500 border-gray-200", dot: "bg-gray-400" };
                return (
                  <tr key={order.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-brand-softblack tracking-wider">
                          #{order.id.split("-")[0].toUpperCase()}
                        </span>
                        <span className="text-[9px] text-brand-softblack/35 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-brand-softblack">
                          {order.profiles?.full_name || order.customer_name || "Pelanggan Tamu"}
                        </span>
                        <span className="text-[9px] text-brand-softblack/35 lowercase mt-0.5">
                          {order.customer_email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-xl bg-[#F4F2EF] flex items-center justify-center border border-brand-softblack/[0.05] group-hover:bg-brand-champagne/50 transition-colors">
                        <ShoppingBag size={13} className="text-brand-softblack/40 group-hover:text-brand-green transition-colors" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-brand-softblack">{formatPrice(order.total_amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-widest font-semibold border rounded-full ${cfg.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center p-2 text-brand-softblack/25 hover:text-brand-green hover:bg-brand-champagne/40 rounded-xl transition-all"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <ShoppingBag size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">
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
