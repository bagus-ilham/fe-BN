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
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
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
