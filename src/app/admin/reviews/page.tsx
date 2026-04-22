import { 
  Star, 
  MessageSquare,
  Package
} from "lucide-react";
import Image from "next/image";
import ReviewTableActions from "../../../components/admin/ReviewTableActions";
import { Review } from "@/types/database";
import { listAllReviewsForAdmin } from "@/lib/review-service";

type ReviewRow = Review & {
  products?: { name?: string | null } | null;
  image_url?: string | null;
};

export default async function AdminReviewsPage() {
  const reviews = await listAllReviewsForAdmin() as ReviewRow[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
          Moderasi Ulasan
        </h2>
        <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
          Kelola testimoni pembeli benangbaju
        </p>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card bg-brand-softblack p-8 text-brand-offwhite flex justify-between items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">Tertunda (Pending)</div>
            <div className="text-3xl font-light">{reviews?.filter((r) => r.status === 'pending').length || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
            <MessageSquare size={20} className="opacity-40" />
          </div>
        </div>
        <div className="surface-card p-8 flex justify-between items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brand-softblack/40 mb-2">Ulasan Publik</div>
            <div className="text-3xl font-light text-brand-softblack">{reviews?.filter((r) => r.status === 'approved').length || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-offwhite flex items-center justify-center">
            <Star size={20} className="text-brand-green" />
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-brand-offwhite/30">
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Product & Author</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Rating & Review</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Media</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {reviews?.map((review) => (
                <tr key={review.id} className="hover:bg-brand-offwhite/10 transition-colors group">
                  <td className="px-6 py-5 max-w-[200px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-brand-softblack/40">
                        <Package size={12} />
                        <span className="text-[10px] uppercase tracking-widest truncate">{review.products?.name}</span>
                      </div>
                      <span className="font-medium text-brand-softblack">{review.author_name}</span>
                      <span className="text-[10px] text-brand-softblack/30 truncate">{review.author_email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-[300px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "text-brand-green fill-brand-green" : "text-gray-200 fill-gray-100"} />
                        ))}
                      </div>
                      <p className="text-brand-softblack/70 font-light leading-relaxed line-clamp-2">
                        &quot;{review.text}&quot;
                      </p>
                      <span className="text-[9px] uppercase tracking-widest text-brand-softblack/30">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {review.image_url ? (
                      <div className="relative w-12 h-12 bg-gray-100 rounded-sm overflow-hidden">
                        <Image src={review.image_url} alt="Review" fill className="object-cover" />
                      </div>
                    ) : (
                      <span className="text-[9px] uppercase tracking-widest text-brand-softblack/20 italic">No Media</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-[0.25em] font-bold border rounded-sm ${
                      review.status === 'approved' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 
                      review.status === 'rejected' ? 'bg-red-50 text-red-400 border-red-100' : 
                      'bg-amber-50 text-amber-500 border-amber-100'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ReviewTableActions reviewId={review.id} currentStatus={review.status as any} />
                  </td>
                </tr>
              ))}

              {(!reviews || reviews.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-sm font-light text-brand-softblack/30 italic">
                    Belum ada ulasan masuk.
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


