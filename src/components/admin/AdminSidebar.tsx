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
  Mail,
  Tag,
  Layers,
  Archive,
  History,
  RotateCcw,
  ShoppingBag,
  Percent,
  Zap,
  ListChecks,
  Gift,
  Send,
  Home,
  BookOpen,
  MessageSquare,
  Activity,
  BarChart2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = { 
  name: string; 
  href: string; 
  icon: React.ComponentType<{ size?: number; className?: string }>;
};
type MenuSection = { title: string; items: MenuItem[] };

const menuSections: MenuSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: BarChart2 },
    ],
  },
  {
    title: "Katalog",
    items: [
      { name: "Kategori", href: "/admin/categories", icon: Tag },
      { name: "Koleksi", href: "/admin/collections", icon: Layers },
      { name: "Produk", href: "/admin/products", icon: Package },
      { name: "Paket (Kits)", href: "/admin/kits", icon: Gift },
      { name: "Stok & Inventaris", href: "/admin/inventory", icon: Archive },
      { name: "Riwayat Stok", href: "/admin/inventory/logs", icon: History },
    ],
  },
  {
    title: "Penjualan",
    items: [
      { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
      { name: "Retur Pesanan", href: "/admin/returns", icon: RotateCcw },
      { name: "Keranjang Terabaikan", href: "/admin/abandoned-carts", icon: ShoppingCart },
    ],
  },
  {
    title: "Marketing",
    items: [
      { name: "Diskon & Promo", href: "/admin/discounts", icon: Percent },
      { name: "Flash Sales", href: "/admin/flash-sales", icon: Zap },
      { name: "Waitlist", href: "/admin/waitlist", icon: ListChecks },
      { name: "Loyalty & VIP", href: "/admin/loyalty", icon: Star },
      { name: "Otomasi Email", href: "/admin/automation", icon: Send },
    ],
  },
  {
    title: "Konten & CRM",
    items: [
      { name: "Konten Beranda", href: "/admin/homepage", icon: Home },
      { name: "Halaman CMS", href: "/admin/content", icon: BookOpen },
      { name: "Ulasan", href: "/admin/reviews", icon: MessageSquare },
      { name: "Pelanggan", href: "/admin/customers", icon: Users },
      { name: "Log Aktivitas", href: "/admin/logs", icon: Activity },
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
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      const { handleLogout: logout } = await import("@/utils/auth");
      await logout();
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "72px" : "272px" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-40 flex flex-col self-stretch bg-brand-softblack text-brand-offwhite border-r border-white/[0.06] overflow-y-auto overflow-x-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Subtle vertical gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/20 pointer-events-none" />

      {/* 1. Brand Header */}
      <div className="h-[72px] flex-shrink-0 flex items-center justify-between px-4 border-b border-white/[0.06] relative">
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />
        
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 ml-2"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-gold/80 to-brand-gold/40 flex items-center justify-center shadow-lg shadow-brand-gold/20">
                <span className="text-[9px] font-bold text-brand-softblack">BB</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[11px] font-light tracking-[0.25em] text-brand-offwhite/90">BENANG</span>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-brand-gold">BAJU</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold/80 to-brand-gold/40 flex items-center justify-center shadow-lg shadow-brand-gold/20">
            <span className="text-[9px] font-bold text-brand-softblack">BB</span>
          </div>
        )}

        {!collapsed && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/50"
          >
            <ChevronLeft size={16} className="text-brand-offwhite/50" />
          </button>
        )}
      </div>

      {/* Collapsed toggle */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto mt-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/50"
        >
          <ChevronRight size={16} className="text-brand-offwhite/50" />
        </button>
      )}

      {/* 2. Navigation Area */}
      <nav className="flex-1 py-5 px-3 space-y-1 relative z-10">
        {menuSections.map((section, sectionIdx) => (
          <div key={section.title}>
            {/* Section Divider (except first) */}
            {sectionIdx > 0 && (
              <div className="my-3 mx-2">
                {!collapsed && (
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-medium">
                      {section.title}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>
                )}
                {collapsed && <div className="h-px bg-white/[0.06] mx-1" />}
              </div>
            )}

            {sectionIdx === 0 && !collapsed && (
              <div className="px-3 pb-2 text-[8px] uppercase tracking-[0.3em] text-white/20 font-medium">
                {section.title}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      group relative focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/50
                      ${collapsed ? "justify-center" : ""}
                      ${active
                        ? "bg-gradient-to-r from-brand-gold/25 to-brand-gold/10 text-brand-offwhite shadow-sm"
                        : "hover:bg-white/[0.07] text-white/50 hover:text-white/85"
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-gold rounded-full" />
                    )}

                    <Icon 
                      size={17} 
                      className={`flex-shrink-0 transition-all duration-200 ${
                        active 
                          ? "text-brand-gold" 
                          : "text-white/40 group-hover:text-white/70 group-hover:scale-110"
                      }`} 
                    />

                    {!collapsed && (
                      <span className={`text-[12px] font-light tracking-wide truncate ${
                        active ? "text-brand-offwhite font-medium" : ""
                      }`}>
                        {item.name}
                      </span>
                    )}

                    {/* Tooltip on collapsed */}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-brand-softblack/95 border border-white/10 rounded-lg text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl shadow-black/30 text-brand-offwhite/90">
                        {item.name}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-brand-softblack/95 border-l border-b border-white/10 rotate-45" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Footer / User Card */}
      <div className="p-3 pb-6 border-t border-white/[0.06] relative z-10">
        <div className={`
          flex items-center gap-3 rounded-xl p-3 transition-all duration-300
          bg-white/[0.05] hover:bg-white/[0.08]
          ${collapsed ? "justify-center p-2" : ""}
        `}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-gold/70 to-brand-gold/30 flex items-center justify-center text-[9px] font-bold text-brand-softblack shrink-0 shadow-md">
            BB
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] font-medium text-brand-offwhite/90 truncate">Administrator</span>
              <span className="text-[9px] text-white/30 truncate uppercase tracking-wider">Store Manager</span>
            </div>
          )}

          {!collapsed && (
            <div className="flex items-center gap-1">
              <Link 
                href="/admin/settings"
                className="p-1.5 rounded-lg text-white/30 hover:text-brand-offwhite hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold/50"
                title="Pengaturan"
              >
                <Settings size={13} />
              </Link>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-red-400/30 hover:text-red-400 hover:bg-red-400/10 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400/50"
                title="Keluar"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
