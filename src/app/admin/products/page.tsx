import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye 
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
    <div className="space-y-8">
      {/* Header Action */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Product Catalog
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Manajemen Produk
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Menampilkan {products?.length || 0} Produk • {activeProducts} Aktif • {lowStockProducts} Low Stock (halaman ini)
          </p>
        </div>
        
        <Link 
          href="/admin/products/new"
          className="bg-brand-softblack text-brand-offwhite px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-green transition-all duration-300 flex items-center gap-2 self-start"
        >
          <Plus size={16} />
          Tambah Produk
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="surface-card border border-gray-100/80 p-4 flex flex-col md:flex-row gap-4 items-center">
        <form action="/admin/products" method="get" className="relative flex-1 w-full">
          {status && <input type="hidden" name="status" value={status} />}
          {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Cari nama produk atau ID..."
            className="w-full pl-12 pr-4 py-3 bg-brand-offwhite/50 border-none text-sm focus:ring-1 focus:ring-brand-green/30 outline-none"
          />
        </form>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href={buildAdminHref(basePath, query, { page: 1, status: "active" })}
            className={`flex items-center gap-2 px-4 py-3 border text-xs uppercase tracking-widest transition-colors ${
              status === "active"
                ? "bg-brand-softblack text-white border-brand-softblack"
                : "text-brand-softblack/60 border-gray-100 hover:bg-brand-offwhite"
            }`}
          >
            <Filter size={16} />
            Aktif
          </Link>
          <Link
            href={buildAdminHref(basePath, query, { page: 1, status: "draft" })}
            className={`px-4 py-3 border text-xs uppercase tracking-widest transition-colors ${
              status === "draft"
                ? "bg-brand-softblack text-white border-brand-softblack"
                : "text-brand-softblack/60 border-gray-100 hover:bg-brand-offwhite"
            }`}
          >
            Draft
          </Link>
          <Link
            href={buildAdminHref(basePath, query, { page: 1, status: undefined })}
            className="px-4 py-3 border border-gray-100 text-xs uppercase tracking-widest text-brand-softblack/60 hover:bg-brand-offwhite transition-colors"
          >
            Reset
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-offwhite/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Produk</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Kategori</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Harga</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Stok</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products as unknown as ProductWithInventory[])?.map((product) => {
                const stock = product.inventory?.[0]?.stock_quantity ?? 0;
                
                return (
                  <tr key={product.id} className="hover:bg-brand-offwhite/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 bg-brand-offwhite overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <Image 
                              src={product.image_url} 
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">NO IMG</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-brand-softblack">{product.name}</div>
                          <div className="text-[10px] text-brand-softblack/30 uppercase tracking-tighter">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-softblack/60 font-light italic">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-softblack">
                      {formatPrice(product.base_price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${stock <= 5 ? 'text-red-500' : 'text-brand-softblack'}`}>
                          {stock}
                        </span>
                        <span className="text-[9px] text-brand-softblack/30 uppercase tracking-widest">Pcs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.is_active ? 'bg-brand-green' : 'bg-gray-300'}`} />
                      <span className="text-[10px] uppercase tracking-widest text-brand-softblack/60">
                        {product.is_active ? 'Aktif' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/product/${product.id}`}
                          target="_blank"
                          className="p-2 hover:bg-brand-offwhite text-brand-softblack/40 hover:text-brand-softblack transition-colors rounded-lg"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="p-2 hover:bg-brand-offwhite text-brand-softblack/40 hover:text-brand-green transition-colors rounded-lg"
                        >
                          <Edit size={16} />
                        </Link>
                        <button type="button" className="p-2 hover:bg-red-50 text-brand-softblack/40 hover:text-red-500 transition-colors rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
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
