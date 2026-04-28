import { getSupabaseAdmin } from "@/utils/supabase";

/**
 * Review Service
 */

interface SubmitReviewParams {
  product_id: string;
  rating: number;
  text: string;
  author_name: string;
  author_email: string;
  image_url?: string | null;
}

export async function submitReview(params: SubmitReviewParams): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Gagal mengirim ulasan' };
    }

    return { success: true, message: data.message || 'Ulasan berhasil dikirim!' };
  } catch (err) {
    console.error('[REVIEW SERVICE] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Kesalahan internal' };
  }
}

export async function listAllReviewsForAdmin() {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select(`
      *,
      products (name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin reviews:", error);
    return [];
  }

  return data || [];
}

export async function updateReviewStatus(reviewId: string, status: 'approved' | 'rejected' | 'pending') {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .update({ status })
    .eq("id", reviewId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating review ${reviewId}:`, error);
    throw error;
  }

  return data;
}

export async function getFeaturedReviews(limit = 6) {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select("id, product_id, rating, text, author_name, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }

  return data || [];
}

export async function listApprovedReviewsByProduct(productId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select("id, product_id, rating, text, author_name, image_url, created_at")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[REVIEW SERVICE] listApprovedReviewsByProduct Error:", error);
    return null;
  }

  return data || [];
}

export async function getApprovedReviewsSummary() {
  const { data, error } = await getSupabaseAdmin()
    .from("reviews")
    .select("product_id, rating")
    .eq("status", "approved");

  if (error) {
    console.error("[REVIEW SERVICE] getApprovedReviewsSummary Error:", error);
    return null;
  }

  const byProduct = new Map<string, { sum: number; count: number }>();
  for (const row of data ?? []) {
    const existing = byProduct.get(row.product_id);
    if (existing) {
      existing.sum += row.rating;
      existing.count += 1;
    } else {
      byProduct.set(row.product_id, { sum: row.rating, count: 1 });
    }
  }

  return Array.from(byProduct.entries()).map(([product_id, { sum, count }]) => ({
    product_id,
    rating: Math.round((sum / count) * 10) / 10,
    reviews: count,
  }));
}
