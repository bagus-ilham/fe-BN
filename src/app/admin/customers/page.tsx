import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  UserPlus,
  Download
} from "lucide-react";
import Link from "next/link";

const customers = [
  {
    id: "cus_1",
    name: "Andi Pratama",
    email: "andi@example.com",
    phone: "081234567890",
    total_orders: 12,
    total_spent: 4500000,
    status: "active",
    joined_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "cus_2",
    name: "Siti Aminah",
    email: "siti@example.com",
    phone: "081298765432",
    total_orders: 5,
    total_spent: 1200000,
    status: "active",
    joined_at: "2024-02-20T10:00:00Z"
  },
  {
    id: "cus_3",
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081311223344",
    total_orders: 1,
    total_spent: 199000,
    status: "inactive",
    joined_at: "2024-03-05T10:00:00Z"
  }
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
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
          { label: "Total Pelanggan", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pelanggan Aktif", value: "1,150", icon: Users, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pelanggan Baru (Bulan Ini)", value: "48", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Rata-rata Pesanan", value: "2.4", icon: Filter, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, idx) => (
          <div key={idx} className="surface-card p-6 flex items-center gap-4">
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
      <div className="surface-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-offwhite/30">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
             <input 
               type="text" 
               placeholder="Cari pelanggan berdasarkan nama atau email..."
               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 text-xs focus:ring-1 focus:ring-brand-green/30 outline-none"
             />
           </div>
           <button type="button" className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest text-brand-softblack/60 hover:text-brand-softblack transition-colors">
             <Filter size={14} />
             Filter
           </button>
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
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-brand-offwhite/20 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-offwhite flex items-center justify-center text-[10px] font-medium text-brand-softblack border border-gray-100">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-brand-softblack">{customer.name}</span>
                        <span className="text-[10px] text-brand-softblack/30 mt-0.5">
                          Bergabung {new Date(customer.joined_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
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
                    {customer.total_orders}
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-brand-softblack">
                    Rp {customer.total_spent.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-semibold border rounded-full ${
                      customer.status === 'active' 
                        ? "bg-brand-green/10 text-brand-green border-brand-green/20" 
                        : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-brand-softblack/20 hover:text-brand-softblack hover:bg-gray-50 rounded-full transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
