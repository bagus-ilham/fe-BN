"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useCart } from "@/context/CartContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import Avatar from "@/components/ui/Avatar";
import { motion, AnimatePresence } from "framer-motion";

function MobileMenu() {
  const { isMenuOpen, setIsMenuOpen } = useCart();
  const { settings } = useSiteSettings();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setLoading(false);
    setLoggingOut(false);

    const handlePopState = () => {
      setLoading(false);
      setLoggingOut(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setUser(null);
    setProfile(null);
    setLoading(false);
  }, [isMenuOpen]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    setIsMenuOpen(false);

    try {
      const { handleLogout: logout } = await import("@/utils/auth");
      await logout();
    } catch (error) {
      console.error("Gagal keluar akun:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, [setIsMenuOpen]);

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  // Dynamic menu from DB via SiteSettingsContext
  const menuItems = useMemo(() => {
    const navMain = settings.navigation?.main || [];
    const staticItems = [
      { href: "/", label: "Beranda", icon: "home" },
    ];
    // Build dynamic items from navigation config
    const dynamicItems = navMain.map((item) => ({
      href: item.href,
      label: item.label,
      icon: "star",
      children: item.megaMenu?.flatMap(col => col.items) || []
    }));
    const extraItems = [
      { href: "/about", label: "Tentang Kami", icon: "info" },
      { href: "/contact", label: "Kontak", icon: "box" },
    ];
    return [...staticItems, ...dynamicItems, ...extraItems];
  }, [settings.navigation]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
            onClick={handleLinkClick}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Side menu */}
      <div
        className={`fixed left-0 top-0 h-full w-[85%] max-w-sm z-[90] shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        style={{ background: "linear-gradient(160deg, #FAF8F5 0%, #F0E6DA20 100%)" }}
      >
        {/* Garis emas di kanan */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent" />

        <div className="p-6 md:p-8 flex flex-col h-full">
          {/* ── HEADER: Brand name + close button ── */}
          <div className="flex justify-between items-center mb-8 pb-5 border-b border-brand-softblack/6">
            <Link href="/" onClick={handleLinkClick}>
              <span className="text-sm font-medium uppercase tracking-[0.45em] text-brand-softblack">
                benangbaju
              </span>
            </Link>
            <button
              onClick={handleLinkClick}
              className="w-8 h-8 flex items-center justify-center text-brand-softblack/50 hover:text-brand-softblack transition-colors"
              aria-label="Tutup menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── USER SECTION ── */}
          <div className="mb-7 pb-7 border-b border-brand-softblack/6">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <svg className="animate-spin h-5 w-5 text-brand-softblack/30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar src={profile?.avatar_url || null} name={profile?.full_name || user.email || null} size="lg" />
                  <div className="text-center">
                    {profile?.full_name && (
                      <h3 className="text-sm font-medium text-brand-softblack mb-0.5">{profile.full_name}</h3>
                    )}
                    <p className="text-xs text-brand-softblack/50">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/profile" onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-[0.2em] font-medium text-brand-softblack bg-brand-champagne/40 hover:bg-brand-champagne/70 rounded-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Akun Saya
                  </Link>
                  <Link href="/orders" onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-[0.2em] font-medium text-brand-softblack bg-brand-champagne/40 hover:bg-brand-champagne/70 rounded-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25h4.125" />
                    </svg>
                    Pesanan Saya
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="glimmer-hover block w-full py-4 px-6 text-center text-xs uppercase tracking-[0.42em] font-medium text-brand-offwhite rounded-sm transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #8B6F5E 0%, #A08070 50%, #8B6F5E 100%)", backgroundSize: "200% 100%" }}
              >
                Masuk / Daftar
              </Link>
            )}
          </div>

          {/* ── NAVIGATION ── */}
          <nav className="flex-1">
            <ul className="flex flex-col space-y-1">
              {menuItems.map((item, idx) => {
                const IconComponent = () => {
                  switch (item.icon) {
                    case "home":
                      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
                    case "info":
                      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>;
                    case "star":
                      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>;
                    case "box":
                      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
                    default:
                      return null;
                  }
                };

                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isMenuOpen ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-4 py-3.5 px-3 text-[11px] uppercase tracking-[0.25em] font-light text-brand-softblack/75 hover:text-brand-softblack hover:bg-brand-champagne/30 rounded-sm transition-all duration-200 group/item"
                    >
                      <span className="text-brand-softblack/30 group-hover/item:text-brand-gold transition-colors duration-200">
                        <IconComponent />
                      </span>
                      {item.label}
                      <span className="ml-auto text-brand-softblack/15 group-hover/item:text-brand-softblack/30 transition-colors duration-200">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* ── LOGOUT BUTTON ── */}
          {user && (
            <div className="border-t border-brand-softblack/6 pt-5 mt-5">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center justify-center gap-2 py-3 px-4 w-full text-xs uppercase tracking-[0.2em] font-medium text-red-500/70 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sedang keluar...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Keluar
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── BOTTOM: Social/decorative ── */}
          <div className="pt-6 mt-2 border-t border-brand-softblack/5">
            <p className="text-[8px] uppercase tracking-[0.35em] text-brand-softblack/25 text-center">
              © 2025 benangbaju
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(MobileMenu);
