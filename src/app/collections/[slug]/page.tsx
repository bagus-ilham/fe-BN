"use client";

import { useState, useMemo, useEffect, use } from "react";
import { listProductsByFilter } from "@/lib/application/products/product-query-service";
import HomeProductsGrid from "@/components/HomeProductsGrid";
import TextReveal from "@/components/ui/text-reveal";
import CollectionSidebar from "@/components/shop/CollectionSidebar";
import { SlidersHorizontal } from "lucide-react";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const slugMapping: Record<string, string> = {
  "best-seller": "Best Seller",
  "new-in": "New In",
  "sale": "Sale",
  "tops": "Atasan",
  "bottoms": "Bawahan",
  "dresses": "Dress",
  "accessories": "Aksesoris",
  "outerwear": "Outerwear",
  "kit": "Paket Koleksi",
  "bundles": "Paket Koleksi"
};

export default function CollectionSlugPage({ params }: CollectionPageProps) {
  const { slug } = use(params);
  return <CollectionSlugContent key={slug} slug={slug} />;
}

function CollectionSlugContent({ slug }: { slug: string }) {
  const initialCategory = slugMapping[slug] || "Semua Produk";
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [collection, setCollection] = useState("Semua Koleksi");
  const [sort, setSort] = useState("newest");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await listProductsByFilter({ is_active: true });
      setProducts(data);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Handle special slugs or categories
    if (slug === "best-seller") {
      result = result.filter(p => p.badge === "bestseller");
    } else if (slug === "new-in") {
      result = result.filter(p => p.badge === "new");
    } else if (slug === "sale") {
      result = result.filter(p => (p.oldPrice || 0) > (p.base_price || p.price || 0));
    } else {
      if (category !== "Semua Produk") {
        result = result.filter(p => p.category_id === category || p.category === category);
      } else if (slugMapping[slug]) {
        result = result.filter(p => p.category_id === slugMapping[slug] || p.category === slugMapping[slug]);
      }

      // Filter by collection if selected
      if (collection !== "Semua Koleksi") {
        result = result.filter(p => p.collection_id === collection || p.collection === collection);
      }
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.base_price || a.price) - (b.base_price || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.base_price || b.price) - (a.base_price || a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [products, category, collection, sort, slug]);

  const displayTitle = initialCategory !== "Semua Produk" ? initialCategory : (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "));

  return (
    <main className="bg-brand-offwhite min-h-screen pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="block text-[9px] uppercase tracking-[0.5em] text-brand-green mb-4 font-medium">
              Explore Collection
            </span>
            <TextReveal
              text={displayTitle}
              el="h1"
              className="text-4xl md:text-6xl font-light uppercase tracking-[-0.02em] text-brand-softblack leading-none"
              delay={0.1}
              duration={0.7}
            />
            <p className="text-xs text-brand-softblack/40 font-light max-w-md mt-6 leading-relaxed">
              Jelajahi pilihan terbaik kami untuk {displayTitle}. Koleksi yang dikurasi khusus untuk melengkapi gaya hidup Anda yang elegan dan modern.
            </p>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center gap-3 px-6 py-4 bg-white border border-stone-100 rounded-sm text-[10px] uppercase tracking-widest font-bold text-brand-softblack shadow-sm"
          >
            <SlidersHorizontal size={14} />
            Filter & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <CollectionSidebar 
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedCollection={collection}
              onCollectionChange={setCollection}
              selectedSort={sort}
              onSortChange={setSort}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Grid Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
              <span className="text-[10px] uppercase tracking-widest text-brand-softblack/40 font-medium">
                {filteredProducts.length} Produk ditemukan
              </span>
              <div className="hidden lg:flex items-center gap-4 text-[10px] uppercase tracking-widest text-brand-softblack/40 font-medium italic">
                <span className="text-brand-green">{displayTitle}</span>
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <HomeProductsGrid products={filteredProducts} />
            ) : (
              <div className="py-20 text-center">
                <p className="text-sm text-brand-softblack/40 uppercase tracking-[0.2em] font-light">Belum ada produk di koleksi ini.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
