import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/utils/rate-limit";
import { listApprovedReviewsByProduct } from "@/lib/review-service";
import { API_ERROR_MESSAGES, REVIEWS_ERROR_MESSAGES } from "@/constants/api-messages";

/**
 * GET /api/reviews?product_id=prod_1
 * Retorna apenas reviews aprovadas, ordenadas por data (mais recentes primeiro)
 */
export async function GET(req: NextRequest) {
  const rl = rateLimit(getClientIp(req), { limit: 60, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.TOO_MANY_REQUESTS },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "60",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json(
        { error: REVIEWS_ERROR_MESSAGES.PRODUCT_ID_REQUIRED },
        { status: 400 }
      );
    }

    const data = await listApprovedReviewsByProduct(productId);
    if (data === null) {
      return NextResponse.json(
        { error: REVIEWS_ERROR_MESSAGES.FETCH_REVIEWS_FAILED },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? [], {
      headers: {
        // Cache de 2 min na CDN; serve dado stale por até 10 min enquanto revalida em background.
        // Reviews mudam apenas quando uma nova avaliação é aprovada manualmente.
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    console.error("[REVIEWS API] Error:", e);
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
