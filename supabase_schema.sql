-- ==========================================
-- COMPREHENSIVE SQL SCHEMA FOR BENANG BAJU
-- ==========================================
-- 1. Profiles & Loyalty
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  email TEXT,
  username TEXT UNIQUE,
  website TEXT,
  address_street TEXT,
  address_city TEXT,
  address_postcode TEXT,
  address_country TEXT DEFAULT 'Indonesia',
  -- Loyalty System
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Silver' CHECK (loyalty_tier IN ('Silver', 'Gold', 'Platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.loyalty_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  -- e.g., 'Purchase #ORD-123', 'Referral Bonus'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Categories & Collections (Normalized)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  -- e.g., 'tops', 'bottoms'
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  -- e.g., 'summer-2025'
  name TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  short_description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  old_price DECIMAL(12, 2),
  category_id TEXT REFERENCES public.categories(id),
  collection_id TEXT REFERENCES public.collections(id),
  image_url TEXT,
  badge TEXT CHECK (badge IN ('bestseller', 'novo', 'vegano')),
  anvisa_record TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  -- Dynamic Data
  color_variants JSONB DEFAULT '[]',
  -- Array of { color: string, hex: string, image: string }
  additional_images JSONB DEFAULT '[]',
  -- Array of strings
  accordion_items JSONB DEFAULT '[]',
  -- Array of { title: string, content: string }
  key_highlights JSONB DEFAULT '[]',
  -- Array of strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4. Kits (Product Bundles)
CREATE TABLE IF NOT EXISTS public.kits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  old_price DECIMAL(12, 2),
  image_url TEXT,
  badge TEXT DEFAULT 'kit' CHECK (badge IN ('kit', 'protocol')),
  content JSONB DEFAULT '{}',
  -- Large JSON for complex page content (hero, about, benefits, usage, faq)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.kit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kit_id TEXT REFERENCES public.kits(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 5. Inventory Management
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  reorder_point INTEGER DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (
    movement_type IN (
      'sale',
      'restock',
      'adjustment',
      'return',
      'reservation',
      'reservation_release'
    )
  ),
  quantity_change INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reference_id TEXT,
  -- Order ID or reference
  reason TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 6. Promo Codes & Discounts
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id TEXT PRIMARY KEY,
  -- e.g., 'BENANG10'
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12, 2) NOT NULL,
  min_purchase_amount DECIMAL(12, 2) DEFAULT 0,
  max_discount_amount DECIMAL(12, 2),
  expires_at TIMESTAMPTZ,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 7. Orders System
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    status TEXT NOT NULL CHECK (
      status IN (
        'pending',
        'paid',
        'shipped',
        'delivered',
        'cancelled'
      )
    ) DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    promo_code_id TEXT REFERENCES public.promo_codes(id),
    shipping_cost DECIMAL(12, 2) DEFAULT 0,
    payment_method TEXT,
    payment_gateway_id TEXT,
    tracking_code TEXT,
    tracking_url TEXT,
    tracking_carrier TEXT,
    shipped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Address
    shipping_cep TEXT,
    shipping_street TEXT,
    shipping_number TEXT,
    shipping_complement TEXT,
    shipping_neighborhood TEXT,
    shipping_city TEXT,
    shipping_state TEXT
);
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE
  SET NULL,
    kit_id TEXT REFERENCES public.kits(id) ON DELETE
  SET NULL,
    -- Support for purchasing kits
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    product_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 8. Reviews & Moderation
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
  ),
  text TEXT,
  image_url TEXT,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 9. Waitlist
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ
);
-- 10. Site Settings (Singleton Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  store_name TEXT DEFAULT 'benangbaju',
  marquee_text JSONB DEFAULT '[]',
  free_shipping_threshold DECIMAL(12, 2) DEFAULT 500000,
  primary_promo_code TEXT,
  brand_stats JSONB DEFAULT '{}',
  -- { customers, reviews, itemsSold }
  hero_slides JSONB DEFAULT '[]',
  homepage_banners JSONB DEFAULT '[]',
  contact_info JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  product_detail_settings JSONB DEFAULT '{}',
  navigation JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT singleton_check CHECK (id = 'current')
);
-- 11. CMS Pages
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  blocks JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 12. Newsletter & VIP
CREATE TABLE IF NOT EXISTS public.vip_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    source TEXT,
    -- e.g., 'footer', 'popup'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 13. Flash Sales
