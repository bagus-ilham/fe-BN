"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { ProductWithExtras } from "@/types/database";

import { ReviewSummary } from "@/types/review";
import { Inventory } from "@/types/database";

interface HomeProductsGridProps {
  products: ProductWithExtras[];
}

export default function HomeProductsGrid({ products }: HomeProductsGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary[]>([]);
  const [inventoryStatus, setInventoryStatus] = useState<Inventory[]>([]);

  useEffect(() => {
    /*
    if (!isInView) return;
    fetch("/api/reviews/summary")
      .then((r) => r.json())
      .then((data) => setReviewSummary(Array.isArray(data) ? data : []))
      .catch(() => setReviewSummary([]));

    fetch("/api/inventory/status")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInventoryStatus(
            data
              .filter((d: any) => d?.variant_id)
              .map(
                (d: any) => ({
                  ...d,
                  variant_id: d.variant_id,
                  available_quantity: (Number(d.stock_quantity) || 0) - (Number(d.reserved_quantity) || 0),
                }),
              ),
          );
        }
      })
      .catch(() => setInventoryStatus([]));
    */
  }, [isInView]);

  const productsWithReviews = useMemo(() => {
    const byId = new Map(reviewSummary.map((s) => [s.product_id, s]));
    const invById = new Map(
      inventoryStatus.map((i: any) => [i.variant_id, i.available_quantity]),
    );
    return products.map((p) => {
      const s = byId.get(p.id);
      const avail = invById.get(p.id);
      return {
        ...p,
        rating: s?.rating ?? 5,
        reviews_count: s?.reviews,
        available_quantity: avail,
      } as ProductWithExtras;
    });
  }, [products, reviewSummary, inventoryStatus]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHasMounted(true);
        setReducedMotion(Boolean(prefersReducedMotion));
      });
    });
    return () => cancelAnimationFrame(id);
  }, [prefersReducedMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: reducedMotion ? 1 : 0,
      y: reducedMotion ? 0 : 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const shouldAnimate = hasMounted && isInView;

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "show" : "hidden"}
      className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-x-8 sm:gap-y-14 items-stretch"
    >
      {productsWithReviews.map((product, index) => (
        <motion.div key={product.id} variants={cardVariants} className="h-full">
          {/* All cards now use the premium ProductCard for perfect uniformity */}
          <ProductCard product={product} priority={index < 4} />
        </motion.div>
      ))}
    </motion.div>
  );
}
