import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Tag
} from "lucide-react";
import { listCategories } from "@/lib/application/products/product-admin-service";
import CategoriesClient from "./CategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Manajemen Kategori
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Total {categories?.length || 0} Kategori Produk
          </p>
        </div>
      </div>

      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
