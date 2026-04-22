import { getAdminAbandonedCheckoutOverview } from "@/lib/application/marketing/marketing-query-service";
import { formatPrice } from "@/utils/format";
import { ShoppingCart, Mail, ArrowRight } from "lucide-react";

export default async function AdminAbandonedCartsPage() {
  const { rows, stats } = await getAdminAbandonedCheckoutOverview();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Keranjang Terabaikan
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Pantau dan pulihkan transaksi yang tidak selesai
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-brand-softblack/5 text-brand-softblack px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-softblack hover:text-brand-offwhite transition-all duration-300 flex items-center gap-2 border border-brand-softblack/10">
            <Mail size={16} />
            Blast Pengingat
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="surface-card p-6 border border-gray-100">
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40 mb-1">Total Terdeteksi</div>
          <div className="text-2xl font-light text-brand-softblack">{stats.totalDetected}</div>
        </div>
        <div className="surface-card p-6 border border-gray-100">
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40 mb-1">Berhasil Pulih</div>
          <div className="text-2xl font-light text-brand-green">{stats.recoveredCount} ({stats.recoveredRate}%)</div>
        </div>
        <div className="surface-card p-6 border border-gray-100">
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40 mb-1">Potensi Penjualan</div>
          <div className="text-2xl font-light text-brand-softblack">{stats.potentialRevenueLabel}</div>
        </div>
        <div className="surface-card p-6 border border-gray-100">
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40 mb-1">Menunggu Pengingat</div>
          <div className="text-2xl font-light text-amber-500">{stats.pendingRemindersCount}</div>
        </div>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-offwhite/30">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Pelanggan</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Isi Keranjang</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Total</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Terakhir Dilihat</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {rows?.map((item) => (
                <tr key={item.id} className="hover:bg-brand-offwhite/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-brand-softblack">{item.email}</span>
                      <span className="text-[10px] text-brand-softblack/30 tracking-wider">{item.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-brand-softblack/60">
                      <ShoppingCart size={14} />
                      <span>{Array.isArray(item.cart_items) ? item.cart_items.length : 0} Produk</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-brand-softblack">
                    {formatPrice(item.cartTotal)}
                  </td>
                  <td className="px-6 py-5 text-brand-softblack/40 text-xs">
                    {new Date(item.captured_at).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-softblack/40 hover:text-brand-green transition-all">
                      Kirim WA/Email <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-brand-softblack/40 italic">
                    Belum ada data checkout terabaikan.
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
