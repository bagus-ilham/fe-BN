'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/format';
import { Check, ExternalLink, Package, Truck, XCircle } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { OrderWithItems } from '@/types/database';

const statusConfig = {
  pending: { label: 'Menunggu Pembayaran', icon: Package, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  paid: { label: 'Dibayar', icon: Check, color: 'bg-green-50 text-green-700 border-green-200' },
  shipped: { label: 'Dikirim', icon: Truck, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  delivered: { label: 'Terkirim', icon: Check, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Dibatalkan', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { listUserOrders } = await import("@/lib/order-service");
        const userOrders = await listUserOrders(user.id);
        setOrders(userOrders as unknown as OrderWithItems[]);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-offwhite pt-32 md:pt-40 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-stone-100 rounded-xl shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-sm shrink-0" variant="rectangular" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-16 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell bg-brand-offwhite px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest mb-2 text-brand-softblack">
            Pesanan Saya
          </h1>
          <p className="text-sm font-light text-stone-600">
            Pantau semua pesananmu dalam satu tempat
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-xl p-12 md:p-16 text-center shadow-sm">
            <Package className="w-16 h-16 mx-auto text-stone-300 mb-6" />
            <h2 className="text-xl font-light text-stone-700 mb-3">
              Belum ada pesanan
            </h2>
            <p className="text-sm text-stone-500 mb-8 max-w-md mx-auto">
              Saat kamu berbelanja, pesananmu akan muncul di sini.
            </p>
            <Link
              href="/"
              className="inline-block border border-brand-green text-brand-green bg-transparent px-8 py-3 uppercase text-xs tracking-widest hover:bg-brand-green hover:text-white transition-all duration-300 rounded-sm"
            >
              Jelajahi Koleksi
            </Link>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Header pesanan */}
                  <div className="p-6 md:p-8 border-b border-stone-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">
                          Dipesan pada {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Total</p>
                        <p className="text-2xl font-light text-brand-softblack">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="p-6 md:p-8">
                    <div className="space-y-4">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 pb-4 border-b border-stone-50 last:border-0 last:pb-0"
                          >
                            {item.product_image ? (
                              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden border border-stone-100 shrink-0">
                                <Image
                                  src={item.product_image}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 64px, 80px"
                                  unoptimized={item.product_image.includes('localhost') || item.product_image.startsWith('/images/')}
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-100 rounded-sm flex items-center justify-center shrink-0">
                                <Package className="w-6 h-6 text-stone-300" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-brand-softblack mb-1 line-clamp-2">
                                {item.product_name}
                              </h3>
                              <div className="flex items-center gap-4 text-xs text-stone-500">
                                <span>Qty: {item.quantity}</span>
                                <span>× {formatPrice(item.price)}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-medium text-brand-softblack">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-stone-400">Produk tidak ditemukan</p>
                      )}
                    </div>
                  </div>

                  {/* Rastreio */}
                  {(order.status === 'shipped' || order.status === 'delivered') && order.tracking_code && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 -mt-2">
                      <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-widest text-blue-600 font-medium mb-1">
                            Kode Resi
                            {order.tracking_carrier && (
                              <span className="normal-case font-normal tracking-normal ml-1.5">
                                · {order.tracking_carrier}
                              </span>
                            )}
                          </p>
                          <p className="text-sm font-mono text-brand-softblack tracking-widest">
                            {order.tracking_code}
                          </p>
                        </div>
                        {order.tracking_url ? (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-blue-700 hover:text-blue-900 transition-colors shrink-0"
                          >
                            Lacak
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <a
                            href={`https://cekresi.com/?noresi=${encodeURIComponent(order.tracking_code)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-blue-700 hover:text-blue-900 transition-colors shrink-0"
                          >
                            Lacak
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
