-- ============================================================
-- BENANG BAJU — SEED DATA (v1.0)
-- Data awal: categories, collections, products, variants,
--            inventory, promo_codes, site_settings
-- ============================================================
-- CATATAN: Jalankan file ini di Supabase SQL Editor
-- SETELAH menjalankan initial_schema.sql
-- User admin (benangbaju) harus dibuat manual via Supabase Auth UI
-- atau via script di bawah (Section 8)
-- ============================================================

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
INSERT INTO public.categories (id, name, description, is_active) VALUES
  ('atasan',    'Atasan',    'Blouse, kemeja, dan kaos berbahan premium',   TRUE),
  ('bawahan',   'Bawahan',   'Celana, rok, dan kulot berkualitas',          TRUE),
  ('dress',     'Dress',     'Dress kasual hingga semi formal',             TRUE),
  ('outerwear', 'Outerwear', 'Outer, jaket, dan blazer stylish',           TRUE),
  ('aksesoris', 'Aksesoris', 'Tas, sabuk, dan pelengkap busana',           TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. COLLECTIONS
-- ============================================================
INSERT INTO public.collections (id, name, description, image_url, banner_url, is_active) VALUES
  (
    'essentials',
    'Anytime Essentials',
    'Koleksi wardrobe staples yang bisa dipakai kapan saja dan di mana saja. Dibuat dari bahan yang nyaman, tahan lama, dan tetap stylish.',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg',
    TRUE
  ),
  (
    'new-in',
    'New In',
    'Koleksi terbaru benangbaju. Desain segar yang mengikuti tren mode masa kini dengan sentuhan lokal yang khas.',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg',
    TRUE
  ),
  (
    'best-seller',
    'Best Seller',
    'Produk-produk terlaris pilihan pelanggan setia benangbaju. Sudah terbukti kualitas dan kenyamanannya.',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-2.jpg',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-2.jpg',
    TRUE
  ),
  (
    'raya-edition',
    'Raya Edition',
    'Koleksi spesial Hari Raya dengan nuansa elegan dan modern. Cocok untuk perayaan keluarga maupun pesta.',
    NULL,
    NULL,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. PRODUCTS (2 produk utama)
-- ============================================================
INSERT INTO public.products (
  id, name, tagline, description, short_description,
  base_price, category_id, collection_id,
  image_url, badge, units_sold, rating, reviews_count,
  is_active, material, key_highlights, size_guide, care_instructions
) VALUES
  (
    'overlock-top-v1',
    'Overlock Top Classic',
    'Atasan kasual premium dengan detail jahitan overlock',
    'Overlock Top Classic adalah pilihan sempurna untuk tampilan kasual sehari-hari. Dibuat dari bahan katun premium yang lembut di kulit dan tidak menerawang. Detail jahitan overlock yang rapi memberikan kesan bersih dan modern. Tersedia dalam berbagai pilihan warna netral yang mudah dipadukan.',
    'Atasan kasual premium dengan jahitan overlock yang rapi.',
    189000,
    'atasan',
    'new-in',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg',
    'new',
    0,
    0.0,
    0,
    TRUE,
    'Katun Premium 100% (220 GSM)',
    '[
      {"name": "Eco-Friendly", "detail": "Menggunakan pewarna alami yang aman bagi lingkungan"},
      {"name": "Premium Cotton", "detail": "Bahan katun 220 GSM yang lembut, adem, dan tidak menerawang"},
      {"name": "Jahitan Overlock", "detail": "Detail jahitan overlock yang rapi dan tahan lama"},
      {"name": "Unisex Cut", "detail": "Potongan yang cocok untuk berbagai bentuk tubuh"}
    ]'::jsonb,
    'S: Dada 88cm, Panjang 62cm
M: Dada 92cm, Panjang 63cm
L: Dada 96cm, Panjang 64cm
XL: Dada 100cm, Panjang 65cm
*Toleransi 1-2cm',
    'Cuci dengan air dingin (maks 30°C). Jangan gunakan pemutih. Setrika dengan suhu rendah. Jangan diperas berlebihan. Keringkan di tempat teduh.'
  ),
  (
    'linen-wide-pants',
    'Linen Wide Pants',
    'Celana kulot linen yang airy dan elegan',
    'Linen Wide Pants hadir dengan siluet wide leg yang modern dan flowy. Dibuat dari bahan linen berkualitas tinggi yang ringan dan breathable, cocok untuk iklim tropis Indonesia. Potongan high-waist yang flattering dan tali pinggang adjustable untuk kenyamanan maksimal. Cocok untuk gaya kasual maupun semi-formal.',
    'Celana kulot linen dengan siluet wide leg yang modern dan elegan.',
    245000,
    'bawahan',
    'essentials',
    'https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg',
    'bestseller',
    0,
    0.0,
    0,
    TRUE,
    'Linen Premium Mix (55% Linen, 45% Rayon)',
    '[
      {"name": "Breathable Linen", "detail": "Bahan linen yang ringan dan sejuk untuk cuaca tropis"},
      {"name": "High Waist", "detail": "Potongan high-waist yang elegan dan meninggikan kesan proporsi"},
      {"name": "Adjustable Waist", "detail": "Tali pinggang yang bisa disesuaikan untuk kenyamanan maksimal"},
      {"name": "Wide Leg", "detail": "Siluet wide leg modern yang flowy dan nyaman sepanjang hari"}
    ]'::jsonb,
    'S: Pinggang 62-70cm, Pinggul 88cm, Panjang 95cm
M: Pinggang 66-74cm, Pinggul 92cm, Panjang 96cm
L: Pinggang 70-78cm, Pinggul 96cm, Panjang 97cm
XL: Pinggang 74-82cm, Pinggul 100cm, Panjang 98cm
*Toleransi 1-2cm',
    'Cuci tangan atau mesin dengan program halus. Gunakan deterjen lembut. Jangan diperas berlebihan. Setrika dalam keadaan sedikit lembab dengan suhu sedang. Keringkan di tempat teduh.'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. PRODUCT VARIANTS
-- ============================================================
-- Variants for Overlock Top Classic
INSERT INTO public.product_variants (product_id, color_name, color_hex, size, price, old_price, sku, is_active) VALUES
  ('overlock-top-v1', 'Putih Krem',  '#F5F0E8', 'S',  189000, 229000, 'OT-CRM-S',  TRUE),
  ('overlock-top-v1', 'Putih Krem',  '#F5F0E8', 'M',  189000, 229000, 'OT-CRM-M',  TRUE),
  ('overlock-top-v1', 'Putih Krem',  '#F5F0E8', 'L',  189000, 229000, 'OT-CRM-L',  TRUE),
  ('overlock-top-v1', 'Putih Krem',  '#F5F0E8', 'XL', 189000, 229000, 'OT-CRM-XL', TRUE),
  ('overlock-top-v1', 'Hitam Solid', '#1C1C1C', 'S',  189000, NULL,   'OT-BLK-S',  TRUE),
  ('overlock-top-v1', 'Hitam Solid', '#1C1C1C', 'M',  189000, NULL,   'OT-BLK-M',  TRUE),
  ('overlock-top-v1', 'Hitam Solid', '#1C1C1C', 'L',  189000, NULL,   'OT-BLK-L',  TRUE),
  ('overlock-top-v1', 'Sage Green',  '#8FAF8F', 'S',  199000, NULL,   'OT-SGN-S',  TRUE),
  ('overlock-top-v1', 'Sage Green',  '#8FAF8F', 'M',  199000, NULL,   'OT-SGN-M',  TRUE),
  ('overlock-top-v1', 'Sage Green',  '#8FAF8F', 'L',  199000, NULL,   'OT-SGN-L',  TRUE)
ON CONFLICT (sku) DO NOTHING;

-- Variants for Linen Wide Pants
INSERT INTO public.product_variants (product_id, color_name, color_hex, size, price, old_price, sku, is_active) VALUES
  ('linen-wide-pants', 'Sand Beige',  '#C8B49A', 'S',  245000, 295000, 'LWP-SND-S',  TRUE),
  ('linen-wide-pants', 'Sand Beige',  '#C8B49A', 'M',  245000, 295000, 'LWP-SND-M',  TRUE),
  ('linen-wide-pants', 'Sand Beige',  '#C8B49A', 'L',  245000, 295000, 'LWP-SND-L',  TRUE),
  ('linen-wide-pants', 'Sand Beige',  '#C8B49A', 'XL', 245000, 295000, 'LWP-SND-XL', TRUE),
  ('linen-wide-pants', 'Olive Green', '#6B7D5E', 'S',  245000, NULL,   'LWP-OLV-S',  TRUE),
  ('linen-wide-pants', 'Olive Green', '#6B7D5E', 'M',  245000, NULL,   'LWP-OLV-M',  TRUE),
  ('linen-wide-pants', 'Olive Green', '#6B7D5E', 'L',  245000, NULL,   'LWP-OLV-L',  TRUE),
  ('linen-wide-pants', 'Hitam',       '#1C1C1C', 'S',  255000, NULL,   'LWP-BLK-S',  TRUE),
  ('linen-wide-pants', 'Hitam',       '#1C1C1C', 'M',  255000, NULL,   'LWP-BLK-M',  TRUE),
  ('linen-wide-pants', 'Hitam',       '#1C1C1C', 'L',  255000, NULL,   'LWP-BLK-L',  TRUE)
ON CONFLICT (sku) DO NOTHING;

-- ============================================================
-- 5. INVENTORY (stock awal per variant)
-- ============================================================
INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold, reorder_point)
SELECT id, 25, 0, 5, 10
FROM public.product_variants
WHERE product_id IN ('overlock-top-v1', 'linen-wide-pants')
ON CONFLICT (variant_id) DO NOTHING;

