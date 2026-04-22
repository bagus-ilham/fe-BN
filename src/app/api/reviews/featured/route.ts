import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/utils/rate-limit";
import { getFeaturedReviews } from "@/lib/review-service";
import { API_ERROR_MESSAGES } from "@/constants/api-messages";

/**
 * GET /api/reviews/featured
 * Retorna as últimas reviews aprovadas de todos os produtos (para seção "Veja o que estão falando")
 */
export async function GET(req: NextRequest) {
  const rl = rateLimit(getClientIp(req), { limit: 30, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.TOO_MANY_REQUESTS },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  try {
    const data = await getFeaturedReviews(6);
    return NextResponse.json(data ?? []);
  } catch (e) {
    console.error("[REVIEWS FEATURED] Error:", e);
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
