import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getCMSPageBySlugForAdmin,
  listCMSPageVersionsForAdmin,
} from "@/lib/cms-service";
import CMSPageEditor from "@/components/admin/CMSPageEditor";

interface AdminContentEditorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminContentEditorPage({
  params,
}: AdminContentEditorPageProps) {
  const { slug } = await params;
  const page = await getCMSPageBySlugForAdmin(slug);
  const versions = await listCMSPageVersionsForAdmin(slug);

  if (!page) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-brand-softblack/70">
          Halaman CMS dengan slug <strong>{slug}</strong> tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-softblack/50 hover:text-brand-green transition-colors"
      >
        <ArrowLeft size={14} />
        Kembali ke Daftar Konten
      </Link>

      <div>
        <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
          Edit Konten: {page.title}
        </h2>
        <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
          slug: {page.slug}
        </p>
      </div>

      <CMSPageEditor page={page} initialVersions={versions} />
    </div>
  );
}
