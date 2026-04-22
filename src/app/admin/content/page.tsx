import Link from "next/link";
import { FileText, PencilLine } from "lucide-react";
import { listCMSPagesForAdmin } from "@/lib/cms-service";
import type { CmsPage } from "@/types/database";

export default async function AdminContentPage() {
  const pages = await listCMSPagesForAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
          Manajemen Konten
        </h2>
        <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
          {pages.length} Halaman CMS
        </p>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="divide-y divide-brand-softblack/5">
          {pages.map((page: CmsPage) => (
            <div
              key={page.slug}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} className="text-brand-softblack/40" />
                  <h3 className="text-sm font-medium text-brand-softblack">
                    {page.title}
                  </h3>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-brand-softblack/40">
                  slug: {page.slug}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] uppercase tracking-widest ${
                    page.is_published
                      ? "text-brand-green"
                      : "text-brand-softblack/40"
                  }`}
                >
                  {page.is_published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/admin/content/${page.slug}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2 border border-brand-softblack/15 text-brand-softblack hover:bg-brand-offwhite transition-colors"
                >
                  <PencilLine size={14} />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