CREATE TABLE IF NOT EXISTS public.flash_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.flash_sale_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flash_sale_id UUID REFERENCES public.flash_sales(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  sale_price DECIMAL(12, 2),
  -- Optional override for product price
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(flash_sale_id, product_id)
);
-- ==========================================
-- AUTOMATION (TRIGGERS)
-- ==========================================
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_profiles_ts BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_products_ts BEFORE
UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_kits_ts BEFORE
UPDATE ON kits FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_inventory_ts BEFORE
UPDATE ON inventory FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_orders_ts BEFORE
UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_site_settings_ts BEFORE
UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_cms_pages_ts BEFORE
UPDATE ON cms_pages FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_flash_sales_ts BEFORE
UPDATE ON flash_sales FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
-- ==========================================
-- ADVANCED E-COMMERCE TABLES (1-to-Many & Integrations)
-- ==========================================
-- 14. Midtrans Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  midtrans_transaction_id TEXT,
  payment_type TEXT,
  gross_amount DECIMAL(12, 2) NOT NULL,
  transaction_status TEXT NOT NULL,
  fraud_status TEXT,
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 15. User Addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  label TEXT,
  -- e.g., 'Rumah', 'Kantor'
  recipient_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 16. Product Images (Gallery)
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 17. Product Variants (SKU, Size, Color)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT,
  color_name TEXT,
  color_hex TEXT,
  price_override DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 18. Generic Indonesian Logistics (Shipments)
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  logistics_provider TEXT,
  -- e.g., 'biteship', 'rajaongkir', 'shipper'
  logistics_order_id TEXT,
  courier_company TEXT NOT NULL,
  -- e.g., 'JNE', 'SiCepat'
  courier_type TEXT NOT NULL,
  -- e.g., 'REG', 'YES'
  tracking_number TEXT,
  status TEXT DEFAULT 'pending',
  shipping_cost DECIMAL(12, 2),
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 19. Inventory Reservations (Pre-checkout Lock)
CREATE TABLE IF NOT EXISTS public.inventory_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  payment_order_id TEXT,
  status TEXT CHECK (
    status IN ('active', 'completed', 'cancelled', 'expired')
  ) DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  customer_email TEXT,
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL
);
-- 20. Inventory Status View
CREATE OR REPLACE VIEW public.inventory_status AS
SELECT p.id AS product_id,
  p.name AS product_name,
  p.price,
  p.is_active,
  i.stock_quantity,
  i.reserved_quantity,
  (i.stock_quantity - i.reserved_quantity) AS available_quantity,
  i.low_stock_threshold,
  i.reorder_point,
  CASE
    WHEN (i.stock_quantity - i.reserved_quantity) <= 0 THEN 'out_of_stock'::text
    WHEN (i.stock_quantity - i.reserved_quantity) <= i.low_stock_threshold THEN 'low_stock'::text
    ELSE 'in_stock'::text
  END AS stock_status,
  i.updated_at AS inventory_updated_at
FROM public.products p
  JOIN public.inventory i ON p.id = i.product_id;
-- Triggers for new tables
CREATE TRIGGER update_payment_transactions_ts BEFORE
UPDATE ON payment_transactions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_user_addresses_ts BEFORE
UPDATE ON user_addresses FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_shipments_ts BEFORE
UPDATE ON shipments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
-- 21. Post-Purchase Email Sequences (Cron)
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  sequence_type TEXT NOT NULL CHECK (sequence_type IN ('d3_check_in', 'd7_reorder')),
  product_names JSONB DEFAULT '[]',
  product_ids JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  send_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 22. Abandoned Checkouts (Cron)
CREATE TABLE IF NOT EXISTS public.checkout_abandons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  cart_items JSONB,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'converted', 'sent', 'failed')
  ),
  error_message TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  send_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_email_sequences_ts BEFORE
UPDATE ON email_sequences FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_checkout_abandons_ts BEFORE
UPDATE ON checkout_abandons FOR EACH ROW EXECUTE PROCEDURE update_timestamp();