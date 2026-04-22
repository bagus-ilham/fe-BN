"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  Clock, 
  ExternalLink,
  Printer,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { getOrderById, updateOrderStatus } from "@/lib/order-service";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      setIsLoading(true);
      const data = await getOrderById(orderId);
      if (data) {
        setOrder(data);
        const typedData = data as { status?: string; shipments?: Array<{ tracking_number?: string | null }> };
        setNewStatus(typedData.status ?? "pending");
        setTrackingCode(typedData.shipments?.[0]?.tracking_number || "");
      }
      setIsLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  const statusColors: any = {
    pending: "text-amber-500 bg-amber-50 border-amber-100",
    paid: "text-green-600 bg-green-50 border-green-100",
    shipped: "text-blue-600 bg-blue-50 border-blue-100",
    delivered: "text-brand-softblack bg-brand-offwhite border-stone-200",
    cancelled: "text-red-600 bg-red-50 border-red-100"
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, trackingCode);
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      router.refresh();
    } catch (err) {
      console.error("Gagal memperbarui pesanan:", err);
      alert("Gagal memperbarui pesanan.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Clock size={24} className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-softblack/40 uppercase tracking-widest text-xs">Pesanan tidak ditemukan</p>
        <Link href="/admin/orders" className="text-brand-green text-[10px] uppercase tracking-widest mt-4 inline-block hover:underline">Kembali</Link>
      </div>
    );
  }

  const customer = order.profiles || {};
  const payment = order.payment_transactions?.[0] || {};
  const shipment = order.shipments?.[0] || {};
  const subtotalAmount =
    order.order_items?.reduce((acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <Link 
            href="/admin/orders"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-brand-softblack/40 hover:text-brand-green transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Daftar
          </Link>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-extralight uppercase tracking-tight text-brand-softblack">
              Detail Pesanan <span className="font-medium">#{params.id ? (params.id as string).split('-')[0].toUpperCase() : '...' }</span>
            </h2>
            <span className={`px-4 py-1 text-[10px] uppercase tracking-widest font-semibold border rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40">
            Diterima pada {new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 text-[10px] uppercase tracking-widest font-medium text-brand-softblack hover:bg-brand-offwhite transition-all">
            <Printer size={14} /> Cetak Invoice
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-softblack text-brand-offwhite text-[10px] uppercase tracking-widest font-medium hover:bg-brand-green transition-all shadow-lg">
            Hubungi Pelanggan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Items & Summary */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Item List */}
          <div className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
            <div className="p-6 border-b border-stone-50 bg-brand-offwhite/30 flex items-center gap-3">
              <Package size={18} className="text-brand-softblack/40" />
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-softblack">Produk yang Dipesan</h3>
            </div>
            <div className="divide-y divide-stone-50">
              {order.order_items?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 flex items-center gap-6 group">
                  <div className="relative w-20 h-24 bg-brand-offwhite border border-stone-100 rounded-sm overflow-hidden shrink-0">
                    <Image 
                      src={item.product_variants?.image_url || "/images/products/glow.jpeg"} 
                      alt={item.product_variants?.products?.name || "Produk"} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium text-brand-softblack">{item.product_variants?.products?.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40">
                      {item.product_variants?.color_name} / Size {item.product_variants?.size}
                    </p>
                    <div className="flex items-center gap-6 mt-2">
                       <span className="text-xs text-brand-softblack/60">Qty: {item.quantity}</span>
                       <span className="text-xs font-semibold text-brand-softblack">Rp {(item.price || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="text-right sr-only md:not-sr-only">
                    <p className="text-sm font-medium text-brand-softblack">
                      Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-brand-offwhite/20 border-t border-stone-50">
               <div className="max-w-xs ml-auto space-y-4">
                  <div className="flex justify-between text-xs text-brand-softblack/50">
                    <span>Subtotal</span>
                    <span>Rp {subtotalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-softblack/50">
                    <span>Biaya Pengiriman</span>
                    <span>Rp {order.shipping_amount.toLocaleString('id-ID')}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-xs text-brand-sale-red">
                      <span>Diskon Promo</span>
                      <span>- Rp {order.discount_amount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold text-brand-softblack pt-4 border-t border-stone-200">
                    <span>Total</span>
                    <span>Rp {order.total_amount.toLocaleString('id-ID')}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Logistics Tracking */}
          <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
             <div className="p-6 border-b border-stone-50 bg-brand-offwhite/30 flex items-center gap-3">
                <Truck size={18} className="text-brand-softblack/40" />
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-brand-softblack">Logistik & Pengiriman</h3>
             </div>
             <div className="p-8">
                {order.status === 'shipped' || order.status === 'delivered' ? (
                  <div className="flex items-center gap-6 p-6 bg-blue-50/50 border border-blue-100 rounded-sm">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      <Truck size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Nomor Resi Tersedia</p>
                      <p className="text-lg font-mono font-bold text-blue-900">{shipment.tracking_number || 'SEDANG DIPROSES'}</p>
                      <p className="text-[10px] text-blue-800 opacity-60 uppercase tracking-widest italic">{shipment.courier_company}</p>
                    </div>
                    {shipment.tracking_number && (
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`cek resi ${shipment.courier_company || ""} ${shipment.tracking_number}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        Lacak <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                     <div className="p-4 bg-brand-offwhite text-stone-300 rounded-full">
                        <Clock size={32} strokeWidth={1} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-brand-softblack">Menunggu Pesanan Diproses</p>
                        <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">Resi akan muncul saat status berubah menjadi &quot;Shipped&quot;</p>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Kolom Kanan: Customer & Action */}
        <div className="space-y-8">
           
           {/* Customer Profile */}
           <div className="bg-brand-softblack text-brand-offwhite rounded-sm p-8 space-y-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                 <User size={18} className="opacity-40" />
                 <h3 className="text-[11px] uppercase tracking-[0.3em] font-light">Informasi Pelanggan</h3>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Nama Lengkap</label>
                    <p className="text-sm font-light">{customer.full_name || 'Pelanggan Anonim'}</p>
                 </div>
                 <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">Email</label>
                    <p className="text-sm font-light lowercase">{customer.email || order.customer_email || '-'}</p>
                 </div>
                 <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-1">No. Handphone</label>
                    <p className="text-sm font-light">{customer.phone || '-'}</p>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6">
                 <div className="flex items-center gap-3">
                    <MapPin size={18} className="opacity-40" />
                    <h3 className="text-[11px] uppercase tracking-[0.3em] font-light">Alamat Pengiriman</h3>
                 </div>
                 <div className="space-y-4">
                    <p className="text-sm font-light leading-relaxed opacity-80">
                      {order.shipping_street || 'Alamat tidak tersedia'}<br />
                      {order.shipping_city || '-'}, {order.shipping_state || '-'}<br />
                      {order.shipping_zip || '-'}<br />
                      Indonesia
                    </p>
                    <button className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-brand-green hover:underline">
                      Lihat di Google Maps <ExternalLink size={10} />
                    </button>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6">
                 <div className="flex items-center gap-3">
                    <CreditCard size={18} className="opacity-40" />
                    <h3 className="text-[11px] uppercase tracking-[0.3em] font-light">Metode Pembayaran</h3>
                 </div>
                 <p className="text-[10px] uppercase tracking-[0.2em] font-medium bg-white/5 py-4 px-4 text-center border border-white/10">
                    {payment.payment_type || 'PENDING'}
                 </p>
              </div>
           </div>

           {/* Action Card */}
           <div className="p-8 bg-white border border-stone-100 rounded-sm shadow-lg space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-softblack">Perbarui Pesanan</h4>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-2">Pilih Status Baru</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-brand-offwhite border-none text-[10px] uppercase tracking-widest p-4 outline-none focus:ring-1 focus:ring-brand-green cursor-pointer"
                    >
                       <option value="pending">Pending</option>
                       <option value="paid">Paid</option>
                       <option value="shipped">Shipped (Dikirim)</option>
                       <option value="delivered">Delivered (Tiba)</option>
                       <option value="cancelled">Cancelled</option>
                    </select>
                 </div>

                 {newStatus === 'shipped' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                       <label className="text-[9px] uppercase tracking-widest opacity-40 block mb-2 mt-4">Nomor Resi (Tracking ID)</label>
                       <input 
                        type="text"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        placeholder="e.g. BB-ID-XXXXXXXX"
                        className="w-full bg-brand-offwhite border-none text-xs p-4 outline-none focus:ring-1 focus:ring-brand-green font-mono"
                       />
                    </motion.div>
                 )}
              </div>

              <button 
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === order.status}
                className="w-full py-4 bg-brand-green text-white text-[10px] uppercase tracking-widest font-bold hover:bg-brand-softblack transition-all disabled:opacity-50 disabled:bg-stone-200 flex items-center justify-center gap-2"
              >
                {isUpdating ? <Clock size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                {isUpdating ? "Memperbarui..." : "Simpan Perubahan"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
