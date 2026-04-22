import { listPromoCodes } from "@/lib/application/products/product-admin-service";
import DiscountsClient from "./DiscountsClient";

export default async function AdminDiscountsPage() {
  const promoCodes = await listPromoCodes();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Diskon & Promo
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Manajemen Kode Kupon dan Flash Sale
          </p>
        </div>
      </div>

      <DiscountsClient initialPromoCodes={promoCodes} />
    </div>
  );
}
