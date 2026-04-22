import { listCollections } from "@/lib/application/products/product-admin-service";
import CollectionsClient from "./CollectionsClient";

export default async function AdminCollectionsPage() {
  const collections = await listCollections();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Manajemen Koleksi
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Total {collections?.length || 0} Koleksi Aktif
          </p>
        </div>
      </div>

      <CollectionsClient initialCollections={collections} />
    </div>
  );
}
