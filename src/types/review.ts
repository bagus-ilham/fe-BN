import { Review } from "./database";

/** Extended review data from database including optional image */
export interface DbReview extends Omit<Review, "author_email" | "status" | "user_id"> {
  image_url: string | null;
}

/** Normalized review data for display in components */
export interface ReviewDisplay {
  id: string;
  text: string;
  author: string;
  rating: number;
  imageUrl: string | null;
}

/** Summary of reviews for a product (average rating and total count) */
export interface ReviewSummary {
  product_id: string;
  rating: number;
  reviews: number;
}
