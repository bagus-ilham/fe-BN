export interface ProductDetailRow {
  label: string;
  value: string;
}

export interface ProductDetailsTableProps {
  productId: string;
  highlights?: any[];
  className?: string;
}

const DEFAULT_CARE_INSTRUCTIONS = "Cuci dengan warna serupa, jangan gunakan pemutih, setrika suhu rendah.";

export default function ProductDetailsTable({
  productId,
  highlights = [],
  className = "",
}: ProductDetailsTableProps) {
  // Use highlights from the database if available, otherwise use a default row
  const details: ProductDetailRow[] = highlights && highlights.length > 0 
    ? highlights.map(h => ({ label: h.name, value: h.detail }))
    : [
        { label: "Kualitas", value: "Premium Fashion" },
        { label: "Produksi", value: "Local Artisans" },
        { label: "Edisi", value: "benangbaju Original" }
      ];

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
