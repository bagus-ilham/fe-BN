import { PRODUCTS } from "@/constants/products";

export interface ProductDetailRow {
  label: string;
  value: string;
}

export interface ProductDetailsTableProps {
  productId: string;
  className?: string;
}

const DEFAULT_CARE_INSTRUCTIONS = "Cuci dengan warna serupa, jangan gunakan pemutih, setrika suhu rendah.";

export default function ProductDetailsTable({
  productId,
  className = "",
}: ProductDetailsTableProps) {
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) return null;

  // In a real app, these details would come from the product object/database
  // For this fashion rebranding, we provide context-aware details
  const getDetails = (id: string): ProductDetailRow[] => {
    switch (id) {
      case "prod_1":
        return [
          { label: "Bahan", value: "Batik Premium" },
          { label: "Fit", value: "True to size (A-Line)" },
          { label: "Elastisitas", value: "Tidak Ada" },
          { label: "Ketebalan", value: "Sedang" },
          { label: "Produksi", value: "Handmade di Jawa Tengah" },
        ];
      case "prod_2":
      case "prod_5":
        return [
          { label: "Bahan", value: "Linen Premium Impor" },
          { label: "Fit", value: "Relaxed Fit" },
          { label: "Ketebalan", value: "Ringan (Breathable)" },
          { label: "Tekstur", value: "Khas Serat Linen" },
          { label: "Produksi", value: "Jakarta, Indonesia" },
        ];
      case "prod_3":
        return [
          { label: "Bahan", value: "Plisket Premium" },
          { label: "Fit", value: "Adjustable (Waistband)" },
          { label: "Tekstur", value: "Lipit Halus" },
          { label: "Produksi", value: "Bandung, Indonesia" },
        ];
      case "prod_4":
        return [
          { label: "Bahan", value: "Katun Combed 30s" },
          { label: "Fit", value: "Standar" },
          { label: "Kenyamanan", value: "Sangat Lembut" },
          { label: "Produksi", value: "Solo, Indonesia" },
        ];
      default:
        return [
          { label: "Bahan", value: "Kualitas Premium" },
          { label: "Produksi", value: "Indonesia" },
        ];
    }
  };

  const details = getDetails(productId);

  return (
    <div
      className={`bg-white text-black border border-black/10 rounded-sm overflow-hidden ${className}`}
      style={{ minWidth: 280 }}
    >
      {/* Title */}
      <div className="border-b-2 border-black py-3 px-4">
        <div className="text-center font-bold text-sm uppercase tracking-wide">
          Detail Produk
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-xs text-left">
        <tbody>
          {details.map((row, i) => (
            <tr
              key={i}
              className="border-b border-black/10 last:border-b-0"
            >
              <td className="py-2.5 px-4 font-medium bg-brand-offwhite/30 w-[40%]">
                {row.label}
              </td>
              <td className="py-2.5 px-4 text-brand-softblack/80">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Care Instructions */}
      <div className="border-t-2 border-black py-3 px-4 text-[10px] leading-relaxed">
        <p className="font-bold uppercase mb-1">Instruksi Perawatan:</p>
        <p className="opacity-70">{DEFAULT_CARE_INSTRUCTIONS}</p>
        <p className="font-medium mt-3 italic">Dibuat dengan bangga di Indonesia.</p>
      </div>
    </div>
  );
}
