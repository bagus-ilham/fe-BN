"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Home, Search, Bell, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  products: "Produk",
  categories: "Kategori",
  collections: "Koleksi",
  kits: "Paket (Kits)",
  inventory: "Inventaris",
  logs: "Log Aktivitas",
  orders: "Pesanan",
  returns: "Retur",
  "abandoned-carts": "Keranjang Terabaikan",
  discounts: "Diskon & Promo",
  "flash-sales": "Flash Sales",
  waitlist: "Waitlist",
  loyalty: "Loyalty & VIP",
  automation: "Otomasi Email",
  homepage: "Beranda",
  content: "Halaman CMS",
  reviews: "Ulasan",
  customers: "Pelanggan",
  settings: "Pengaturan",
  new: "Baru",
};

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1) return [{ label: "Dashboard", href: "/admin" }];

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href };
    });
  }, [pathname]);

  const currentPageLabel = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  return (
    <div className="flex bg-[#F4F2EF] text-brand-softblack relative min-h-screen">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar Admin */}
        <header className="h-[72px] bg-white border-b border-brand-softblack/[0.06] flex items-center justify-between px-6 sticky top-0 z-40 shadow-[0_1px_12px_rgba(28,28,28,0.05)]">
          {/* Top gold accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-gold/50 via-brand-gold to-brand-gold/50" />

          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <Link 
              href="/admin" 
              className="p-1.5 rounded-lg text-brand-softblack/30 hover:text-brand-softblack hover:bg-brand-offwhite transition-colors flex-shrink-0"
              title="Dashboard"
            >
              <Home size={15} />
            </Link>

            {breadcrumbs.length > 1 && breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-2 min-w-0">
                <ChevronRight size={11} className="text-brand-softblack/20 flex-shrink-0" />
                <Link
                  href={crumb.href}
                  className={`text-[10px] uppercase tracking-[0.18em] font-medium transition-colors truncate ${
                    idx === breadcrumbs.length - 1
                      ? "text-brand-softblack"
                      : "text-brand-softblack/35 hover:text-brand-softblack"
                  }`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Store preview link */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 hover:text-brand-softblack hover:bg-brand-offwhite transition-all border border-brand-softblack/8"
            >
              <ExternalLink size={11} />
              Lihat Toko
            </Link>

            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-offwhite border border-brand-softblack/[0.06]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[9px] text-brand-softblack/50 uppercase tracking-widest hidden sm:inline">Live</span>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-brand-softblack/10" />

            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-[10px] font-bold text-brand-softblack uppercase tracking-widest leading-none">Admin</span>
                <span className="text-[8px] text-brand-softblack/35 uppercase tracking-widest mt-0.5">Store Manager</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-softblack to-brand-softblack/80 flex items-center justify-center text-white text-[9px] font-bold shadow-md ring-2 ring-brand-champagne">
                BB
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          {/* Page title strip */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 mb-1">
                benangbaju · Admin
              </p>
              <h1 className="text-xl font-light text-brand-softblack tracking-tight">
                {currentPageLabel}
              </h1>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
