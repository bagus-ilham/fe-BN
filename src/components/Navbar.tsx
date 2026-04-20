// src/components/Navbar.tsx
"use client";
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import SiteSearch from "@/components/SiteSearch";

import { useSiteSettings } from "@/context/SiteSettingsContext";

function Navbar() {
  const { totalItems, isMenuOpen, setIsMenuOpen, setIsCartDrawerOpen } = useCart();
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth >= 768) {
            setIsScrolled(window.scrollY > 20);
          } else {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Bounce animation saat cart bertambah
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      window.requestAnimationFrame(() => {
        setCartBounce(true);
      });
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setProfile(null);
  }

  const handleOpenMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, [setIsMenuOpen]);

  const cartAriaLabel = useMemo(
    () =>
      totalItems > 0
        ? `Buka tas belanja (${totalItems} item)`
        : "Buka tas belanja",
    [totalItems],
  );



  const cartBadgeDisplay = useMemo(() => {
    return totalItems > 9 ? "9+" : totalItems;
  }, [totalItems]);

  const dropdownItems = useMemo(
    () => [
      { label: "Akun Saya", href: "/profile" },
      { label: "Pesanan Saya", href: "/orders" },
      { separator: true },
      { label: "Keluar" },
    ],
    [],
  );

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-500 ${isScrolled ? "-translate-y-full" : "translate-y-0"
        }`}>
        <div className="relative bg-brand-softblack py-2 px-5 overflow-hidden">
          {/* Subtle shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          {/* Dekorasi kiri */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 opacity-30">
            <span className="w-3 h-px bg-brand-gold" />
            <span className="w-1 h-1 rounded-full bg-brand-gold" />
          </div>
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-medium text-center text-brand-offwhite/90 relative z-10">
            {settings.marqueeText[0]}
          </p>
          {/* Dekorasi kanan */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 opacity-30">
            <span className="w-1 h-1 rounded-full bg-brand-gold" />
            <span className="w-3 h-px bg-brand-gold" />
          </div>
        </div>
      </div>

      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "top-0 bg-brand-offwhite/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(28,28,28,0.08)]"
            : "top-8 bg-brand-offwhite/90 backdrop-blur-xl"
          }`}
      >
        {/* Garis emas tipis di bawah nav */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

        <div
          className={`
            max-w-7xl mx-auto px-5 md:px-10
            grid grid-cols-[1fr_auto_1fr] items-center
            text-brand-softblack
            transition-all duration-500
            ${isScrolled ? "h-14 md:h-[60px]" : "h-14 md:h-[76px]"}
          `}
        >
          {/* ── KIRI: Nav links (desktop) + Hamburger (mobile) ── */}
          <div className="flex items-center gap-7">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {settings.navigation.main.map((item) => (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.megaMenu ? setIsMegaMenuOpen(true) : null}
                >
                  {item.megaMenu ? (
                    <Link
                      href={item.href}
                      className="nav-link-animated text-[10px] uppercase tracking-[0.34em] font-light text-brand-softblack/55 hover:text-brand-softblack transition-all duration-300 py-8"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav-link-animated text-[10px] uppercase tracking-[0.34em] font-light text-brand-softblack/55 hover:text-brand-softblack transition-all duration-300"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Hamburger — lebih premium */}
            <button
              onClick={handleOpenMenu}
              className="flex items-center gap-3 p-2 -ml-2 group md:hidden"
              aria-label="Buka menu navigasi"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="h-px w-5 bg-brand-softblack group-hover:w-6 transition-all duration-300" />
                <span className="h-px w-3.5 bg-brand-softblack group-hover:w-6 transition-all duration-300" />
              </span>
            </button>
          </div>

          {/* ── TENGAH: Logo ── */}
          <Link
            href="/"
            className="flex items-center justify-center group"
            aria-label="Ke halaman utama"
          >
            <span className="text-xl md:text-2xl font-medium uppercase text-brand-softblack transition-all duration-700 tracking-[0.5em] group-hover:tracking-[0.6em] group-hover:opacity-60">
              benangbaju
            </span>
          </Link>

          {/* ── KANAN: Icons ── */}
          <div className="flex items-center justify-end gap-1 md:gap-3">
            <div className="hidden md:block">
              <SiteSearch />
            </div>

            <Link
              href="/login"
              className="p-2 hover:opacity-50 transition-opacity hidden md:block"
            >
              <span className="text-[10px] uppercase tracking-widest font-light">Account</span>
            </Link>

            {/* Cart button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label={cartAriaLabel}
              className="p-2 hover:opacity-50 transition-opacity relative flex items-center gap-2"
            >
              <motion.div
                animate={cartBounce ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </motion.div>
              <span className="text-[10px] uppercase tracking-widest font-light hidden md:inline">Cart ({totalItems})</span>

              {/* Mobile badge */}
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="md:hidden absolute top-1 right-1 w-3.5 h-3.5 bg-brand-softblack text-white text-[7px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartBadgeDisplay}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── MEGA MENU OVERLAY ── */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              className="absolute top-full left-0 right-0 bg-brand-offwhite/98 backdrop-blur-xl border-b border-brand-softblack/5 shadow-[0_20px_60px_rgba(28,28,28,0.12)] overflow-hidden hidden md:block"
            >
              {/* Top gold line */}
              <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
              <div className="max-w-7xl mx-auto px-10 py-14 grid grid-cols-3 gap-16">
                {settings.navigation.main.find(i => i.megaMenu)?.megaMenu?.map((column, ci) => (
                  <div key={column.title}>
                    <h4 className="text-[9px] uppercase tracking-[0.45em] font-bold text-brand-gold/60 mb-7 flex items-center gap-3">
                      <span className="w-4 h-px bg-brand-gold/40" />
                      {column.title}
                    </h4>
                    <ul className="flex flex-col gap-4">
                      {column.items.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            href={subItem.href}
                            className="nav-link-animated text-xs uppercase tracking-[0.2em] font-light text-brand-softblack/60 hover:text-brand-softblack hover:pl-2 transition-all duration-300"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

export default memo(Navbar);
