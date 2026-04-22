import { productRepository } from "@/lib/repositories/product-repository";
import { ProductWithExtras } from "@/types/database";

type VariantColorRow = {
  color_hex?: string | null;
  color_name?: string | null;
  price?: number | null;
  old_price?: number | null;
};

type ProductImageRow = {
  sort_order?: number | null;
  image_url?: string | null;
};

type InventoryRow = {
  stock_quantity?: number | null;
  reserved_quantity?: number | null;
};

type VariantWithInventory = VariantColorRow & {
  inventory?: InventoryRow[] | null;
};

type ProductForUI = ProductWithExtras & {
  product_variants?: VariantWithInventory[] | null;
  product_images?: ProductImageRow[] | null;
};

function mapProductColors(product: ProductForUI) {
  const colorMap = new Map<string, { color: string; name?: string; price?: number; old_price?: number }>();
  (product.product_variants || []).forEach((v) => {
    if (v.color_hex && !colorMap.has(v.color_hex)) {
      colorMap.set(v.color_hex, {
        color: v.color_hex,
        name: v.color_name || undefined,
        price: v.price ?? undefined,
        old_price: v.old_price || undefined,
      });
    }
  });
  return Array.from(colorMap.values());
}

export function mapProductListForUI(products: ProductForUI[]): ProductWithExtras[] {
  return products.map((p) => ({
    ...p,
    color_variants: mapProductColors(p),
  }));
}

export async function getMappedProductById(id: string) {
  const { data, error } = await productRepository.getById(id);
  if (error || !data) return null;

  const typedData = data as unknown as ProductForUI;

  const images = (typedData.product_images || [])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((img) => img.image_url)
    .filter((img): img is string => Boolean(img));

  const totalStock = (typedData.product_variants || []).reduce((acc: number, v) => {
    const inv = v.inventory?.[0];
    return acc + (inv ? (inv.stock_quantity || 0) - (inv.reserved_quantity || 0) : 0);
  }, 0);

  return {
    ...typedData,
    color_variants: mapProductColors(typedData),
    additional_images: images,
    available_quantity: totalStock,
  };
}

