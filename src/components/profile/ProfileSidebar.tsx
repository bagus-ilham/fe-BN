"use client";
import { User, ShoppingBag, MapPin, Heart, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export default function ProfileSidebar({ activeTab, setActiveTab, user, onLogout }: ProfileSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Settings },
    { id: "account", label: "Informasi Akun", icon: User },
    { id: "orders", label: "Riwayat Pesanan", icon: ShoppingBag },
    { id: "address", label: "Alamat Pengiriman", icon: MapPin },
    { id: "wishlist", label: "Favorit Saya", icon: Heart },
  ];

  return (
    <div className="w-full lg:w-80 shrink-0 space-y-8">
      {/* User Card */}
      <div className="surface-card p-8 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -z-0" />

        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-brand-softblack/5 border border-brand-gold/20 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-light text-brand-gold">{user.name.charAt(0)}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-gold rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
        </div>

        <h2 className="text-lg font-light uppercase tracking-widest text-brand-softblack mb-1">
          {user.name}
        </h2>
        <p className="text-[10px] text-brand-softblack/40 uppercase tracking-[0.2em]">
          {user.email}
        </p>
      </div>

      {/* Navigation Menu */}
      <div className="surface-card overflow-hidden">
        <div className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all duration-300 relative group ${isActive
                    ? "text-brand-softblack"
                    : "text-brand-softblack/40 hover:text-brand-softblack/70"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-gold/5 border-l-2 border-brand-gold z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon size={18} strokeWidth={1.5} className={`relative z-10 transition-transform duration-500 ${isActive ? "text-brand-gold" : "group-hover:scale-110"}`} />
                <span className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-medium">
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto relative z-10"
                  >
                    <div className="w-1 h-1 bg-brand-gold rounded-full" />
                  </motion.div>
                )}
              </button>
            );
          })}

          <div className="h-px bg-stone-100 my-2 mx-6" />

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-sm text-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
          >
            <LogOut size={18} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
              Keluar
            </span>
          </button>
        </div>
      </div>

      {/* Membership Card (Premium Acent) */}
      <div className="bg-brand-softblack p-8 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl -z-0" />
        <div className="relative z-10">
          <p className="text-[9px] uppercase tracking-[0.4em] text-brand-gold font-bold mb-4">Silver Member</p>
          <p className="text-white/60 text-[10px] leading-relaxed mb-6 font-light italic">
            Nikmati akses eksklusif ke koleksi terbaru dan promo khusus member.
          </p>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="w-1/3 h-full bg-brand-gold" />
          </div>
          <p className="text-[8px] uppercase tracking-widest text-white/30 text-right">300/1000 Poin ke Gold</p>
        </div>
      </div>
    </div>
  );
}
