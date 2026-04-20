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
import type { ProductDB, ProductWithInventory } from "@/types/database";
import { PRODUCTS } from "@/constants/products";

// Using ProductDB from @/types/database

const products = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: p.price,
  image_url: p.image,
  is_active: p.soldOut ? false : true,
  inventory: [{ stock_quantity: p.availableQuantity || 25 }]
}));

export default async function AdminProductsPage() {
  

  return (
    <div className="space-y-8">
      {/* Header Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Manajemen Produk
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Total {products?.length || 0} Produk Terdaftar
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
      <div className="surface-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama produk atau SKU..."
            className="w-full pl-12 pr-4 py-3 bg-brand-offwhite/50 border-none text-sm focus:ring-1 focus:ring-brand-green/30 outline-none"
          />
        </div>
        <button type="button" className="flex items-center gap-2 px-6 py-3 border border-gray-100 text-xs uppercase tracking-widest text-brand-softblack/60 hover:bg-brand-offwhite transition-colors">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="surface-card overflow-hidden">
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
                      Rp {product.price.toLocaleString('id-ID')}
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
                    <p className="text-sm font-light text-brand-softblack/40">Belum ada produk terdaftar.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
