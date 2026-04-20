# Rekomendasi Schema Supabase — benangbaju
> Analisis berdasarkan pembacaan **seluruh pages, components, API routes, dan `supabase_schema.sql` existing**
> Dibuat: April 2026

---

## Gap Analysis: Schema Existing vs Kebutuhan Frontend

### ❌ Tabel yang MISSING (wajib ditambah)

| Tabel | Dibutuhkan oleh |
|-------|----------------|
| `cms_page_versions` | `CMSPageEditor.tsx` — fitur Restore Versi |
| `loyalty_points` | `admin/loyalty/page.tsx` — tier & points per user |
| `wishlists` | `profile/page.tsx` — tab Favorit |

### ⚠️ Kolom yang MISSING (perlu ALTER TABLE)

| Tabel | Kolom yang perlu ditambah | Dipakai oleh |
|-------|--------------------------|-------------|
| `products` | `size_guide TEXT` | `ProductPageContent.tsx` accordion |
| `products` | `care_instructions TEXT` | `ProductPageContent.tsx` accordion |
| `products` | badge perlu tambah value `'kit'`, `'new'` | `ProductCard`, `ProductForm` |
| `orders` | `customer_nik TEXT` | `CheckoutFormData.nik` — wajib di Indonesia |
| `orders` | `coupon_code TEXT` | Checkout page kupon input |
| `orders` | `shipping_service_name TEXT` | `ShippingQuoteSelector` |
| `order_items` | `selected_color TEXT` | `ProductPageContent` variant warna |
| `loyalty_history` | `reference_id TEXT` | link ke order_id |
| `waitlist` | `user_id UUID REFERENCES auth.users` | `WaitlistModal` mengirim `user_id` |
| `cms_pages` | `updated_by UUID REFERENCES auth.users` | `CMSPageEditor` tracking editor |
| `inventory` | `created_at TIMESTAMPTZ` | konsistensi audit |
| `profiles` | `loyalty_tier` harus include `'Bronze'` | tier awal user baru |

### 🗑️ Tabel yang TIDAK PERLU (bisa dihapus / tidak perlu dibuat)

| Tabel | Alasan |
|-------|--------|
| `categories` (normalized) | Frontend pakai `site_settings.categories` JSONB — tidak ada query ke tabel ini |
| `collections` (normalized) | Sama, dipakai dari `site_settings.collections` |
| `product_images` (tabel) | Frontend pakai `products.additional_images` JSONB array langsung |
| `product_variants` (tabel) | Frontend pakai `products.color_variants` JSONB — ProductForm edit inline |
| `kits` / `kit_items` | Tidak ada halaman admin kit — bisa skip |

---

## Schema Lengkap (Final SQL)

