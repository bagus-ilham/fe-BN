import { listInventory } from "@/lib/application/products/product-admin-service";
import InventoryClient from "./InventoryClient";

export default async function AdminInventoryPage() {
  const inventory = await listInventory();
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
          Stok & Inventaris
        </h2>
        <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
          Pantau dan perbarui ketersediaan produk
        </p>
      </div>

      <InventoryClient initialInventory={inventory} />
    </div>
  );
}
