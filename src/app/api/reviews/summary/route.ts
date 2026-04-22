import { getApprovedReviewsSummary } from "@/lib/review-service";
import { NextResponse } from "next/server";
import { API_ERROR_MESSAGES, REVIEWS_ERROR_MESSAGES } from "@/constants/api-messages";

/**
 * GET /api/reviews/summary
 * Retorna agregado (rating médio e quantidade) por produto, apenas reviews aprovadas.
 * Usado nos cards da home.
 */
export async function GET() {
  try {
    const summary = await getApprovedReviewsSummary();
    if (summary === null) {
      return NextResponse.json(
        { error: REVIEWS_ERROR_MESSAGES.FETCH_SUMMARY_FAILED },
        { status: 500 }
      );
    }

    return NextResponse.json(summary);
  } catch (e) {
    console.error("[REVIEWS SUMMARY] Error:", e);
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}

