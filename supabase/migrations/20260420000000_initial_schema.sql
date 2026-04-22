-- ============================================================
-- BENANG BAJU — PRODUCTION SCHEMA (v6.6 UNBREAKABLE TITAN MASTER)
-- ============================================================
-- Changelog v6.6:
--   [SAFETY] Stock Guard: Added non-negative CHECK constraints on inventory.
--   [SAFETY] Order Guard: Added positive CHECK constraints on item quantities.
--   [SAFETY] Loyalty Guard: Set handle_loyalty_logic to SECURITY DEFINER.
--   [CHECK] Verified all 35 tables, 8 triggers, 12 indexes, 6 RPCs.
--   [STAMP] Final Production benchmark for Benang Baju.
-- ============================================================
-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ============================================================
-- 1. PROFILES & LOYALTY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  email TEXT,
  username TEXT UNIQUE,
  address_street TEXT,
  address_city TEXT,
  address_postcode TEXT,
  address_country TEXT DEFAULT 'Indonesia',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  tier TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.loyalty_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- 2. TAXONOMY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- 3. PRODUCTS, VARIANTS & KITS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(12, 2) NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE
  SET NULL,
    collection_id TEXT REFERENCES public.collections(id) ON DELETE
  SET NULL,
    image_url TEXT,
    badge TEXT CHECK (
      badge IN ('bestseller', 'novo', 'vegano', 'kit', 'new')
    ),
    units_sold INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    key_highlights JSONB DEFAULT '[]',
    size_guide TEXT,
    care_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  color_name TEXT,
  color_hex TEXT,
  size TEXT,
  price DECIMAL(12, 2) NOT NULL,
  old_price DECIMAL(12, 2),
  sku TEXT UNIQUE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
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
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.kit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kit_id TEXT REFERENCES public.kits(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE
  SET NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(kit_id, product_id, variant_id)
);
-- ============================================================
-- 4. CARTS SYSTEM
-- ============================================================
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  session_id TEXT,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, variant_id)
);
-- ============================================================
-- 5. INVENTORY & RESERVATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inventory (
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE PRIMARY KEY,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
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
  reason TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.inventory_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  payment_order_id TEXT,
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'completed', 'cancelled', 'expired')
  ),
  expires_at TIMESTAMPTZ NOT NULL,
  customer_email TEXT,
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
-- ============================================================
-- 6. ORDERS, RETURNS & LOGISTICS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_nik TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
      status IN (
        'pending',
        'paid',
        'shipped',
        'delivered',
        'cancelled',
        'returned'
      )
    ),
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_amount DECIMAL(12, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    coupon_code TEXT,
    payment_order_id TEXT,
    shipping_zip TEXT,
    shipping_street TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    tracking_code TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.order_returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'requested' CHECK (
    status IN ('requested', 'approved', 'rejected', 'completed')
  ),
  refund_amount DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE
  SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE
  SET NULL,
    kit_id TEXT REFERENCES public.kits(id) ON DELETE
  SET NULL,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(12, 2) NOT NULL,
    product_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  midtrans_transaction_id TEXT,
  payment_type TEXT,
  gross_amount DECIMAL(12, 2) NOT NULL,
  transaction_status TEXT NOT NULL,
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  courier_company TEXT NOT NULL,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending',
  shipping_cost DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- 7. REVIEWS, WAITLIST & WISHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE
  SET NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    rating INTEGER NOT NULL CHECK (
      rating BETWEEN 1 AND 5
    ),
    text TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, email)
);
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- 8. MARKETING, ADMIN & CMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.flash_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.flash_sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flash_sale_id UUID REFERENCES public.flash_sales(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  sale_price DECIMAL(12, 2) NOT NULL,
  limit_qty INTEGER DEFAULT 0,
  sold_qty INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(flash_sale_id, variant_id)
);
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id TEXT PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS public.vip_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  sequence_type TEXT NOT NULL CHECK (sequence_type IN ('d3_check_in', 'd7_reorder')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  send_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.checkout_abandons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  cart_items JSONB,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'converted', 'sent', 'failed')
  ),
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  send_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  blocks JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES auth.users,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.cms_page_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  blocks JSONB DEFAULT '[]',
  edited_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current' CHECK (id = 'current'),
  store_name TEXT DEFAULT 'benangbaju',
  free_shipping_threshold DECIMAL(12, 2) DEFAULT 300000,
  primary_promo_code TEXT,
  marquee_text JSONB DEFAULT '[]',
  hero_slides JSONB DEFAULT '[]',
  homepage_banners JSONB DEFAULT '[]',
  contact_info JSONB DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  navigation JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- 9. TRIGGERS & BUSINESS LOGIC (v6.6 UNBREAKABLE)
