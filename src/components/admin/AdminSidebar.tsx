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
  Clock,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = { name: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }> };
type MenuSection = { title: string; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Katalog",
    items: [
      { name: "Kategori", href: "/admin/categories", icon: Package },
      { name: "Koleksi", href: "/admin/collections", icon: Package },
      { name: "Produk", href: "/admin/products", icon: Package },
      { name: "Paket (Kits)", href: "/admin/kits", icon: Package },
      { name: "Stok & Inventaris", href: "/admin/inventory", icon: Package },
      { name: "Riwayat Stok", href: "/admin/inventory/logs", icon: Clock },
    ],
  },
  {
    title: "Penjualan",
    items: [
      { name: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
      { name: "Retur Pesanan", href: "/admin/returns", icon: ShoppingCart },
      { name: "Keranjang Terabaikan", href: "/admin/abandoned-carts", icon: ShoppingCart },
    ],
  },
  {
    title: "Marketing",
    items: [
      { name: "Diskon & Promo", href: "/admin/discounts", icon: Settings },
      { name: "Flash Sales", href: "/admin/flash-sales", icon: Clock },
      { name: "Waitlist", href: "/admin/waitlist", icon: Clock },
      { name: "Loyalty & VIP", href: "/admin/loyalty", icon: Star },
      { name: "Otomasi Email", href: "/admin/automation", icon: Mail },
    ],
  },
  {
    title: "Konten & CRM",
    items: [
      { name: "Konten Beranda", href: "/admin/homepage", icon: LayoutDashboard },
      { name: "Halaman CMS", href: "/admin/content", icon: FileText },
      { name: "Ulasan", href: "/admin/reviews", icon: Star },
      { name: "Pelanggan", href: "/admin/customers", icon: Users },
      { name: "Log Aktivitas", href: "/admin/logs", icon: FileText },
    ],
  },
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
      className="relative z-40 flex flex-col self-stretch bg-brand-softblack text-brand-offwhite border-r border-brand-gold/15 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden"
    >
      {/* 1. Brand Header */}
      <div className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-brand-gold/10 bg-brand-softblack">
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
      <nav className="flex-1 py-6 px-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-2">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] uppercase tracking-[0.22em] text-brand-champagne/45">
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
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
                      : "hover:bg-brand-champagne/10 text-brand-champagne/70 hover:text-brand-offwhite"}
                  `}
                >
                  <Icon size={20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />

                  {!collapsed && (
                    <span className="text-sm font-light tracking-wide">{item.name}</span>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-6 px-3 py-2 bg-brand-softblack border border-brand-gold/20 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 3. Footer / User Card Area (Integrated & Pinned) */}
      <div className="p-4 pb-10 border-t border-brand-gold/10 bg-brand-softblack">
        <div className={`
          flex items-center gap-3 bg-brand-champagne/10 rounded-2xl p-3 transition-all duration-300
          ${collapsed ? "justify-center p-2" : "justify-between px-4"}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              BB
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-brand-offwhite/90 truncate">Administrator</span>
                <span className="text-[10px] text-brand-champagne/45 truncate">Admin Panel</span>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="flex items-center gap-1">
              <Link 
                href="/admin/settings"
                className="p-1.5 rounded-lg text-brand-champagne/50 hover:text-brand-offwhite hover:bg-brand-champagne/15 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/50"
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
