import { getSupabaseAdmin, supabase } from "@/utils/supabase";

export const productRepository = {
  getById(id: string) {
    return supabase
      .from("products")
      .select(`
        id, name, tagline, description, short_description, base_price,
        category_id, collection_id, image_url, badge, units_sold,
        rating, reviews_count, is_active, size_guide, care_instructions,
        key_highlights, material, created_at, updated_at,
        product_variants (
          id, color_name, color_hex, size, price, old_price, image_url, inventory (*)
        ),
        product_images (id, image_url, sort_order)
      `)
      .eq("id", id)
      .single();
  },
  getByVariantId(variantId: string) {
    return supabase
      .from("product_variants")
      .select("*, products (*)")
      .eq("id", variantId)
      .single();
  },
  listActive(limit: number) {
    return supabase
      .from("products")
      .select(`
        *,
        product_variants (price, old_price, color_hex, color_name)
      `)
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("units_sold", { ascending: false })
      .limit(limit);
  },
  listForAdmin() {
    const admin = getSupabaseAdmin();
    return admin
      .from("products")
      .select(`
        id, name, tagline, description, short_description, base_price,
        category_id, collection_id, image_url, badge, units_sold,
        rating, reviews_count, is_active, created_at, updated_at,
        categories (name),
        product_variants (
          id, price, old_price, color_hex, color_name, inventory (stock_quantity)
        )
      `)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
  },
  listForAdminPaged(params: { from: number; to: number; isActive?: boolean; q?: string }) {
    const admin = getSupabaseAdmin();
    let query = admin
      .from("products")
      .select(
        `
        id, name, tagline, description, short_description, base_price,
        category_id, collection_id, image_url, badge, units_sold,
        rating, reviews_count, is_active, created_at, updated_at,
        categories (name),
        product_variants (
          id, price, old_price, color_hex, color_name, inventory (stock_quantity)
        )
      `,
        { count: "exact" }
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(params.from, params.to);

    if (params.isActive !== undefined) {
      query = query.eq("is_active", params.isActive);
    }

    if (params.q) {
      const escaped = params.q.replaceAll("%", "\\%").replaceAll("_", "\\_");
      query = query.or(`id.ilike.%${escaped}%,name.ilike.%${escaped}%`);
    }

    return query;
  },
  listByFilter(filters: {
    category?: string;
    collection?: string;
    badge?: string;
    is_active?: boolean;
  }) {
    let query = supabase
      .from("products")
      .select(`*, product_variants (price, old_price, color_hex, color_name)`)
      .is("deleted_at", null);
    if (filters.category) query = query.eq("category_id", filters.category);
    if (filters.collection) query = query.eq("collection_id", filters.collection);
    if (filters.badge) query = query.eq("badge", filters.badge);
    if (filters.is_active !== undefined) query = query.eq("is_active", filters.is_active);
    return query.order("created_at", { ascending: false });
  },
  getCategoryForProduct(productId: string) {
    return supabase.from("products").select("category_id").eq("id", productId).single();
  },
  listRecommended(currentProductId: string, categoryId: string | null, limit: number) {
    let query = supabase
      .from("products")
      .select(`*, product_variants (price, old_price, color_hex, color_name)`)
      .eq("is_active", true)
      .is("deleted_at", null)
      .neq("id", currentProductId);
    if (categoryId) query = query.eq("category_id", categoryId);
    return query.order("units_sold", { ascending: false }).limit(limit);
  },
  listCategories() {
    return supabase.from("categories").select("*").order("name");
  },
  saveCategory(category: Record<string, unknown>) {
    return getSupabaseAdmin().from("categories").upsert(category).select().single();
  },
  deleteCategory(id: string) {
    return getSupabaseAdmin().from("categories").delete().eq("id", id);
  },
  listCollections() {
    return supabase.from("collections").select("*").order("name");
  },
  saveCollection(collection: Record<string, unknown>) {
    return getSupabaseAdmin().from("collections").upsert(collection).select().single();
  },
  deleteCollection(id: string) {
    return getSupabaseAdmin().from("collections").delete().eq("id", id);
  },
  listPromoCodes() {
    return supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
  },
  savePromoCode(promo: Record<string, unknown>) {
    return getSupabaseAdmin().from("promo_codes").upsert(promo).select().single();
  },
  listInventory() {
    return supabase
      .from("product_variants")
      .select(`
        id, color_name,
        products (name, image_url),
        inventory (stock_quantity, low_stock_threshold)
      `)
      .order("id");
  },
  updateStock(variantId: string, quantity: number) {
    return getSupabaseAdmin()
      .from("inventory")
      .upsert({ variant_id: variantId, stock_quantity: quantity }, { onConflict: "variant_id" })
      .select()
      .single();
  },
  upsertProductAdmin(productId: string, productData: any) {
    const payload = {
      id: productId,
      name: productData.name,
      tagline: productData.tagline || null,
      description: productData.description || null,
      short_description: productData.short_description || null,
      base_price: productData.base_price || 0,
      category_id: productData.category_id || null,
      collection_id: productData.collection_id || null,
      image_url: productData.image_url || null,
      badge: productData.badge || null,
      is_active: productData.is_active ?? true,
      material: productData.material || null,
      size_guide: productData.size_guide || null,
      care_instructions: productData.care_instructions || null,
      key_highlights: productData.key_highlights || [],
      updated_at: new Date().toISOString(),
    };

    return getSupabaseAdmin()
      .from("products")
      .upsert(payload)
      .select()
      .single();
  },
  upsertProductVariantAdmin(productId: string, variant: any) {
    const payload = {
      ...(variant.id ? { id: variant.id } : {}),
      product_id: productId,
      color_hex: variant.color || variant.color_hex || null,
      color_name: variant.name || variant.color_name || null,
      size: variant.size || null,
      price: variant.price || 0,
      old_price: variant.old_price || null,
      image_url: variant.image_url || null,
      sku: variant.sku || null,
      is_active: variant.is_active ?? true,
      updated_at: new Date().toISOString(),
    };
    
    return getSupabaseAdmin()
      .from("product_variants")
      .upsert(payload);
  },
  deleteProductImagesByProductId(productId: string) {
    return getSupabaseAdmin().from("product_images").delete().eq("product_id", productId);
  },
  insertProductImages(productId: string, images: string[]) {
    const imageData = images.map((url, index) => ({
      product_id: productId,
      image_url: url,
      sort_order: index,
    }));
    return getSupabaseAdmin().from("product_images").insert(imageData);
  },
};

