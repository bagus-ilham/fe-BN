# Rekomendasi Schema Supabase — benangbaju (v3.0 Final)
> Berdasarkan audit mendalam terhadap **Typescript types, API routes, constants, dan admin flow**.
> Fokus: Migrasi penuh ke pasar **Indonesia**, dukungan **Social Proof**, dan **Kits Management**.

---

## Gap Analysis: Update v3.0

| Status | Komponen | Perubahan / Rekomendasi |
|--------|----------|-------------------------|
| 🔴 **MISSING** | `products.units_sold` | Harus ada untuk *social proof* di `ProductCard` & `ProductPageContent`. |
| 🔴 **MISSING** | `kits` & `kit_items` | Wajib ada di DB agar Admin bisa manage paket bundling (bukan hardcode di constants). |
| 🔴 **MISSING** | `order_items.selected_color` | Dibutuhkan untuk mencatat varian warna yang dipilih user saat checkout. |
| 🔴 **MISSING** | `wishlists` | Untuk tab "Favorit" di halaman profil user. |
| 🔴 **MISSING** | `cms_page_versions` | Dibutuhkan oleh `CMSPageEditor` untuk fitur *restore history*. |
| ⚠️ **KONSISTENSI** | Naming (IDN Market) | `customer_cpf` ➔ `customer_nik`, `shipping_cep` ➔ `shipping_zip`. |
| 🗑️ **CLEANUP** | Fields Brazil | Hapus `anvisa_record`, `accordion_items` (deprecated), dan ERP Brazil refs. |

---

## Schema Final (SQL)

```sql
-- ==========================================
-- BENANG BAJU — FINAL PRODUCTION SCHEMA
-- ==========================================

-- 1. PROFILES & LOYALTY
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name        TEXT,
  phone            TEXT,
  avatar_url       TEXT,
  email            TEXT,
  username         TEXT UNIQUE,
  address_street   TEXT,
  address_city     TEXT,
  address_postcode TEXT,
  address_country  TEXT DEFAULT 'Indonesia',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  points     INTEGER NOT NULL DEFAULT 0,
  tier       TEXT DEFAULT 'Bronze' CHECK (tier IN ('Bronze','Silver','Gold','Platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS & KITS
CREATE TABLE IF NOT EXISTS public.products (
  id                TEXT PRIMARY KEY, -- Slug-based ID
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
  units_sold        INTEGER DEFAULT 0, -- Social proof field
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

CREATE TABLE IF NOT EXISTS public.kits (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  description       TEXT,
  price             DECIMAL(12,2) NOT NULL,
  old_price         DECIMAL(12,2),
  image_url         TEXT,
  badge             TEXT DEFAULT 'kit',
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kit_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kit_id     TEXT REFERENCES public.kits(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  quantity   INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS & CHECKOUT
CREATE TABLE IF NOT EXISTS public.orders (
  id                    TEXT PRIMARY KEY,
  user_id               UUID REFERENCES auth.users ON DELETE SET NULL,
  customer_email        TEXT NOT NULL,
  customer_name         TEXT,
  customer_phone        TEXT,
  customer_nik          TEXT, -- NIK Indonesia
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total_amount          DECIMAL(12,2) NOT NULL,
  shipping_amount       DECIMAL(12,2) DEFAULT 0,
  discount_amount       DECIMAL(12,2) DEFAULT 0,
  coupon_code           TEXT,
  payment_method        TEXT,
  payment_gateway_id    TEXT, -- Midtrans Token/Order ID
  shipping_zip          TEXT, -- Kode Pos
  shipping_street       TEXT,
  shipping_number       TEXT,
  shipping_complement   TEXT,
  shipping_neighborhood TEXT,
  shipping_city         TEXT,
  shipping_state        TEXT,
  tracking_code         TEXT,
  tracking_carrier      TEXT,
  shipped_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id       TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id     TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  kit_id         TEXT REFERENCES public.kits(id) ON DELETE SET NULL,
  product_name   TEXT NOT NULL,
  quantity       INTEGER NOT NULL,
  price          DECIMAL(12,2) NOT NULL,
  product_image  TEXT,
  selected_color TEXT, -- Varian warna yang dipilih
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTERACTION (REVIEWS, WAITLIST, WISHLIST)
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id   TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users ON DELETE SET NULL,
  author_name  TEXT NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text         TEXT,
  image_url    TEXT,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.waitlist (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users ON DELETE SET NULL,
  email       TEXT NOT NULL,
  notified_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, email)
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. CMS & CONFIG
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                      TEXT PRIMARY KEY DEFAULT 'current' CHECK (id = 'current'),
  store_name              TEXT DEFAULT 'benangbaju',
  categories              JSONB DEFAULT '[]',
  collections             JSONB DEFAULT '[]',
  hero_slides             JSONB DEFAULT '[]',
  homepage_banners        JSONB DEFAULT '[]',
  contact_info            JSONB DEFAULT '{}',
  social_links            JSONB DEFAULT '{}',
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cms_pages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  blocks          JSONB DEFAULT '[]',
  is_published    BOOLEAN DEFAULT FALSE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cms_page_versions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id    UUID REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  title      TEXT,
  blocks     JSONB DEFAULT '[]',
  edited_by  UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Migrasi Terakhir (Checklist v3.0)

- [ ] **Rename & Align**: `customer_cpf` ➔ `customer_nik`, `shipping_cep` ➔ `shipping_zip`.
- [ ] **Add Business Logic**: Tambah kolom `units_sold` di `products` (Social Proof).
- [ ] **Persistence for Kits**: Migrasi kit dari constants ke tabel `kits` & `kit_items`.
- [ ] **Fix Waitlist**: Tambah `user_id` di tabel `waitlist`.
- [ ] **Selected Color**: Tambah `selected_color` di `order_items` untuk tracking varian.
- [ ] **Cleanup**: Hapus field `anvisa_record` dan `accordion_items` dari schema & types.

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
