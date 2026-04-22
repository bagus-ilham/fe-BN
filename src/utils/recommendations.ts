import { PRODUCTS } from "@/constants/products";
import { KITS } from "@/constants/kits";
import type { Product } from "@/constants/products";

const MAX_PRODUCT_RECOMMENDATIONS = 4;

/**
 * Produk yang muncul pada protokol/kit yang sama dengan produk saat ini.
 * Berdasarkan struktur kit - produk yang sering muncul bersama
 * cenderung dibeli bersamaan.
 */
export function getFrequentlyBoughtTogetherProducts(
  productId: string
): Product[] {
  const kitsWithProduct = KITS.filter((k) => k.products.includes(productId));
  const productCounts = new Map<string, number>();

  for (const kit of kitsWithProduct) {
    for (const pid of kit.products) {
      if (pid === productId) continue;
      productCounts.set(pid, (productCounts.get(pid) ?? 0) + 1);
    }
  }

  const sorted = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_PRODUCT_RECOMMENDATIONS)
    .map(([id]) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return sorted;
}

