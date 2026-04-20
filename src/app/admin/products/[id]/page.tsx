import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import type { ProductDB } from "@/types/database";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  let supabase = null;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );
  }
  
  let product = null;
  let error = null;

  if (supabase) {
    const response = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    product = response.data;
    error = response.error;
  }

  // Fallback ke data mock untuk keperluan demo/pengembangan jika tidak ada di DB
  if (error || !product) {
    product = {
      id: id,
      name: "Produk Mockup " + id,
      price: 259000,
      category: "Atasan",
      image_url: "https://images.unsplash.com/photo-1539109132314-34a91655cc8a?auto=format&fit=crop&q=80&w=1974",
      description: "Ini adalah deskripsi produk mockup untuk tujuan pengembangan.",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as any;
  }

  return (
    <div className="pb-24">
      <ProductForm 
        isEditing={true} 
        initialData={product as ProductDB} 
      />
    </div>
  );
}
