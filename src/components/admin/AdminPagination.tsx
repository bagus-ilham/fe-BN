import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  return (
    <div className="px-6 py-4 border-t border-brand-softblack/[0.05] bg-[#F4F2EF]/30 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="text-[10px] text-brand-softblack/45">
        Menampilkan{" "}
        <span className="font-semibold text-brand-softblack/70">{fromRow}–{toRow}</span>{" "}
        dari{" "}
        <span className="font-semibold text-brand-softblack/70">{total}</span>{" "}
        data
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={buildAdminHref(basePath, query, { page: Math.max(safePage - 1, 1), pageSize })}
          aria-disabled={!canPrev}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] uppercase tracking-widest border transition-all ${
            canPrev
              ? "text-brand-softblack/70 border-brand-softblack/10 bg-white hover:bg-brand-champagne/40 hover:text-brand-softblack hover:border-brand-softblack/20"
              : "text-brand-softblack/20 border-brand-softblack/[0.05] bg-white pointer-events-none"
          }`}
        >
          <ChevronLeft size={13} />
          Prev
        </Link>

        <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-brand-softblack/[0.06]">
          <span className="text-[10px] font-bold text-brand-softblack/70">{safePage}</span>
          <span className="text-[10px] text-brand-softblack/25">/</span>
          <span className="text-[10px] text-brand-softblack/40">{totalPages}</span>
        </div>

        <Link
          href={buildAdminHref(basePath, query, { page: Math.min(safePage + 1, totalPages), pageSize })}
          aria-disabled={!canNext}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] uppercase tracking-widest border transition-all ${
            canNext
              ? "text-brand-softblack/70 border-brand-softblack/10 bg-white hover:bg-brand-champagne/40 hover:text-brand-softblack hover:border-brand-softblack/20"
              : "text-brand-softblack/20 border-brand-softblack/[0.05] bg-white pointer-events-none"
          }`}
        >
          Next
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
