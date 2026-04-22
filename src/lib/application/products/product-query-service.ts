import { productRepository } from "@/lib/repositories/product-repository";
import { getMappedProductById, mapProductListForUI } from "@/lib/use-cases/product-use-cases";
import { ProductRow, ProductWithExtras } from "@/types/database";

type VariantWithProduct = {
  id: string;
  price: number;
  old_price: number | null;
  image_url: string | null;
  products: ProductRow | null;
};

export async function getProductById(id: string): Promise<ProductWithExtras | null> {
  return (await getMappedProductById(id)) as ProductWithExtras | null;
}

export async function getProductByVariantId(variantId: string): Promise<(ProductWithExtras & { variantId: string; quantity: number }) | null> {
  const { data: v, error } = await productRepository.getByVariantId(variantId);
  if (error || !v || !v.products) return null;
  const variant = v as unknown as VariantWithProduct;
  const p = variant.products;
  if (!p) return null;

  return {
    ...p,
    variantId: variant.id,
    base_price: variant.price,
    oldPrice: variant.old_price || undefined,
    image_url: variant.image_url || p.image_url || "/images/products/glow.jpeg",
    quantity: 1,
  };
}

export async function listActiveProducts(limit = 10): Promise<ProductWithExtras[]> {
  const { data, error } = await productRepository.listActive(limit);
  if (error || !data) return [];
  return mapProductListForUI(data as ProductWithExtras[]);
}

export async function listProductsByFilter(filters: {
  category?: string;
  collection?: string;
  badge?: string;
  is_active?: boolean;
}): Promise<ProductWithExtras[]> {
  const { data, error } = await productRepository.listByFilter(filters);
  if (error || !data) return [];
  return mapProductListForUI(data as ProductWithExtras[]);
}

export async function getRecommendedProducts(currentProductId: string, limit = 4): Promise<ProductWithExtras[]> {
  const { data: currentProduct } = await productRepository.getCategoryForProduct(currentProductId);
  const categoryId = currentProduct?.category_id;
  const { data, error } = await productRepository.listRecommended(currentProductId, categoryId, limit);
  if (error || !data || data.length === 0) return listActiveProducts(limit);
  return mapProductListForUI(data as ProductWithExtras[]);
}