```sql
-- ==========================================
-- BENANG BAJU — FINAL SUPABASE SCHEMA v2.0
-- April 2026
-- ==========================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────
-- 1. PROFILES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name        TEXT,
  phone            TEXT,
  avatar_url       TEXT,
  email            TEXT,
  username         TEXT UNIQUE,
  website          TEXT,
  address_street   TEXT,
  address_city     TEXT,
  address_postcode TEXT,
  address_country  TEXT DEFAULT 'Indonesia',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_profiles_ts
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ─────────────────────────────────────────
-- 2. PRODUCTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  tagline           TEXT,
  description       TEXT,
  short_description TEXT,
  price             DECIMAL(12,2) NOT NULL,
  old_price         DECIMAL(12,2),
  category          TEXT,
  collection        TEXT,
  image_url         TEXT,
  badge             TEXT CHECK (badge IN ('bestseller','novo','vegano','kit','new')),
  color_variants    JSONB DEFAULT '[]',
  additional_images JSONB DEFAULT '[]',
  key_highlights    JSONB DEFAULT '[]',
  size_guide        TEXT,
  care_instructions TEXT,
  rating            DECIMAL(3,2) DEFAULT 0,
  reviews_count     INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_products_ts
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ─────────────────────────────────────────
-- 3. INVENTORY
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventory (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id          TEXT REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  stock_quantity      INTEGER NOT NULL DEFAULT 0,
  reserved_quantity   INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  reorder_point       INTEGER DEFAULT 5,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_inventory_ts
  BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id      TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type   TEXT NOT NULL CHECK (movement_type IN (
                    'sale','restock','adjustment','return','reservation','reservation_release')),
  quantity_change INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after  INTEGER NOT NULL,
  reference_id    TEXT,
  reason          TEXT,
  created_by      UUID REFERENCES auth.users,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventory_reservations (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id       TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  quantity         INTEGER NOT NULL,
  payment_order_id TEXT,
  status           TEXT CHECK (status IN ('active','completed','cancelled','expired')) DEFAULT 'active',
  expires_at       TIMESTAMPTZ NOT NULL,
  customer_email   TEXT,
  user_id          UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

-- View: dipakai /api/inventory/status
CREATE OR REPLACE VIEW public.inventory_status AS
SELECT
  p.id AS product_id, p.name AS product_name, p.price, p.is_active,
  i.stock_quantity, i.reserved_quantity,
  (i.stock_quantity - i.reserved_quantity) AS available_quantity,
  i.low_stock_threshold, i.reorder_point,
  CASE
    WHEN (i.stock_quantity - i.reserved_quantity) <= 0 THEN 'out_of_stock'
    WHEN (i.stock_quantity - i.reserved_quantity) <= i.low_stock_threshold THEN 'low_stock'
    ELSE 'in_stock'
  END AS stock_status,
  i.updated_at AS inventory_updated_at
FROM public.products p
JOIN public.inventory i ON p.id = i.product_id;

-- ─────────────────────────────────────────
-- 4. ORDERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                    TEXT PRIMARY KEY,
  user_id               UUID REFERENCES auth.users ON DELETE SET NULL,
  customer_email        TEXT NOT NULL,
  customer_name         TEXT,
  customer_phone        TEXT,
  customer_nik          TEXT,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total_amount          DECIMAL(12,2) NOT NULL,
  shipping_amount       DECIMAL(12,2) DEFAULT 0,
  discount_amount       DECIMAL(12,2) DEFAULT 0,
  coupon_code           TEXT,
  payment_method        TEXT,
  payment_gateway_id    TEXT,
  shipping_service_id   TEXT,
  shipping_service_name TEXT,
  tracking_code         TEXT,
  tracking_url          TEXT,
  tracking_carrier      TEXT,
  shipped_at            TIMESTAMPTZ,
  shipping_zip          TEXT,
  shipping_street       TEXT,
  shipping_number       TEXT,
  shipping_complement   TEXT,
  shipping_neighborhood TEXT,
  shipping_city         TEXT,
  shipping_state        TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_orders_ts
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TABLE IF NOT EXISTS public.order_items (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id       TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id     TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name   TEXT NOT NULL,
  product_image  TEXT,
  quantity       INTEGER NOT NULL,
  price          DECIMAL(12,2) NOT NULL,
  selected_color TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 5. PAYMENT TRANSACTIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id                TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  midtrans_transaction_id TEXT,
  payment_type            TEXT,
  gross_amount            DECIMAL(12,2) NOT NULL,
  transaction_status      TEXT NOT NULL,
  fraud_status            TEXT,
  raw_webhook_payload     JSONB,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_payment_transactions_ts
  BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ─────────────────────────────────────────
-- 6. SHIPMENTS (Biteship / Logistics)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipments (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id            TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  logistics_provider  TEXT DEFAULT 'biteship',
  logistics_order_id  TEXT,
  courier_company     TEXT NOT NULL,
  courier_type        TEXT NOT NULL,
  tracking_number     TEXT,
  status              TEXT DEFAULT 'pending',
  shipping_cost       DECIMAL(12,2),
  raw_webhook_payload JSONB,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_shipments_ts
  BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ─────────────────────────────────────────
-- 7. REVIEWS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id   TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users ON DELETE SET NULL,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text         TEXT,
  image_url    TEXT,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 8. WAITLIST
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.waitlist (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users ON DELETE SET NULL,
  email       TEXT NOT NULL,
  notified_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, email)
);

-- ─────────────────────────────────────────
-- 9. CMS PAGES + VERSIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  seo_title       TEXT,
  seo_description TEXT,
  blocks          JSONB DEFAULT '[]',
  is_published    BOOLEAN DEFAULT FALSE,
  updated_by      UUID REFERENCES auth.users,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_cms_pages_ts
  BEFORE UPDATE ON cms_pages FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TABLE IF NOT EXISTS public.cms_page_versions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id         UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  title           TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  blocks          JSONB DEFAULT '[]',
  is_published    BOOLEAN,
  edited_by       UUID REFERENCES auth.users,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 10. LOYALTY SYSTEM
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  points     INTEGER NOT NULL DEFAULT 0,
  tier       TEXT DEFAULT 'Bronze'
               CHECK (tier IN ('Bronze','Silver','Gold','Platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_loyalty_points_ts
  BEFORE UPDATE ON loyalty_points FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TABLE IF NOT EXISTS public.loyalty_history (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  reason        TEXT NOT NULL,
  reference_id  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 11. USER ADDRESSES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES auth.users ON DELETE CASCADE,
  label          TEXT,
  recipient_name TEXT NOT NULL,
  phone_number   TEXT NOT NULL,
  street         TEXT NOT NULL,
  number         TEXT,
  complement     TEXT,
  neighborhood   TEXT,
  city           TEXT NOT NULL,
  province       TEXT NOT NULL,
  zip_code       TEXT NOT NULL,
  is_default     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_user_addresses_ts
  BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ─────────────────────────────────────────
-- 12. WISHLISTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlists (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ─────────────────────────────────────────
-- 13. SITE SETTINGS (Singleton)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                      TEXT PRIMARY KEY DEFAULT 'current',
  store_name              TEXT DEFAULT 'benangbaju',
  marquee_text            JSONB DEFAULT '[]',
  free_shipping_threshold DECIMAL(12,2) DEFAULT 200000,
  primary_promo_code      TEXT DEFAULT 'BENANGBAJU',
  categories              JSONB DEFAULT '["Atasan","Bawahan","Dress","Outer","Aksesoris"]',
  collections             JSONB DEFAULT '[]',
  brand_stats             JSONB DEFAULT '{"customers":"1K+","reviews":"500+","itemsSold":"5K+"}',
  contact_info            JSONB DEFAULT '{"whatsapp":"","email":"","address":""}',
  social_links            JSONB DEFAULT '{"instagram":"","tiktok":"","facebook":""}',
  hero_slides             JSONB DEFAULT '[]',
  homepage_banners        JSONB DEFAULT '[]',
  product_detail_settings JSONB DEFAULT '{
    "shippingPolicy":"",
    "returnPolicy":"",
    "defaultCareInstructions":"",
    "sizeGuideUrl":""
  }',
  navigation              JSONB DEFAULT '{}',
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT singleton_check CHECK (id = 'current')
);

CREATE TRIGGER update_site_settings_ts
  BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

INSERT INTO public.site_settings (id) VALUES ('current') ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────
-- 14. PROMO CODES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id                  TEXT PRIMARY KEY,
  description         TEXT,
  discount_type       TEXT CHECK (discount_type IN ('percentage','fixed')),
  discount_value      DECIMAL(12,2) NOT NULL,
  min_purchase_amount DECIMAL(12,2) DEFAULT 0,
  max_discount_amount DECIMAL(12,2),
  expires_at          TIMESTAMPTZ,
  usage_limit         INTEGER,
  usage_count         INTEGER DEFAULT 0,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 15. FLASH SALES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flash_sales (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_flash_sales_ts
  BEFORE UPDATE ON flash_sales FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TABLE IF NOT EXISTS public.flash_sale_products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flash_sale_id UUID REFERENCES public.flash_sales(id) ON DELETE CASCADE,
  product_id    TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  sale_price    DECIMAL(12,2),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(flash_sale_id, product_id)
);

-- ─────────────────────────────────────────
-- 16. VIP LIST / NEWSLETTER
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vip_list (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users ON DELETE SET NULL,
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT,
  phone      TEXT,
  source     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 17. EMAIL AUTOMATION (Cron)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id       TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name  TEXT,
  sequence_type  TEXT NOT NULL CHECK (sequence_type IN ('d3_check_in','d7_reorder')),
  product_names  JSONB DEFAULT '[]',
  product_ids    JSONB DEFAULT '[]',
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  error_message  TEXT,
  send_at        TIMESTAMPTZ NOT NULL,
  sent_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_email_sequences_ts
  BEFORE UPDATE ON email_sequences FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TABLE IF NOT EXISTS public.checkout_abandons (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL,
  phone         TEXT,
  cart_items    JSONB,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','converted','sent','failed')),
  error_message TEXT,
  captured_at   TIMESTAMPTZ DEFAULT NOW(),
  send_at       TIMESTAMPTZ NOT NULL,
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_checkout_abandons_ts
  BEFORE UPDATE ON checkout_abandons FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ==========================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-create loyalty_points saat user baru register
CREATE OR REPLACE FUNCTION handle_new_user_loyalty()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.loyalty_points (user_id, points, tier)
  VALUES (NEW.id, 0, 'Bronze')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_loyalty
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user_loyalty();

-- Auto-update tier berdasarkan total poin
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tier = CASE
    WHEN NEW.points >= 10000 THEN 'Platinum'
    WHEN NEW.points >= 5000  THEN 'Gold'
    WHEN NEW.points >= 1000  THEN 'Silver'
    ELSE 'Bronze'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_loyalty_tier
  BEFORE UPDATE OF points ON loyalty_points
  FOR EACH ROW EXECUTE PROCEDURE update_loyalty_tier();

-- Auto-update reviews_count & rating di products
CREATE OR REPLACE FUNCTION update_product_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products SET
    reviews_count = (
      SELECT COUNT(*) FROM reviews
      WHERE product_id = NEW.product_id AND status = 'approved'
    ),
    rating = (
      SELECT COALESCE(AVG(rating::NUMERIC), 0)
      FROM reviews
      WHERE product_id = NEW.product_id AND status = 'approved'
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_stats
  AFTER INSERT OR UPDATE OF status ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_product_review_stats();

-- Auto-save CMS version saat halaman di-update
CREATE OR REPLACE FUNCTION save_cms_page_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.cms_page_versions
    (page_id, title, seo_title, seo_description, blocks, is_published, edited_by)
  VALUES
    (OLD.id, OLD.title, OLD.seo_title, OLD.seo_description, OLD.blocks, OLD.is_published, OLD.updated_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_version_cms_pages
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW
  WHEN (OLD.blocks IS DISTINCT FROM NEW.blocks OR OLD.title IS DISTINCT FROM NEW.title)
  EXECUTE PROCEDURE save_cms_page_version();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points        ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists             ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: user lihat pesanan sendiri
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR customer_email = auth.email());

-- Order items: ikut order
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Addresses: milik sendiri
CREATE POLICY "Users manage own addresses"
  ON user_addresses FOR ALL USING (auth.uid() = user_id);

-- Wishlists: milik sendiri
CREATE POLICY "Users manage own wishlist"
  ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Loyalty: read-only untuk user
CREATE POLICY "Users can view own loyalty"
  ON loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own loyalty history"
  ON loyalty_history FOR SELECT USING (auth.uid() = user_id);

-- Reviews: public read approved, authenticated submit
CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Authenticated can insert reviews"
  ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## ERD Ringkas

```
auth.users
├── profiles (1:1)
├── loyalty_points (1:1)
├── loyalty_history (1:N)
├── orders (1:N) ──── order_items (1:N)
│                └─── payment_transactions (1:N)
│                └─── shipments (1:N)
│                └─── email_sequences (1:N)
├── reviews (1:N)
├── waitlist (1:N)
├── user_addresses (1:N)
└── wishlists (1:N)

