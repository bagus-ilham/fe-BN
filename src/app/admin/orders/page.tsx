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

const orders = [
  {
    id: "ord-12345678",
    user_id: "mock-user",
    created_at: "2024-05-20T10:00:00Z",
    updated_at: "2024-05-20T10:00:00Z",
    customer_name: "Andi Pratama",
    customer_email: "andi@example.com",
    total_amount: 588000,
    status: "paid",
    profiles: { full_name: "Andi Pratama" }
  },
  {
    id: "ord-87654321",
    user_id: "mock-user",
    created_at: "2024-05-19T10:00:00Z",
    updated_at: "2024-05-19T10:00:00Z",
    customer_name: "Siti Aminah",
    customer_email: "siti@example.com",
    total_amount: 389000,
    status: "shipped",
    profiles: { full_name: "Siti Aminah" }
  },
  {
    id: "ord-11223344",
    user_id: "mock-user",
    created_at: "2024-05-18T10:00:00Z",
    updated_at: "2024-05-18T10:00:00Z",
    customer_name: "Budi Santoso",
    customer_email: "budi@example.com",
    total_amount: 199000,
    status: "pending",
    profiles: { full_name: "Budi Santoso" }
  }
];

export default async function AdminOrdersPage() {
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
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
        <div className="surface-card p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Menunggu Pembayaran</div>
            <div className="text-xl font-medium text-brand-softblack">
              {(orders as Order[])?.filter((o: Order) => o.status === 'pending').length || 0}
            </div>
          </div>
        </div>
        <div className="surface-card p-6 flex items-center gap-4">
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Telah Dibayar</div>
            <div className="text-xl font-medium text-brand-softblack">
              {(orders as Order[])?.filter((o: Order) => o.status === 'paid').length || 0}
            </div>
          </div>
        </div>
        <div className="surface-card p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Sedang Dikirim</div>
            <div className="text-xl font-medium text-brand-softblack">
              {(orders as Order[])?.filter((o: Order) => o.status === 'shipped').length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="surface-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-offwhite/30">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <input 
               type="text" 
               placeholder="Cari ID pesanan atau email..."
               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 text-xs focus:ring-1 focus:ring-brand-green/30 outline-none"
             />
           </div>
           <button type="button" className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-brand-softblack/60 hover:text-brand-softblack transition-colors">
             <Filter size={14} />
             Filter Lainnya
           </button>
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
                    Rp {order.total_amount.toLocaleString('id-ID')}
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
                    <p className="text-sm font-light text-brand-softblack/40 italic">Belum ada pesanan yang masuk.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

