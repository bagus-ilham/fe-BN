/**
 * Tipos do Banco de Dados - VIOS LABS
 *
 * Este arquivo documenta as interfaces TypeScript para as tabelas do Supabase.
 * ATUALIZADO:
 * - Suporte para Guest Checkout (user_id opcional em orders)
 * - Sistema de Gestão de Estoque (Inventory Management)
 */

export interface Order {
  id: string;
  user_id: string | null;
  customer_email: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_nik?: string | null; // NIK Indonesia
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_amount: number;
  discount_amount: number;
  coupon_code?: string | null;
  payment_method?: string | null;
  payment_gateway_id?: string | null; // Midtrans Order ID
  shipping_zip?: string | null; // Kode Pos
  shipping_street?: string | null;
  shipping_number?: string | null;
  shipping_complement?: string | null;
  shipping_neighborhood?: string | null;
  shipping_city?: string | null;
  shipping_state?: string | null;
  tracking_code?: string | null;
  tracking_url?: string | null;
  tracking_carrier?: string | null;
  shipped_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  kit_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string | null;
  selected_color?: string | null; // Varian warna yang dipilih
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  email?: string;
  username?: string;
  address_street?: string;
  address_city?: string;
  address_postcode?: string;
  address_country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoyaltyPoints {
  id: string;
  user_id: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  created_at: string;
  updated_at: string;
}

export interface LoyaltyHistory {
  id: string;
  user_id: string;
  points_change: number;
  reason: string;
  reference_id?: string | null;
  created_at: string;
}

/**
 * Produto no Banco de Dados
 */
export interface ProductDB {
  id: string;
  name: string;
  tagline?: string | null;
  description: string | null;
  short_description?: string | null;
  price: number;
  old_price: number | null;
  category: string;
  collection: string | null;
  image_url: string | null;
  badge: "bestseller" | "novo" | "vegano" | "kit" | "new" | null;
  units_sold: number; // Social proof
  rating: number | null;
  reviews_count: number;
  is_active: boolean;
  color_variants: any[] | null;
  additional_images: string[] | null;
  key_highlights: any[] | null;
  size_guide?: string | null;
  care_instructions?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Kit {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  badge: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KitItem {
  id: string;
  kit_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface ProductWithInventory extends ProductDB {
  inventory?: Inventory[];
}

export interface Inventory {
  id: string;
  product_id: string;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  reorder_point: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryReservation {
  id: string;
  product_id: string;
  quantity: number;
  payment_order_id: string | null;
  status: "active" | "completed" | "cancelled" | "expired";
  expires_at: string;
  created_at: string;
  completed_at: string | null;
  customer_email: string | null;
  user_id: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  text: string;
  author_name: string;
  status: "pending" | "approved" | "rejected";
  image_url?: string | null;
  user_id: string | null;
  created_at: string;
}

export interface Waitlist {
  id: string;
  product_id: string;
  user_id: string | null;
  email: string;
  notified_at: string | null;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface CMSBlock {
  id: string;
  type: "hero" | "rich_text" | "feature_list" | "faq" | "cta" | "gallery";
  data: Record<string, any>;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  blocks: CMSBlock[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CMSPageVersion {
  id: string;
  page_id: string;
  title: string;
  blocks: CMSBlock[];
  edited_by: string | null;
  created_at: string;
}
