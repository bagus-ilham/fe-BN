import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import type { ProductRow } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  let product = null;
  let error = null;

  try {
    const { getSupabaseAdmin } = await import("@/utils/supabase");
    const supabaseAdmin = getSupabaseAdmin();
    
    const response = await supabaseAdmin
      .from("products")
      .select(`
        id, name, tagline, description, short_description, base_price, 
        category_id, collection_id, image_url, badge, units_sold, 
        rating, reviews_count, is_active, size_guide, care_instructions, 
        key_highlights, material, deleted_at, created_at, updated_at,
        product_variants (
          id, color_name, color_hex, size, price, old_price, image_url
        ),
        product_images (id, image_url, sort_order)
      `)
      .eq("id", id)
      .single();
    
    if (response.data) {
      product = {
        ...response.data,
        color_variants: (response.data as any).product_variants?.map((v: any) => ({
          id: v.id,
          color: v.color_hex,
          name: v.color_name,
          price: v.price,
          old_price: v.old_price
        })) || [],
        additional_images: (response.data as any).product_images?.map((img: any) => img.image_url) || []
      };
    }
    error = response.error;
  } catch (err) {
    console.error("Admin fetch error:", err);
  }

  if (error || !product) {
    notFound();
  }

  return (
    <div className="pb-24">
      <ProductForm 
        isEditing={true} 
        initialData={product as unknown as ProductRow} 
      />
    </div>
  );
}
