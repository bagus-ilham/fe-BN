"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useEffect } from "react";

interface SidebarContentProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  collections: string[];
  selectedCollection: string;
  onCollectionChange: (collection: string) => void;
  sortOptions: Array<{ label: string, value: string }>;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  onClose?: () => void;
}

const SidebarContent = ({
  categories,
  selectedCategory,
  onCategoryChange,
  collections,
  selectedCollection,
  onCollectionChange,
  sortOptions,
  selectedSort,
  onSortChange,
  onClose
}: SidebarContentProps) => (
  <div className="h-full flex flex-col p-6 lg:p-0 bg-white lg:bg-transparent relative">
    {/* Top gold accent for mobile */}
    <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60 lg:hidden" />

    <div className="flex items-center justify-between mb-10 mt-2 lg:hidden">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-brand-gold" strokeWidth={1.5} />
        </div>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-softblack">
          Filter & Sort
        </h2>
      </div>
      <button onClick={onClose} className="p-2 text-brand-softblack/30 hover:text-brand-softblack bg-stone-50 hover:bg-stone-100 rounded-sm transition-colors">
        <X size={18} strokeWidth={1.5} />
      </button>
    </div>

      <div className="space-y-12">
        {/* Categories */}
        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-softblack/30 border-b border-stone-100 pb-4">
            Kategori
          </h3>
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onCategoryChange(cat);
                  onClose?.();
                }}
                className={`
                  text-left text-xs uppercase tracking-widest transition-all duration-300
                  ${selectedCategory === cat 
                    ? "text-brand-green font-bold translate-x-2" 
                    : "text-brand-softblack/50 hover:text-brand-softblack hover:translate-x-1"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-softblack/30 border-b border-stone-100 pb-4">
            Koleksi
          </h3>
          <div className="flex flex-col gap-4">
            {collections.map((col) => (
              <button
                key={col}
                onClick={() => {
                  onCollectionChange(col);
                  onClose?.();
                }}
                className={`
                  text-left text-xs uppercase tracking-widest transition-all duration-300
                  ${selectedCollection === col 
                    ? "text-brand-green font-bold translate-x-2" 
                    : "text-brand-softblack/50 hover:text-brand-softblack hover:translate-x-1"}
                `}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting */}
        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-softblack/30 border-b border-stone-100 pb-4">
            Urutkan
          </h3>
          <div className="flex flex-col gap-4">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  onClose?.();
                }}
                className={`
                  text-left text-xs uppercase tracking-widest transition-all duration-300
                  ${selectedSort === option.value 
                    ? "text-brand-green font-bold translate-x-2" 
                    : "text-brand-softblack/50 hover:text-brand-softblack hover:translate-x-1"}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Element */}
        <div className="pt-10 hidden lg:block">
          <div className="p-6 bg-brand-champagne/20 rounded-sm border border-brand-champagne/10">
            <p className="text-[10px] italic leading-relaxed text-brand-softblack/40">
              &ldquo;Setiap helai benang menceritakan kisah tentang kenyamanan dan kepercayaan diri.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
);

interface CollectionSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCollection: string;
  onCollectionChange: (collection: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CollectionSidebar({
  selectedCategory,
  onCategoryChange,
  selectedCollection,
  onCollectionChange,
  selectedSort,
  onSortChange,
  isOpen = false,
  onClose
}: CollectionSidebarProps) {
  const { settings } = useSiteSettings();
  const categories = ["Semua Produk", ...settings.categories];
  const collections = ["Semua Koleksi", ...settings.collections];

  const sortOptions = [
    { label: "Terbaru", value: "newest" },
    { label: "Harga: Rendah ke Tinggi", value: "price-asc" },
    { label: "Harga: Tinggi ke Rendah", value: "price-desc" },
    { label: "Nama: A-Z", value: "name-asc" },
  ];

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const sidebarContentProps = {
    categories,
    selectedCategory,
    onCategoryChange,
    collections,
    selectedCollection,
    onCollectionChange,
    sortOptions,
    selectedSort,
    onSortChange,
    onClose
  };

  return (
    <>
      {/* Mobile Backdrop & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-brand-softblack/50 backdrop-blur-[4px]"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[85%] max-w-sm h-full shadow-2xl bg-white"
            >
              <SidebarContent {...sidebarContentProps} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible on lg) */}
      <aside className="hidden lg:block w-full">
        <SidebarContent {...sidebarContentProps} />
      </aside>
    </>
  );
}
