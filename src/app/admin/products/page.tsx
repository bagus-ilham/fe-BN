import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ProductRow } from "@/types/database";
import { formatPrice } from "@/utils/format";
import AdminPagination from "@/components/admin/AdminPagination";
import { buildAdminHref } from "@/lib/admin/build-admin-href";

// Extended type for products with nested inventory data
interface ProductWithInventory extends ProductRow {
  category: string;
  inventory?: { stock_quantity: number }[];
}
import { listProductsForAdminPaged } from "@/lib/application/products/product-admin-service";

type AdminProductsPageProps = {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
    status?: string;
  }>;
};

function resolveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function resolveStatus(value: string | undefined): "active" | "draft" | undefined {
  if (value === "active" || value === "draft") return value;
  return undefined;
}

const basePath = "/admin/products";

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const page = Math.max(resolveInt(params?.page, 1), 1);
  const pageSize = Math.min(Math.max(resolveInt(params?.pageSize, 20), 10), 100);
  const q = params?.q?.trim() || "";
  const status = resolveStatus(params?.status);
  const isActive = status === "active" ? true : status === "draft" ? false : undefined;

  const paged = await listProductsForAdminPaged({
    page,
    pageSize,
    q,
    isActive,
  });
  const products = paged.data;
  const total = paged.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const query = { page: safePage, pageSize, q, status };
  const activeProducts = (products as ProductWithInventory[])?.filter((p) => p.is_active).length || 0;
  const lowStockProducts =
    (products as ProductWithInventory[])?.filter((p) => (p.inventory?.[0]?.stock_quantity ?? 0) <= 5).length || 0;
  

  return (
    <div className="space-y-5">
      {/* Header Action */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">
            Product Catalog
          </p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">
            Manajemen Produk
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F2EF] text-[9px] uppercase tracking-wider text-brand-softblack/60">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              {activeProducts} Aktif
            </span>
            {lowStockProducts > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[9px] uppercase tracking-wider text-red-500">
                <TrendingDown size={10} />
                {lowStockProducts} Low Stock
              </span>
            )}
            <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider">
              {products?.length || 0} ditampilkan
            </span>
          </div>
        </div>
        
        <Link 
          href="/admin/products/new"
          className="group inline-flex items-center gap-2 bg-brand-softblack text-brand-offwhite px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all duration-300 self-start shadow-lg shadow-brand-softblack/20"
        >
          <Plus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
          Tambah Produk
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <form action="/admin/products" method="get" className="relative flex-1">
          {status && <input type="hidden" name="status" value={status} />}
          {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={16} />
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Cari nama produk atau ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F2EF] rounded-xl border border-transparent text-sm text-brand-softblack placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/40 focus:border-brand-gold/30 outline-none transition-all"
          />
        </form>
        <div className="flex items-center gap-2">
          {[
            { href: buildAdminHref(basePath, query, { page: 1, status: "active" }), label: "Aktif", key: "active" },
            { href: buildAdminHref(basePath, query, { page: 1, status: "draft" }), label: "Draft", key: "draft" },
          ].map((btn) => (
            <Link
              key={btn.key}
              href={btn.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all ${
                status === btn.key
                  ? "bg-brand-softblack text-white shadow-md"
                  : "bg-[#F4F2EF] text-brand-softblack/55 hover:bg-brand-champagne"
              }`}
            >
              <Filter size={12} />
              {btn.label}
            </Link>
          ))}
          <Link
            href={buildAdminHref(basePath, query, { page: 1, status: undefined })}
            className="px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest bg-[#F4F2EF] text-brand-softblack/50 hover:bg-brand-champagne transition-all"
          >
            Reset
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Produk</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Kategori</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Harga</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Stok</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04]">
              {(products as unknown as ProductWithInventory[])?.map((product) => {
                const stock = product.inventory?.[0]?.stock_quantity ?? 0;
                const isLowStock = stock <= 5;
                
                return (
                  <tr key={product.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-11 h-14 bg-[#F4F2EF] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          {product.image_url ? (
                            <Image 
                              src={product.image_url} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-brand-softblack/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand-softblack leading-tight">{product.name}</div>
                          <div className="text-[9px] text-brand-softblack/30 uppercase tracking-wider mt-0.5">#{product.id.split('-')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] text-brand-softblack/50 font-light italic">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-brand-softblack">{formatPrice(product.base_price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isLowStock ? "text-red-500" : "text-brand-softblack"}`}>
                          {stock}
                        </span>
                        {isLowStock && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider bg-red-50 text-red-400 font-medium">
                            Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? "bg-emerald-400" : "bg-brand-softblack/20"}`} />
                        <span className="text-[10px] uppercase tracking-wider text-brand-softblack/55">
                          {product.is_active ? "Aktif" : "Draft"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/product/${product.id}`}
                          target="_blank"
                          className="p-2 hover:bg-[#F4F2EF] text-brand-softblack/35 hover:text-brand-softblack transition-colors rounded-xl"
                          title="Lihat di toko"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="p-2 hover:bg-brand-champagne/40 text-brand-softblack/35 hover:text-brand-green transition-colors rounded-xl"
                          title="Edit produk"
                        >
                          <Edit size={15} />
                        </Link>
                        <button 
                          type="button" 
                          className="p-2 hover:bg-red-50 text-brand-softblack/35 hover:text-red-500 transition-colors rounded-xl"
                          title="Hapus produk"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Package size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">
                      {q || status ? "Tidak ada produk yang cocok dengan filter saat ini." : "Belum ada produk terdaftar."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          basePath="/admin/products"
          page={safePage}
          pageSize={pageSize}
          total={total}
          query={{
            q,
            status,
          }}
        />
      </div>
    </div>
  );
}
