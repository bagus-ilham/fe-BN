import Link from "next/link";
import { FileText, PencilLine, Globe, CheckCircle2, FileX } from "lucide-react";
import { listCMSPagesForAdmin } from "@/lib/cms-service";
import type { CmsPage } from "@/types/database";

export default async function AdminContentPage() {
  const pages = await listCMSPagesForAdmin();
  const publishedCount = pages.filter((p: CmsPage) => p.is_published).length;
  const draftCount = pages.length - publishedCount;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">CMS</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Manajemen Konten</h2>
          <p className="text-[11px] text-brand-softblack/40">{pages.length} halaman tersedia untuk diedit</p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-[9px] uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {publishedCount} Published
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F2EF] text-brand-softblack/50 border border-brand-softblack/[0.06] text-[9px] uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-softblack/25" />
            {draftCount} Draft
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="divide-y divide-brand-softblack/[0.04]">
          {pages.map((page: CmsPage) => (
            <div key={page.slug} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-brand-offwhite/50 transition-colors group">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${page.is_published ? "bg-emerald-50 text-emerald-500" : "bg-[#F4F2EF] text-brand-softblack/30"}`}>
                  {page.is_published ? <Globe size={15} strokeWidth={1.5} /> : <FileX size={15} strokeWidth={1.5} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[12px] font-medium text-brand-softblack truncate">{page.title}</h3>
                  </div>
                  <p className="text-[9px] uppercase tracking-wider text-brand-softblack/30">/{page.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${
                  page.is_published
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                    : "bg-[#F4F2EF] text-brand-softblack/35 border-brand-softblack/10"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${page.is_published ? "bg-emerald-400" : "bg-brand-softblack/25"}`} />
                  {page.is_published ? "Published" : "Draft"}
                </span>

                <Link
                  href={`/admin/content/${page.slug}`}
                  className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl border border-brand-softblack/[0.08] text-brand-softblack/50 hover:text-brand-green hover:bg-brand-champagne/40 hover:border-brand-champagne transition-all"
                >
                  <PencilLine size={12} />
                  Edit
                </Link>
              </div>
            </div>
          ))}

          {pages.length === 0 && (
            <div className="px-6 py-20 text-center">
              <FileText size={32} className="mx-auto mb-3 text-brand-softblack/15" />
              <p className="text-sm font-light text-brand-softblack/40">Belum ada halaman CMS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
