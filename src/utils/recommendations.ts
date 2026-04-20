import { PRODUCTS } from "@/constants/products";
import { KITS } from "@/constants/kits";
import type { Product } from "@/constants/products";
import type { Kit } from "@/constants/kits";

const MAX_PRODUCT_RECOMMENDATIONS = 4;
const MAX_KIT_RECOMMENDATIONS = 3;

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

/**
 * Untuk halaman kit: protokol lain yang berbagi produk
 * serta produk pelengkap (muncul di kit terkait).
 */
export function getFrequentlyBoughtTogetherForKit(kitId: string): {
  products: Product[];
  kits: Kit[];
} {
  const currentKit = KITS.find((k) => k.id === kitId);
  if (!currentKit) return { products: [], kits: [] };

  const currentProductIds = new Set(currentKit.products);

  // Kit yang berbagi minimal 1 produk (kecuali kit saat ini)
  const relatedKits = KITS.filter((k) => {
    if (k.id === kitId) return false;
    const shared = k.products.some((pid) => currentProductIds.has(pid));
    return shared;
  })
    .slice(0, MAX_KIT_RECOMMENDATIONS);

  // Produk yang tidak ada di kit saat ini tetapi muncul di kit terkait
  const productCounts = new Map<string, number>();
  for (const kit of relatedKits) {
    for (const pid of kit.products) {
      if (currentProductIds.has(pid)) continue;
      productCounts.set(pid, (productCounts.get(pid) ?? 0) + 1);
    }
  }

  const products = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_PRODUCT_RECOMMENDATIONS)
    .map(([id]) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return { products, kits: relatedKits };
}
