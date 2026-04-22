"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  Home,
  BookOpen,
  User,
  Package,
  X,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { formatPrice } from "@/utils/format";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";


const quickLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/about", label: "Tentang Kami", icon: BookOpen },
  { href: "/collections/semua-produk", label: "Koleksi Terbaru", icon: Package },
  { href: "/profile", label: "Akun Saya", icon: User },
  { href: "/orders", label: "Pesanan Saya", icon: Package },
];

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && products.length === 0) {
      const fetchProducts = async () => {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .is("deleted_at", null)
          .eq("is_active", true);
        
        if (data) setProducts(data);
      };
      fetchProducts();
    }
  }, [open, products.length]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.tagline && p.tagline.toLowerCase().includes(term))
    );
  }, [query, products]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && window.innerWidth >= 768) {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* Desktop trigger — dengan shortcut hint */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 pl-3 pr-2.5 py-1.5 bg-brand-offwhite/0 border border-brand-softblack/8 hover:border-brand-softblack/20 rounded-sm text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/50 hover:text-brand-softblack transition-all duration-300 group"
        aria-label="Cari (Cmd+K)"
      >
        <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="hidden lg:block">Cari</span>
        <kbd className="hidden lg:flex items-center gap-0.5 ml-1 px-1.5 py-0.5 bg-brand-softblack/6 border border-brand-softblack/8 rounded text-[8px] font-mono text-brand-softblack/35">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-brand-softblack/60 hover:text-brand-softblack transition-colors"
        aria-label="Cari"
      >
        <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <div
            data-command-palette
            className="fixed inset-0 z-[100] flex items-start justify-center pt-0 md:pt-[12vh] px-0 md:px-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-brand-softblack/40 backdrop-blur-sm"
              onClick={handleBackdropClick} 
            />

            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col w-screen h-screen md:w-full md:h-auto md:max-w-2xl md:max-h-[80vh] bg-brand-offwhite md:shadow-2xl rounded-none md:rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-softblack/10 bg-white">
                <Search className="w-5 h-5 text-brand-softblack/40 shrink-0" strokeWidth={1.5} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari koleksi, produk, atau kategori..."
                  className="flex-1 bg-transparent outline-none text-base md:text-lg text-brand-softblack placeholder:text-brand-softblack/30 font-light"
                />
                <button
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-brand-softblack/50 hover:text-brand-softblack transition-colors"
                  aria-label="Tutup pencarian"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 md:max-h-[60vh] overflow-y-auto bg-brand-offwhite pb-6">
                {!query.trim() && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="p-6"
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/40 font-medium mb-4">
                      Saran Pencarian
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["Batik", "Linen", "Rok", "Blouse", "Knit"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setQuery(suggestion)}
                          className="px-4 py-2 text-[10px] uppercase tracking-widest border border-brand-softblack/10 text-brand-softblack bg-white hover:border-brand-green hover:text-brand-green transition-all duration-300 rounded-full shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>

                    <div className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/40 font-medium mb-4">
                      Navigasi Cepat
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {quickLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                          <button
                            key={link.href}
                            onClick={() => handleSelect(link.href)}
                            className="group flex items-center gap-4 px-4 py-4 text-left text-sm text-brand-softblack/70 bg-white hover:bg-brand-softblack/5 hover:text-brand-softblack transition-all duration-300 rounded-xl shadow-sm border border-transparent hover:border-brand-softblack/10"
                          >
                            <IconComponent className="w-4 h-4 text-brand-softblack/40 group-hover:text-brand-green transition-colors" strokeWidth={1.5} />
                            <span className="flex-1 font-light">{link.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-brand-softblack/20 group-hover:text-brand-softblack group-hover:translate-x-1 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {query.trim() && (
                  <div className="p-6">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/40 font-medium mb-4 flex items-center justify-between">
                          <span>Produk ({searchResults.length})</span>
                        </div>
                        <div className="space-y-3">
                          {searchResults.map((product, index) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              key={product.id}
                            >
                              <Link
                                href={`/product/${product.id}`}
                                onClick={() => {
                                  setOpen(false);
                                  setQuery("");
                                }}
                                className="group flex items-center gap-4 p-3 bg-white hover:bg-brand-softblack/5 rounded-xl transition-all duration-300 shadow-sm border border-transparent hover:border-brand-softblack/10"
                              >
                                <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-brand-champagne">
                                  <Image
                                    src={product.image_url || "/images/products/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    sizes="64px"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div className="text-sm font-medium text-brand-softblack mb-1 group-hover:text-brand-green transition-colors">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-brand-softblack/40 line-clamp-1 font-light">
                                    {product.description}
                                  </div>
                                </div>
                                <div className="text-xs font-medium text-brand-softblack shrink-0 pr-2">
                                  {formatPrice(product.base_price)}
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="py-16 text-center px-6"
                      >
                        {/* Ilustrasi dekoratif */}
                        <div className="w-16 h-16 mx-auto mb-5 opacity-20">
                          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="27" cy="27" r="17" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M40 40 L56 56" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M20 27 H34" stroke="#C9A47E" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M27 20 V34" stroke="#C9A47E" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-brand-softblack/60 mb-2">
                          Tidak ada hasil untuk &ldquo;<span className="text-brand-softblack">{query}</span>&rdquo;
                        </p>
                        <p className="text-[10px] font-light text-brand-softblack/35 mb-5 leading-relaxed">
                          Coba dengan kata kunci yang berbeda
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {["Batik", "Linen", "Rok", "Blouse", "Knit"].map((s) => (
                            <button
                              key={s}
                              onClick={() => setQuery(s)}
                              className="px-3 py-1.5 text-[9px] uppercase tracking-widest border border-brand-softblack/10 text-brand-softblack/50 bg-white hover:border-brand-green hover:text-brand-green rounded-full transition-all duration-200"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Desktop */}
              <div className="hidden md:flex items-center justify-between px-6 py-4 border-t border-brand-softblack/5 bg-white text-[10px] uppercase tracking-widest text-brand-softblack/40 font-medium">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-brand-offwhite border border-brand-softblack/10 rounded-md text-brand-softblack/60 font-mono">
                      ↑↓
                    </kbd>
                    Navigasi
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-1.5 py-0.5 bg-brand-offwhite border border-brand-softblack/10 rounded-md text-brand-softblack/60 font-mono">
                      ↵
                    </kbd>
                    Pilih
                  </span>
                </div>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-brand-offwhite border border-brand-softblack/10 rounded-md text-brand-softblack/60 font-mono">
                    ESC
                  </kbd>
                  Tutup
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