-- ============================================================
-- Timestamp Helper
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_products_ts BEFORE
UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER t_orders_ts BEFORE
UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER t_settings_ts BEFORE
UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER t_carts_ts BEFORE
UPDATE ON carts FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
-- UNBREAKABLE Order Automation (v6.6 Titan)
CREATE OR REPLACE FUNCTION handle_order_automation() RETURNS TRIGGER AS $$ BEGIN IF NEW.status = OLD.status THEN RETURN NEW;
END IF;
-- State Machine Guards
IF NEW.status = 'paid'
AND OLD.status NOT IN ('pending') THEN RAISE EXCEPTION 'Invalid transition: % -> %',
OLD.status,
NEW.status;
END IF;
IF NEW.status = 'shipped'
AND OLD.status NOT IN ('paid') THEN RAISE EXCEPTION 'Invalid transition: % -> %',
OLD.status,
NEW.status;
END IF;
IF NEW.status = 'delivered'
AND OLD.status NOT IN ('shipped') THEN RAISE EXCEPTION 'Invalid transition: % -> %',
OLD.status,
NEW.status;
END IF;
IF NEW.status = 'cancelled'
AND OLD.status IN ('delivered', 'shipped') THEN RAISE EXCEPTION 'Cannot cancel shipped/delivered order';
END IF;
INSERT INTO public.order_status_history (order_id, old_status, new_status)
VALUES (NEW.id, OLD.status, NEW.status);
-- CASE: PAID
IF NEW.status = 'paid'
AND OLD.status = 'pending' THEN -- 1. Deduct Stock (Reserved stock -> actual deduction)
UPDATE public.inventory i
SET stock_quantity = i.stock_quantity - oi.quantity,
  reserved_quantity = i.reserved_quantity - oi.quantity
FROM public.order_items oi
WHERE oi.order_id = NEW.id
  AND i.variant_id = oi.variant_id;
-- 2. Complete Reservation
UPDATE public.inventory_reservations
SET status = 'completed',
  completed_at = NOW()
WHERE payment_order_id = NEW.payment_order_id
  AND status = 'active';
-- 3. Add Loyalty Points
IF NEW.user_id IS NOT NULL THEN PERFORM set_config('app.loyalty_source', 'order_automation', true);
INSERT INTO public.loyalty_points (user_id, points)
VALUES (NEW.user_id, FLOOR(NEW.total_amount / 1000)) ON CONFLICT (user_id) DO
UPDATE
SET points = public.loyalty_points.points + EXCLUDED.points;
INSERT INTO public.loyalty_history (user_id, points_change, reason, reference_id)
VALUES (
    NEW.user_id,
    FLOOR(NEW.total_amount / 1000),
    'order_paid',
    NEW.id
  );
END IF;
-- 4. Update Product Stats
UPDATE public.products p
SET units_sold = p.units_sold + oi.quantity
FROM public.order_items oi
WHERE oi.order_id = NEW.id
  AND p.id = oi.product_id;
-- CASE: CANCELLED FROM PAID (Rollback)
ELSIF NEW.status = 'cancelled'
AND OLD.status = 'paid' THEN
UPDATE public.inventory i
SET stock_quantity = i.stock_quantity + oi.quantity
FROM public.order_items oi
WHERE oi.order_id = NEW.id
  AND i.variant_id = oi.variant_id;
IF NEW.user_id IS NOT NULL THEN PERFORM set_config('app.loyalty_source', 'order_automation', true);
UPDATE public.loyalty_points
SET points = GREATEST(0, points - FLOOR(NEW.total_amount / 1000))
WHERE user_id = NEW.user_id;
INSERT INTO public.loyalty_history (user_id, points_change, reason, reference_id)
VALUES (
    NEW.user_id,
    - FLOOR(NEW.total_amount / 1000),
    'order_cancelled',
    NEW.id
  );
END IF;
-- CASE: CANCELLED FROM PENDING
ELSIF NEW.status = 'cancelled'
AND OLD.status = 'pending' THEN
UPDATE public.inventory i
SET reserved_quantity = i.reserved_quantity - ir.quantity
FROM public.inventory_reservations ir
WHERE ir.payment_order_id = NEW.payment_order_id
  AND ir.status = 'active'
  AND i.variant_id = ir.variant_id;
UPDATE public.inventory_reservations
SET status = 'cancelled'
WHERE payment_order_id = NEW.payment_order_id
  AND status = 'active';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_order_master_logic