products
├── inventory (1:1)
├── inventory_reservations (1:N)
├── inventory_movements (1:N)
├── order_items (1:N)
├── reviews (1:N)
├── wishlists (1:N)
├── waitlist (1:N)
└── flash_sale_products (1:N)

cms_pages
└── cms_page_versions (1:N)

site_settings (single-row)
flash_sales ──── flash_sale_products
promo_codes
vip_list
checkout_abandons
```

---

## Checklist Migrasi dari Schema Lama

- [ ] Hapus tabel `categories`, `collections` (tidak dipakai frontend)
- [ ] Hapus tabel `product_images`, `product_variants` (frontend pakai JSONB)
- [ ] Hapus kolom `loyalty_points`, `loyalty_tier` dari `profiles` → pindah ke `loyalty_points`
- [ ] ALTER TABLE `products` ADD COLUMN `size_guide TEXT`, `care_instructions TEXT`
- [ ] ALTER TABLE `products` ALTER COLUMN `badge` CHECK tambah `'kit'`, `'new'`
- [ ] ALTER TABLE `orders` ADD COLUMN `customer_nik TEXT`, `coupon_code TEXT`, `shipping_service_name TEXT`
- [ ] ALTER TABLE `order_items` ADD COLUMN `selected_color TEXT`
- [ ] ALTER TABLE `waitlist` ADD COLUMN `user_id UUID REFERENCES auth.users ON DELETE SET NULL`
- [ ] ALTER TABLE `loyalty_history` ADD COLUMN `reference_id TEXT`
- [ ] ALTER TABLE `cms_pages` ADD COLUMN `updated_by UUID REFERENCES auth.users`
- [ ] ALTER TABLE `inventory` ADD COLUMN `created_at TIMESTAMPTZ DEFAULT NOW()`
- [ ] CREATE TABLE `cms_page_versions` (baru)
- [ ] CREATE TABLE `loyalty_points` (baru)
- [ ] CREATE TABLE `wishlists` (baru)
- [ ] Buat 4 database functions & triggers baru
- [ ] Aktifkan RLS + buat policies
- [ ] Seed `site_settings` default row
