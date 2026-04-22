"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) return [{ label: "Dashboard", href: "/admin" }];
    
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href
      };
    });
  }, [pathname]);

  return (
    <div className="flex bg-brand-offwhite text-brand-softblack relative">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Admin */}
        <header className="h-[72px] bg-brand-offwhite/95 backdrop-blur-xl border-b border-brand-champagne flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          {/* Top Gold Accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60" />

          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-brand-softblack/30 hover:text-brand-softblack transition-colors">
              <Home size={14} />
            </Link>
            
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-3">
                <ChevronRight size={12} className="text-brand-softblack/25" />
                <Link 
                  href={crumb.href}
                  className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${
                    idx === breadcrumbs.length - 1 
                      ? "text-brand-softblack" 
                      : "text-brand-softblack/40 hover:text-brand-softblack"
                  }`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 pr-5 border-r border-brand-champagne">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
              </span>
              <span className="text-[9px] text-brand-softblack/55 uppercase tracking-widest">Live</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-brand-softblack uppercase tracking-widest">Admin</span>
                <span className="text-[9px] text-brand-softblack/40 uppercase tracking-widest">Store Manager</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-softblack flex items-center justify-center text-white text-[10px] font-bold shadow-md ring-2 ring-brand-champagne">
                BB
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8 md:p-12 bg-brand-offwhite">
          {children}
        </main>
      </div>
    </div>
  );
}