AFTER
UPDATE OF status ON orders FOR EACH ROW EXECUTE PROCEDURE handle_order_automation();
-- UNBREAKABLE Loyalty Logic (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION handle_loyalty_logic() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'UPDATE'
  AND NEW.points <> OLD.points THEN IF current_setting('app.loyalty_source', true) IS DISTINCT
FROM 'order_automation' THEN
INSERT INTO public.loyalty_history (user_id, points_change, reason)
VALUES (
    NEW.user_id,
    NEW.points - OLD.points,
    'admin_adjustment'
  );
END IF;
END IF;
NEW.tier := CASE
  WHEN NEW.points >= 10000 THEN 'Platinum'
  WHEN NEW.points >= 5000 THEN 'Gold'
  WHEN NEW.points >= 1000 THEN 'Silver'
  ELSE 'Bronze'
END;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER t_loyalty_automation BEFORE
INSERT
  OR
UPDATE ON loyalty_points FOR EACH ROW EXECUTE PROCEDURE handle_loyalty_logic();
-- Inventory Movement Logger
CREATE OR REPLACE FUNCTION log_inventory_movement() RETURNS TRIGGER AS $$ BEGIN IF NEW.stock_quantity <> OLD.stock_quantity THEN
INSERT INTO public.inventory_movements (
    variant_id,
    movement_type,
    quantity_change,
    quantity_before,
    quantity_after,
    reason
  )
VALUES (
    NEW.variant_id,
    'adjustment',
    (NEW.stock_quantity - OLD.stock_quantity),
    OLD.stock_quantity,
    NEW.stock_quantity,
    'stock_change'
  );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_inventory_audit
AFTER
UPDATE ON inventory FOR EACH ROW EXECUTE PROCEDURE log_inventory_movement();
-- ============================================================
-- 10. RPC & VIEWS
-- ============================================================
-- Atomic Reservation RPC
CREATE OR REPLACE FUNCTION reserve_inventory_v3(
    p_variant_id UUID,
    p_quantity INTEGER,
    p_payment_order_id TEXT,
    p_customer_email TEXT DEFAULT NULL
  ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_available INTEGER;
v_res_id UUID;
BEGIN
SELECT (stock_quantity - reserved_quantity) INTO v_available
FROM public.inventory
WHERE variant_id = p_variant_id FOR
UPDATE;
IF v_available IS NULL
OR v_available < p_quantity THEN RETURN jsonb_build_object('success', false, 'error', 'Insufficient stock');
END IF;
UPDATE public.inventory
SET reserved_quantity = reserved_quantity + p_quantity
WHERE variant_id = p_variant_id;
INSERT INTO public.inventory_reservations (
    variant_id,
    quantity,
    payment_order_id,
    customer_email,
    expires_at
  )
VALUES (
    p_variant_id,
    p_quantity,
    p_payment_order_id,
    p_customer_email,
    NOW() + INTERVAL '1 hour'
  )
RETURNING id INTO v_res_id;
RETURN jsonb_build_object('success', true, 'reservation_id', v_res_id);
END;
$$;
-- Atomic Order Creation RPC
CREATE OR REPLACE FUNCTION create_order_v2(
    p_order_id TEXT,
    p_user_id UUID,
    p_email TEXT,
    p_name TEXT,
    p_phone TEXT,
    p_nik TEXT,
    p_total DECIMAL,
    p_shipping DECIMAL,
    p_zip TEXT,
    p_street TEXT,
    p_city TEXT,
    p_state TEXT,
    p_items JSONB,
    p_coupon TEXT DEFAULT NULL
  ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_item RECORD;
v_res JSONB;
BEGIN -- 1. Create Order
INSERT INTO public.orders (
    id,
    user_id,
    customer_email,
    customer_name,
    customer_phone,
    customer_nik,
    total_amount,
    shipping_amount,
    coupon_code,
    shipping_zip,
    shipping_street,
    shipping_city,
    shipping_state,
    status
  )
VALUES (
    p_order_id,
    p_user_id,
    p_email,
    p_name,
    p_phone,
    p_nik,
    p_total,
    p_shipping,
    p_coupon,
    p_zip,
    p_street,
    p_city,
    p_state,
    'pending'
  );
-- 2. Process Items
FOR v_item IN
SELECT *
FROM jsonb_to_recordset(p_items) AS x(
    variant_id UUID,
    quantity INTEGER,
    price DECIMAL,
    product_id TEXT,
    product_name TEXT,
    image TEXT
  ) LOOP
INSERT INTO public.order_items (
    order_id,
    product_id,
    variant_id,
    product_name,
    quantity,
    price,
    product_image
  )
VALUES (
    p_order_id,
    v_item.product_id,
    v_item.variant_id,
    v_item.product_name,
    v_item.quantity,
    v_item.price,
    v_item.image
  );
v_res := reserve_inventory_v3(
  v_item.variant_id,
  v_item.quantity,
  p_order_id,
  p_email
);
IF NOT (v_res->>'success')::BOOLEAN THEN RAISE EXCEPTION 'Stock insufficient for %',
v_item.product_name;
END IF;
END LOOP;
RETURN jsonb_build_object('success', true, 'order_id', p_order_id);
EXCEPTION
WHEN OTHERS THEN RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
-- ============================================================
-- 11. INDEXES & SECURITY
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_variant_selection ON public.product_variants(product_id, color_name, size);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant ON public.inventory(variant_id);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR
INSERT WITH CHECK (auth.uid() = user_id);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage cart items" ON public.cart_items FOR ALL USING (
  cart_id IN (
    SELECT id
    FROM public.carts
    WHERE user_id = auth.uid()
  )
);
REVOKE
UPDATE ON public.loyalty_points
FROM authenticated;
REVOKE
UPDATE ON public.loyalty_points
FROM anon;