import Link from "next/link";
import { buildAdminHref, type AdminQueryValue } from "@/lib/admin/build-admin-href";

export default function AdminPagination(props: {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  query?: Record<string, AdminQueryValue>;
}) {
  const page = Math.max(props.page, 1);
  const pageSize = Math.min(Math.max(props.pageSize, 10), 100);
  const total = Math.max(props.total, 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const fromRow = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const toRow = Math.min(safePage * pageSize, total);

  const query = props.query || {};
  const basePath = props.basePath;

  return (
    <div className="px-6 py-5 border-t border-gray-100 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="text-xs text-brand-softblack/50">
        Menampilkan <span className="text-brand-softblack/80">{fromRow}-{toRow}</span> dari{" "}
        <span className="text-brand-softblack/80">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={buildAdminHref(basePath, query, { page: Math.max(safePage - 1, 1), pageSize })}
          aria-disabled={safePage <= 1}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
            safePage <= 1
              ? "text-brand-softblack/30 border-gray-100 pointer-events-none"
              : "text-brand-softblack/70 border-gray-100 hover:text-brand-softblack hover:border-gray-200"
          }`}
        >
          Prev
        </Link>

        <span className="text-[10px] uppercase tracking-widest text-brand-softblack/40 px-2">
          Page {safePage} / {totalPages}
        </span>

        <Link
          href={buildAdminHref(basePath, query, { page: Math.min(safePage + 1, totalPages), pageSize })}
          aria-disabled={safePage >= totalPages}
          className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
            safePage >= totalPages
              ? "text-brand-softblack/30 border-gray-100 pointer-events-none"
              : "text-brand-softblack/70 border-gray-100 hover:text-brand-softblack hover:border-gray-200"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

