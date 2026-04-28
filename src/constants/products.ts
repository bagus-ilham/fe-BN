export interface ColorVariant {
  color: string; // hex code
  name?: string; // e.g., "Sage Green"
  price?: number; // override price for this color
  oldPrice?: number; // override old price
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  base_price: number;
  price: number; // Keep for legacy
  image_url: string;
  image: string; // Keep for legacy
  additional_images?: string[];
  additionalImages?: string[]; // Keep for legacy
  description: string;
  short_description?: string;
  category_id: string;
  badge?: 'bestseller' | 'new' | 'kit' | 'sale';
  oldPrice?: number;
  rating?: number;
  reviews_count?: number;
  is_active: boolean;
  units_sold?: number;
  color_variants?: ColorVariant[];
  colorVariants?: ColorVariant[]; // Keep for legacy
  size_guide?: string;
  care_instructions?: string;
  key_highlights?: Array<{ name: string; detail: string }>;
  category?: string; // For legacy mock mapping
  collection?: string; // For legacy mock support
  ctaPrimary?: string; // For legacy mock support
}

/**
 * LEGACY MOCK PRODUCTS REMOVED.
 * All products should now be fetched from Supabase.
 * If you need specific product IDs for tests, use the ones from your database.
 */
export const PRODUCTS: Product[] = [];
