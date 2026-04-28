import { 
  Star, 
  MessageSquare,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import ReviewTableActions from "../../../components/admin/ReviewTableActions";
import { Review } from "@/types/database";
import { listAllReviewsForAdmin } from "@/lib/review-service";

type ReviewRow = Review & {
  products?: { name?: string | null } | null;
  image_url?: string | null;
};

const reviewStatusConfig: Record<string, { classes: string; dot: string; label: string }> = {
  approved: { classes: "bg-emerald-50 text-emerald-600 border-emerald-200/80", dot: "bg-emerald-400", label: "Disetujui" },
  rejected: { classes: "bg-red-50 text-red-500 border-red-200/80", dot: "bg-red-400", label: "Ditolak" },
  pending:  { classes: "bg-amber-50 text-amber-600 border-amber-200/80", dot: "bg-amber-400", label: "Menunggu" },
};

export default async function AdminReviewsPage() {
  const reviews = await listAllReviewsForAdmin() as ReviewRow[];
  const pendingCount = reviews?.filter((r) => r.status === "pending").length || 0;
  const approvedCount = reviews?.filter((r) => r.status === "approved").length || 0;
  const rejectedCount = reviews?.filter((r) => r.status === "rejected").length || 0;
  const avgRating = reviews?.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6">
        <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30 mb-1">Review Moderation</p>
        <h2 className="text-xl font-light text-brand-softblack tracking-tight">Moderasi Ulasan</h2>
        <p className="text-[11px] text-brand-softblack/40 mt-1">Kelola testimoni pembeli benangbaju</p>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Menunggu Review", value: pendingCount, iconEl: <MessageSquare size={17} strokeWidth={1.5} />, iconClass: "bg-amber-50 text-amber-500", urgent: pendingCount > 0 },
          { label: "Disetujui", value: approvedCount, iconEl: <CheckCircle2 size={17} strokeWidth={1.5} />, iconClass: "bg-emerald-50 text-emerald-500" },
          { label: "Ditolak", value: rejectedCount, iconEl: <XCircle size={17} strokeWidth={1.5} />, iconClass: "bg-red-50 text-red-400" },
          { label: "Rating Rata-rata", value: avgRating, iconEl: <Star size={17} strokeWidth={1.5} />, iconClass: "bg-brand-champagne/60 text-brand-green" },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white rounded-2xl border p-5 flex items-center gap-3 ${stat.urgent ? "border-amber-200/60" : "border-brand-softblack/[0.06]"}`}>
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconClass}`}>{stat.iconEl}</div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1">{stat.label}</div>
              <div className="text-xl font-light text-brand-softblack">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F2EF] border-b border-brand-softblack/[0.06]">
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Produk & Penulis</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Rating & Ulasan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Media</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-softblack/[0.04] text-sm">
              {reviews?.map((review) => {
                const cfg = reviewStatusConfig[review.status] || reviewStatusConfig.pending;
                return (
                  <tr key={review.id} className="hover:bg-brand-offwhite/50 transition-colors group">
                    <td className="px-6 py-5 max-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Package size={11} className="text-brand-softblack/30 flex-shrink-0" />
                          <span className="text-[9px] uppercase tracking-wider text-brand-softblack/40 truncate">{review.products?.name}</span>
                        </div>
                        <span className="font-medium text-brand-softblack text-[12px]">{review.author_name}</span>
                        <span className="text-[9px] text-brand-softblack/30 truncate">{review.author_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-[280px]">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-brand-softblack/10 fill-brand-softblack/5"} />
                          ))}
                          <span className="ml-1 text-[9px] text-brand-softblack/40 uppercase tracking-wider">{review.rating}/5</span>
                        </div>
                        <p className="text-brand-softblack/60 font-light leading-relaxed line-clamp-2 text-[11px] italic">
                          &ldquo;{review.text}&rdquo;
                        </p>
                        <span className="text-[9px] uppercase tracking-wider text-brand-softblack/25">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString("id-ID") : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {review.image_url ? (
                        <div className="relative w-12 h-12 bg-[#F4F2EF] rounded-xl overflow-hidden shadow-sm">
                          <Image src={review.image_url} alt="Review" fill className="object-cover" />
                        </div>
                      ) : (
                        <span className="text-[9px] uppercase tracking-wider text-brand-softblack/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${cfg.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <ReviewTableActions reviewId={review.id} currentStatus={review.status as any} />
                    </td>
                  </tr>
                );
              })}

              {(!reviews || reviews.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <MessageSquare size={32} className="mx-auto mb-3 text-brand-softblack/15" />
                    <p className="text-sm font-light text-brand-softblack/40">Belum ada ulasan masuk.</p>
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
