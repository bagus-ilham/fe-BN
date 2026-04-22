export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          email: string | null
          username: string | null
          address_street: string | null
          address_city: string | null
          address_postcode: string | null
          address_country: string
          created_at: string
          updated_at: string
        }
      }
      loyalty_points: {
        Row: {
          id: string
          user_id: string
          points: number
          tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
          created_at: string
          updated_at: string
        }
      }
      loyalty_history: {
        Row: {
          id: string
          user_id: string
          points_change: number
          reason: 'order_paid' | 'order_cancelled' | 'admin_adjustment' | 'auto_change'
          reference_id: string | null
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          tagline: string | null
          description: string | null
          short_description: string | null
          base_price: number
          category_id: string | null
          collection_id: string | null
          image_url: string | null
          badge: 'bestseller' | 'novo' | 'vegano' | 'kit' | 'new' | null
          units_sold: number
          rating: number
          reviews_count: number
          is_active: boolean
          deleted_at: string | null
          key_highlights: Json
          size_guide: string | null
          care_instructions: string | null
          created_at: string
          updated_at: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          color_name: string | null
          color_hex: string | null
          size: string | null
          price: number
          old_price: number | null
          sku: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      inventory: {
        Row: {
          id: string
          variant_id: string
          stock_quantity: number
          reserved_quantity: number
          low_stock_threshold: number
          reorder_point: number
          updated_at: string
        }
      }
      inventory_movements: {
        Row: {
          id: string
          variant_id: string
          movement_type: 'sale' | 'restock' | 'adjustment' | 'return' | 'reservation' | 'reservation_release'
          quantity_change: number
          quantity_before: number
          quantity_after: number
          reference_id: string | null
          reason: string | null
          created_by: string | null
          created_at: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          expires_at: string
          created_at: string
          updated_at: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          variant_id: string
          quantity: number
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          customer_nik: string | null
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_amount: number
          discount_amount: number
          coupon_code: string | null
          payment_order_id: string | null
          shipping_zip: string | null
          shipping_street: string | null
          shipping_city: string | null
          shipping_state: string | null
          tracking_code: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
      }
      order_returns: {
        Row: {
          id: string
          order_id: string
          reason: string
          status: 'requested' | 'approved' | 'rejected' | 'completed'
          refund_amount: number | null
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          kit_id: string | null
          product_name: string
          variant_name: string | null
          quantity: number
          price: number
          product_image: string | null
          created_at: string
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          target_table: string | null
          target_id: string | null
          payload: Json
          created_at: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          author_name: string
          author_email: string | null
          rating: number
          text: string
          image_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          banner_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          sort_order: number
          created_at: string
        }
      }
      kits: {
        Row: {
          id: string
          name: string
          description: string | null
          long_description: string | null
          price: number
          old_price: number | null
          image_url: string | null
          badge: 'kit' | 'protocol'
          content: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      kit_items: {
        Row: {
          id: string
          kit_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
        }
      }
      inventory_reservations: {
        Row: {
          id: string
          variant_id: string
          quantity: number
          payment_order_id: string | null
          status: 'active' | 'completed' | 'cancelled' | 'expired'
          expires_at: string
          customer_email: string | null
          user_id: string | null
          created_at: string
          completed_at: string | null
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          old_status: string | null
          new_status: string
          changed_by: string | null
          notes: string | null
          created_at: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          order_id: string
          midtrans_transaction_id: string | null
          payment_type: string | null
          gross_amount: number
          transaction_status: string
          raw_webhook_payload: Json
          created_at: string
          updated_at: string
        }
      }
      shipments: {
        Row: {
          id: string
          order_id: string
          courier_company: string
          tracking_number: string | null
          status: string
          shipping_cost: number | null
          created_at: string
          updated_at: string
        }
      }
      waitlist: {
        Row: {
          id: string
          product_id: string
          email: string
          notified_at: string | null
          created_at: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          recipient_name: string
          phone_number: string
          street: string
          city: string
          province: string
          zip_code: string
          is_default: boolean
          created_at: string
        }
      }
      flash_sales: {
        Row: {
          id: string
          name: string
          start_at: string
          end_at: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      flash_sale_items: {
        Row: {
          id: string
          flash_sale_id: string
          product_id: string
          variant_id: string
          sale_price: number
          limit_qty: number
          sold_qty: number
          created_at: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_purchase_amount: number
          max_discount_amount: number | null
          expires_at: string | null
          usage_limit: number | null
          usage_count: number
          is_active: boolean
          created_at: string
        }
      }
      vip_list: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
        }
      }
      email_sequences: {
        Row: {
          id: string
          order_id: string
          customer_email: string
          sequence_type: 'd3_check_in' | 'd7_reorder'
          status: 'pending' | 'sent' | 'failed'
          send_at: string
          created_at: string
        }
      }
      checkout_abandons: {
        Row: {
          id: string
          email: string
          phone: string | null
          cart_items: Json
          status: 'pending' | 'converted' | 'sent' | 'failed'
          captured_at: string
          send_at: string
          created_at: string
        }
      }
      cms_pages: {
        Row: {
          id: string
          slug: string
          title: string
          blocks: Json
          is_published: boolean
          updated_by: string | null
          updated_at: string
        }
      }
      cms_page_versions: {
        Row: {
          id: string
          page_id: string
          blocks: Json
          edited_by: string | null
          created_at: string
        }
      }
      site_settings: {
        Row: {
          id: string
          store_name: string
          free_shipping_threshold: number
          primary_promo_code: string | null
          marquee_text: Json
          hero_slides: Json
          homepage_banners: Json
          contact_info: Json
          social_links: Json
          navigation: Json
          updated_at: string
        }
      }
    }
    Views: {
      active_flash_sales: {
        Row: {
          session_id: string
          name: string
          variant_id: string
          sale_price: number
          limit_qty: number
          sold_qty: number
          is_available: boolean
          start_at: string
          end_at: string
        }
      }
    }
  }
}

export interface CmsBlock {
  id: string
  type: 'hero' | 'rich_text' | 'feature_list' | 'faq' | 'cta' | 'gallery'
  data: any
}

// Helper types for easier consumption
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProductRow = Database['public']['Tables']['products']['Row']
export type Inventory = Database['public']['Tables']['inventory']['Row']
export type Cart = Database['public']['Tables']['carts']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Collection = Database['public']['Tables']['collections']['Row']
export type KitRow = Database['public']['Tables']['kits']['Row']
export type KitItem = Database['public']['Tables']['kit_items']['Row']
export type Wishlist = Database['public']['Tables']['wishlists']['Row']
export type PromoCode = Database['public']['Tables']['promo_codes']['Row']
export type CmsPage = Database['public']['Tables']['cms_pages']['Row']
export type CmsPageVersion = Database['public']['Tables']['cms_page_versions']['Row']
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row']
export type FlashSale = Database['public']['Views']['active_flash_sales']['Row']

export interface ProductWithExtras extends ProductRow {
  color_variants?: Array<{
    color: string
    name?: string
    price?: number
    old_price?: number
  }>
  additional_images?: string[]
  available_quantity?: number
  oldPrice?: number // For backward compatibility with constants/products
}

export interface OrderWithItems extends Order {
  order_items?: OrderItem[];
  tracking_carrier?: string | null;
  tracking_url?: string | null;
}