-- ============================================================
-- 6. PROMO CODES
-- ============================================================
INSERT INTO public.promo_codes (id, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, is_active) VALUES
  ('BENANG10',  'Diskon 10% untuk semua produk (maks Rp 50.000)',  'percentage', 10,  150000, 50000,  NULL, TRUE),
  ('BENANG15K', 'Diskon Rp 15.000 untuk pembelian min. Rp 200.000', 'fixed',       15000, 200000, NULL,   NULL, TRUE),
  ('FIRSTBUY',  'Diskon 15% untuk pembelian pertama (maks Rp 75.000)', 'percentage', 15, 100000, 75000, 1,   TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. SITE SETTINGS (initial)
-- ============================================================
INSERT INTO public.site_settings (
  id,
  store_name,
  free_shipping_threshold,
  primary_promo_code,
  marquee_text,
  hero_slides,
  homepage_banners,
  contact_info,
  social_links,
  navigation,
  product_detail_settings,
  brand_stats
) VALUES (
  'current',
  'benangbaju',
  500000,
  'BENANG10',
  '["Dapatkan Diskon 10% untuk Pembelian Pertama — Kupon: FIRSTBUY", "Gratis Ongkir Minimal Belanja Rp 500.000", "Koleksi Terbaru: Overlock Anytime — Cek Sekarang!"]'::jsonb,
  '[
    {"id": 1, "image": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg", "title": "Overlock Anytime", "subtitle": "New Collection 2025", "cta": "Belanja Sekarang", "link": "/collections?collection=new-in"},
    {"id": 2, "image": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-2.jpg", "title": "Anytime Essentials", "subtitle": "Wardrobe Staples", "cta": "Lihat Koleksi", "link": "/collections?collection=essentials"},
    {"id": 3, "image": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg", "title": "Linen Series", "subtitle": "Ringan & Elegan", "cta": "Explore Now", "link": "/collections?collection=essentials"}
  ]'::jsonb,
  '[
    {"id": "new-in", "title": "New In: Overlock Anytime", "subtitle": "Koleksi Terbaru", "image": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-1.jpg", "link": "/collections?collection=new-in", "ctaText": "Belanja Produk Baru", "reverse": false},
    {"id": "essentials", "title": "Anytime Essentials", "subtitle": "Wardrobe Staples", "image": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-3.jpg", "link": "/collections?collection=essentials", "ctaText": "Lihat Semua Produk", "reverse": true},
    {"id": "best-seller", "title": "Best Seller Pilihan", "subtitle": "Terlaris Bulan Ini", "image": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/hero-2.jpg", "link": "/collections?collection=best-seller", "ctaText": "Lihat Best Seller", "reverse": false}
  ]'::jsonb,
  '{"whatsapp": "6285001001234", "email": "halo@benangbaju.com", "address": "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12930", "mapLink": "https://maps.google.com"}'::jsonb,
  '{"instagram": "https://instagram.com/benangbaju", "tiktok": "https://tiktok.com/@benangbaju", "facebook": "https://facebook.com/benangbaju"}'::jsonb,
  '{
    "main": [
      {
        "label": "Kategori",
        "href": "/collections",
        "megaMenu": [
          {
            "title": "Pilih Kategori",
            "items": [
              {"label": "Atasan", "href": "/collections?category=atasan"},
              {"label": "Bawahan", "href": "/collections?category=bawahan"},
              {"label": "Dress", "href": "/collections?category=dress"},
              {"label": "Outerwear", "href": "/collections?category=outerwear"},
              {"label": "Aksesoris", "href": "/collections?category=aksesoris"}
            ]
          }
        ]
      },
      {
        "label": "Koleksi",
        "href": "/collections",
        "megaMenu": [
          {
            "title": "Koleksi Spesial",
            "items": [
              {"label": "New In", "href": "/collections?collection=new-in"},
              {"label": "Anytime Essentials", "href": "/collections?collection=essentials"},
              {"label": "Best Seller", "href": "/collections?collection=best-seller"},
              {"label": "Raya Edition", "href": "/collections?collection=raya-edition"}
            ]
          }
        ]
      },
      {
        "label": "Favorit",
        "href": "/collections",
        "megaMenu": [
          {
            "title": "Eksklusif",
            "items": [
              {"label": "New Arrivals", "href": "/collections?badge=new"},
              {"label": "Best Sellers", "href": "/collections?badge=bestseller"}
            ]
          }
        ]
      },
      {"label": "Tentang Kami", "href": "/about"}
    ],
    "footer": [
      {
        "title": "Menu",
        "links": [
          {"label": "Produk", "href": "/collections"},
          {"label": "Koleksi Baru", "href": "/collections?collection=new-in"},
          {"label": "Tentang Kami", "href": "/about"},
          {"label": "Kontak", "href": "/contact"}
        ]
      },
      {
        "title": "Bantuan",
        "links": [
          {"label": "Panduan Ukuran", "href": "/contact"},
          {"label": "Kebijakan Pengiriman", "href": "/contact"},
          {"label": "Retur & Refund", "href": "/contact"},
          {"label": "Layanan Pelanggan", "href": "/contact"}
        ]
      }
    ]
  }'::jsonb,
  '{
    "shippingPolicy": "Pesanan diproses dalam 1-2 hari kerja. Pengiriman menggunakan JNE/J&T/SiCepat ke seluruh Indonesia. Estimasi tiba 2-5 hari kerja untuk Pulau Jawa.",
    "returnPolicy": "Pengembalian barang berlaku 7 hari setelah barang diterima dengan kondisi barang masih baru, tag lengkap, dan belum dicuci.",
    "sizeGuideUrl": "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/size-guide.jpg",
    "defaultCareInstructions": "Cuci dengan air dingin (maks 30°C). Jangan gunakan pemutih. Setrika dengan suhu rendah. Keringkan di tempat teduh."
  }'::jsonb,
  '{"customers": "500+", "reviews": "200+", "itemsSold": "1k+", "avgRating": "4.9"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  free_shipping_threshold = EXCLUDED.free_shipping_threshold,
  primary_promo_code = EXCLUDED.primary_promo_code,
  marquee_text = EXCLUDED.marquee_text,
  hero_slides = EXCLUDED.hero_slides,
  homepage_banners = EXCLUDED.homepage_banners,
  contact_info = EXCLUDED.contact_info,
  social_links = EXCLUDED.social_links,
  navigation = EXCLUDED.navigation,
  product_detail_settings = EXCLUDED.product_detail_settings,
  brand_stats = EXCLUDED.brand_stats,
  updated_at = NOW();

-- ============================================================
-- 8. ADMIN USER PROFILE
-- ============================================================
-- PENTING: User auth harus dibuat dulu via Supabase Dashboard:
--   Authentication > Users > Add User
--   Email: admin@benangbaju.com
--   Password: [buat password aman]
--   Kemudian jalankan query di bawah ini dengan UUID dari user tersebut:
--
-- GANTI 'YOUR-ADMIN-UUID-HERE' dengan UUID dari user yang dibuat:
--
-- INSERT INTO public.profiles (id, full_name, email, username)
-- VALUES (
--   'YOUR-ADMIN-UUID-HERE',
--   'benangbaju Admin',
--   'admin@benangbaju.com',
--   'benangbaju'
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   full_name = EXCLUDED.full_name,
--   username = EXCLUDED.username;

-- ============================================================
-- VERIFIKASI
-- ============================================================
-- Jalankan untuk cek hasil seed:
-- SELECT 'categories' as tbl, count(*) FROM categories
-- UNION ALL SELECT 'collections', count(*) FROM collections
-- UNION ALL SELECT 'products', count(*) FROM products
-- UNION ALL SELECT 'product_variants', count(*) FROM product_variants
-- UNION ALL SELECT 'inventory', count(*) FROM inventory
-- UNION ALL SELECT 'promo_codes', count(*) FROM promo_codes
-- UNION ALL SELECT 'site_settings', count(*) FROM site_settings;
