"use client";
import { ShoppingBag, Star, Clock, ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfileDashboard({ user }: { user: any }) {
  const stats = [
    { label: "Total Pesanan", value: "2", icon: ShoppingBag, color: "bg-blue-50 text-blue-500" },
    { label: "Wishlist", value: "4", icon: Star, color: "bg-amber-50 text-amber-500" },
    { label: "Poin Loyalitas", value: "350", icon: Clock, color: "bg-emerald-50 text-emerald-500" },
  ];

  const recentOrders = [
    { id: "#BB-9921", date: "12 April 2024", status: "Sedang Dikirim", total: "Rp 850.000", items: 3 },
    { id: "#BB-9845", date: "28 Maret 2024", status: "Selesai", total: "Rp 1.250.000", items: 1 },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light uppercase tracking-widest text-brand-softblack mb-2">
            Selamat Datang, <span className="italic font-serif">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-[0.25em]">
            Ringkasan aktivitas akun Anda hari ini
          </p>
        </div>
        <div className="hidden md:block">
          <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold bg-brand-gold/5 px-4 py-2 rounded-sm border border-brand-gold/10">
            Terakhir login: Hari ini, 14:20
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="surface-card p-8 group hover:border-brand-gold/30 transition-all duration-500"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-light text-brand-softblack mb-1 tabular-nums">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/40 font-medium">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table-like Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-softblack">Pesanan Terbaru</h3>
            <Link href="/orders" className="text-[10px] uppercase tracking-widest text-brand-gold hover:underline">Lihat Semua</Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="surface-card p-6 flex items-center justify-between group hover:bg-stone-50/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-stone-100 rounded-sm flex items-center justify-center text-brand-softblack/30">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-softblack">{order.id}</p>
                    <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest mt-1">{order.date} • {order.items} item</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light text-brand-softblack">{order.total}</p>
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-bold mt-1 inline-block ${order.status === 'Selesai' ? 'text-emerald-500' : 'text-brand-gold animate-pulse'}`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Account Quick Status */}
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-softblack">Status Akun</h3>
          <div className="surface-card p-8 bg-brand-gold/[0.03] border-brand-gold/10 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl" />
            <div className="relative space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-brand-softblack/50">Tingkat Keamanan</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-brand-green" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-green">75%</span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button className="w-full flex items-center justify-between p-3 bg-white border border-stone-100 text-[10px] uppercase tracking-widest hover:border-brand-gold transition-colors group">
                  <span>Lengkapi Profil</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white border border-stone-100 text-[10px] uppercase tracking-widest hover:border-brand-gold transition-colors group">
                  <span>Verifikasi Email</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
