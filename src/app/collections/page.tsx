"use client";

import { useState, useMemo } from "react";
import { PRODUCTS } from "@/constants/products";
import HomeProductsGrid from "@/components/HomeProductsGrid";
import TextReveal from "@/components/ui/text-reveal";
import CollectionSidebar from "@/components/shop/CollectionSidebar";
import { SlidersHorizontal, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CollectionsPage() {
  const [category, setCategory] = useState("Semua Produk");
  const [collectionFilter, setCollectionFilter] = useState("Semua Koleksi");
  const [sort, setSort] = useState("newest");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (category !== "Semua Produk") {
      result = result.filter(p => p.category === category);
    }

    if (collectionFilter !== "Semua Koleksi") {
      result = result.filter(p => p.collection === collectionFilter);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.reverse();
        break;
    }

    return result;
  }, [category, collectionFilter, sort]);

  return (
    <main className="bg-brand-offwhite min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ── HEADER ── */}
        <div className="mb-12 md:mb-16">

          {/* Breadcrumb subtle */}
          <nav className="flex items-center gap-2 mb-6 text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">
            <span>Beranda</span>
            <svg className="w-2.5 h-2.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-brand-green/70">{category === "Semua Produk" ? "Koleksi" : category}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              {/* Decorative line */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-px bg-brand-gold/40" />
                <span className="text-[9px] uppercase tracking-[0.48em] text-brand-softblack/35 font-medium">
                  Koleksi Pilihan
                </span>
              </div>

              <TextReveal
                text={category === "Semua Produk" ? "Collections" : category}
                el="h1"
                className="text-4xl md:text-6xl font-light uppercase tracking-[-0.02em] text-brand-softblack leading-none"
                delay={0.1}
                duration={0.7}
              />
              <p className="text-xs text-brand-softblack/40 font-light max-w-md mt-5 leading-relaxed">
                Pilihan kurasi terbaik untuk gaya hidup modern Anda. Dari koleksi harian hingga edisi spesial yang dirancang dengan penuh rasa.
              </p>
            </div>

            {/* Mobile filter button — premium */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-3 px-6 py-3.5 bg-white border border-stone-200 shadow-sm text-[10px] uppercase tracking-widest font-semibold text-brand-softblack hover:border-brand-softblack/25 hover:shadow-md transition-all duration-300 rounded-sm"
            >
              <SlidersHorizontal size={13} />
              Filter & Sort
            </motion.button>
          </div>
        </div>

        {/* ── LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <CollectionSidebar
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedCollection={collectionFilter}
              onCollectionChange={setCollectionFilter}
              selectedSort={sort}
              onSortChange={setSort}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Grid area */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
              <motion.span
                key={filteredProducts.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] uppercase tracking-widest text-brand-softblack/40 font-medium"
              >
                {filteredProducts.length} Produk
              </motion.span>

              <div className="hidden lg:flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-brand-softblack/25 font-medium">
                  {category} {collectionFilter !== "Semua Koleksi" ? `• ${collectionFilter}` : ""}
                </span>
                <span className="w-1 h-1 rounded-full bg-brand-gold/40" />
                <span className="text-[9px] uppercase tracking-widest text-brand-green/60 font-medium">
                  {sort.replace("-", " ")}
                </span>
                <LayoutGrid size={12} className="text-brand-softblack/20 ml-2" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${collectionFilter}-${sort}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <HomeProductsGrid products={filteredProducts} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
