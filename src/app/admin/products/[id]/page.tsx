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
      .select("id, name, tagline, description, short_description, base_price, category_id, collection_id, image_url, badge, units_sold, rating, reviews_count, is_active, size_guide, care_instructions, key_highlights")
      .eq("id", id)
      .single();
    
    product = response.data;
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
        initialData={product as ProductRow} 
      />
    </div>
  );
}
