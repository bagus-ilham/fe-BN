import { productRepository } from "@/lib/repositories/product-repository";
import { Category, Collection, ProductRow, PromoCode } from "@/types/database";

type ProductInput = Record<string, unknown>;
type ProductVariantInput = Record<string, unknown>;
type AdminProductRow = ProductRow & {
  categories?: { name?: string | null } | null;
  product_variants?: Array<{ inventory?: Array<{ stock_quantity?: number | null }> | null }> | null;
};

export type ProductMutationPayload = {
  product: ProductInput;
  variants?: ProductVariantInput[];
  images?: string[];
};

export async function listAllProductsForAdmin(): Promise<Array<ProductRow & { category: string; inventory: Array<{ stock_quantity: number }> }>> {
  const { data, error } = await productRepository.listForAdmin();
  if (error || !data) return [];

  return (data as unknown as AdminProductRow[]).map((p) => {
    const totalStock = (p.product_variants || []).reduce((acc, v) => acc + (v.inventory?.[0]?.stock_quantity || 0), 0);
    return { ...p, category: p.categories?.name || "Uncategorized", inventory: [{ stock_quantity: totalStock }] };
  });
}

export async function listProductsForAdminPaged(input: {
  page: number;
  pageSize: number;
  isActive?: boolean;
  q?: string;
}): Promise<{
  data: Array<ProductRow & { category: string; inventory: Array<{ stock_quantity: number }> }>;
  total: number;
  page: number;
  pageSize: number;
}> {
  const pageSize = Math.min(Math.max(input.pageSize || 20, 10), 100);
  const page = Math.max(input.page || 1, 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = input.q?.trim();

  const { data, error, count } = await productRepository.listForAdminPaged({
    from,
    to,
    isActive: input.isActive,
    q: q && q.length > 0 ? q : undefined,
  });

  if (error || !data) {
    return {
      data: [],
      total: 0,
      page,
      pageSize,
    };
  }

  const mapped = (data as unknown as AdminProductRow[]).map((p) => {
    const totalStock = (p.product_variants || []).reduce((acc, v) => acc + (v.inventory?.[0]?.stock_quantity || 0), 0);
    return { ...p, category: p.categories?.name || "Uncategorized", inventory: [{ stock_quantity: totalStock }] };
  });

  return {
    data: mapped,
    total: count || 0,
    page,
    pageSize,
  };
}

export async function saveProductFromAdminPayload(payload: ProductMutationPayload) {
  const product = payload.product || {};
  const variants = payload.variants || [];
  const images = payload.images || [];
  const { id, ...productData } = product as ProductInput & { id?: string };
  let productId = id || (productData as { id?: string }).id;

  if (!productId || productId === "") {
    const slug = String(productData.name || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    productId = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  const { data: savedProduct, error: pError } = await productRepository.upsertProductAdmin(productId, productBaseCleanup(productData));
  if (pError) throw pError;

  const variantResults = await Promise.all(variants.map((variant) => productRepository.upsertProductVariantAdmin(productId!, variant)));
  const variantError = variantResults.find((r) => r.error)?.error;
  if (variantError) throw variantError;

  const { error: deleteImageError } = await productRepository.deleteProductImagesByProductId(productId!);
  if (deleteImageError) throw deleteImageError;
  if (images.length > 0) {
    const { error: insertImageError } = await productRepository.insertProductImages(productId!, images);
    if (insertImageError) throw insertImageError;
  }

  return savedProduct;
}

export async function listCategories() {
  const { data } = await productRepository.listCategories();
  return (data || []) as Category[];
}
export async function saveCategory(category: Partial<Category>) {
  const { data, error } = await productRepository.saveCategory(category);
  if (error) throw error;
  return data as Category;
}
export async function deleteCategory(id: string) {
  const { error } = await productRepository.deleteCategory(id);
  if (error) throw error;
  return true;
}
export async function listCollections() {
  const { data } = await productRepository.listCollections();
  return (data || []) as Collection[];
}
export async function saveCollection(collection: Partial<Collection>) {
  const { data, error } = await productRepository.saveCollection(collection);
  if (error) throw error;
  return data as Collection;
}
export async function deleteCollection(id: string) {
  const { error } = await productRepository.deleteCollection(id);
  if (error) throw error;
  return true;
}
export async function listPromoCodes() {
  const { data } = await productRepository.listPromoCodes();
  return (data || []) as PromoCode[];
}
export async function savePromoCode(promo: Partial<PromoCode>) {
  const { data, error } = await productRepository.savePromoCode(promo);
  if (error) throw error;
  return data as PromoCode;
}
export async function listInventory() {
  const { data } = await productRepository.listInventory();
  return data || [];
}
export async function updateStock(variantId: string, quantity: number) {
  const { data, error } = await productRepository.updateStock(variantId, quantity);
  if (error) throw error;
  return data;
}

function productBaseCleanup(data: ProductInput) {
  const { sizes, stock_quantity, color_variants, additional_images, ...clean } = data;
  return clean;
}
