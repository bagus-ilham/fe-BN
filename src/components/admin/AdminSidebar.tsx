"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Star, 
  Users, 
  FileText,
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  Clock
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produk", href: "/admin/products", icon: Package },
  { name: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { name: "Halaman Utama", href: "/admin/homepage", icon: LayoutDashboard },
  { name: "Ulasan", href: "/admin/reviews", icon: Star },
  { name: "Konten", href: "/admin/content", icon: FileText },
  { name: "Waitlist", href: "/admin/waitlist", icon: Clock },
  { name: "Pelanggan", href: "/admin/customers", icon: Users },
];

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  
  const handleLogout = async () => {
    // Mock logout for frontend playground
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      window.location.href = "/login";
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "80px" : "280px" }}
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
      className="bg-brand-softblack text-brand-offwhite border-r border-white/10 transition-all duration-300 ease-in-out overflow-hidden"
    >
      {/* 1. Brand Header */}
      <div className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-brand-softblack">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-light tracking-[0.2em] text-lg"
            >
              BENANG<span className="font-medium">BAJU</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* 2. Navigation Area (Isolated Scroll) */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-8 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70
                ${isActive 
                  ? "bg-brand-green text-brand-offwhite shadow-lg shadow-brand-green/20" 
                  : "hover:bg-white/5 text-white/60 hover:text-white"}
              `}
            >
              <Icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
              
              {!collapsed && (
                <span className="text-sm font-light tracking-wide">{item.name}</span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-brand-softblack border border-white/10 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Footer / User Card Area (Integrated & Pinned) */}
      <div className="p-4 pb-10 border-t border-white/5 bg-brand-softblack">
        <div className={`
          flex items-center gap-3 bg-white/5 rounded-2xl p-3 transition-all duration-300
          ${collapsed ? "justify-center p-2" : "justify-between px-4"}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              BB
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white/90 truncate">Administrator</span>
                <span className="text-[10px] text-white/30 truncate">Admin Panel</span>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="flex items-center gap-1">
              <Link 
                href="/admin/settings"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/50"
                title="Pengaturan"
              >
                <Settings size={14} />
              </Link>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400/50"
                title="Keluar"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
