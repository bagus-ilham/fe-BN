-- SEED DATA FOR BENANG BAJU (v6.6)

-- 1. Categories
INSERT INTO public.categories (id, name, description) VALUES
('Atasan', 'Atasan', 'Koleksi atasan premium'),
('Dress', 'Dress', 'Dress anggun dan modern'),
('Bawahan', 'Bawahan', 'Celana dan rok berkualitas'),
('Aksesoris', 'Aksesoris', 'Pelengkap gaya Anda'),
('Paket Koleksi', 'Paket Koleksi', 'Hemat dengan paket pilihan')
ON CONFLICT (id) DO NOTHING;

-- 2. Collections
INSERT INTO public.collections (id, name, description) VALUES
('Essentials', 'Essentials', 'Koleksi dasar wajib punya'),
('Batik Series', 'Batik Series', 'Sentuhan budaya dalam gaya modern'),
('Summer 2024', 'Summer 2024', 'Ringan dan ceria untuk musim panas')
ON CONFLICT (id) DO NOTHING;

-- 3. Products
INSERT INTO public.products (id, name, tagline, description, base_price, category_id, collection_id, image_url, badge, units_sold) VALUES
('prod_2', 'Atasan Linen Elegan', 'Bahan Linen Premium Impor', 'Atasan berbahan linen premium impor yang ringan dan breathable. Dirancang untuk perempuan modern yang menginginkan tampilan elegan namun tetap nyaman sepanjang hari.', 259000, 'Atasan', 'Essentials', '/images/products/linen-atasan.png', 'bestseller', 40),
('prod_1', 'Dress Midi Batik Modern', 'Batik Kontemporer Indonesia', 'Dress midi dengan motif batik kontemporer yang elegan. Dibuat dari bahan katun berkualitas tinggi yang nyaman dipakai sepanjang hari.', 389000, 'Dress', 'Batik Series', '/images/products/batik-dress.png', 'new', 32),
('prod_4', 'Blouse Katun Combed', 'Katun Combed 30s Premium', 'Blouse berbahan katun combed 30s yang lembut di kulit dan mudah dirawat. Desain minimalis dengan detail yang diperhatikan secara cermat.', 199000, 'Atasan', 'Essentials', '/images/products/cotton-blouse.png', 'new', 24),
('prod_3', 'Rok Plisket Midi', 'Plisket Elegan Anti-Kusut', 'Rok plisket midi dengan bahan berkualitas tinggi yang tahan lecek dan mudah dipadukan. Siluet mengalir yang feminin dan flowy.', 219000, 'Bawahan', 'Essentials', '/images/products/pleated-skirt.png', NULL, 28),
('prod_5', 'Celana Kulot Linen', 'Kulot Premium Serba Cocok', 'Celana kulot berbahan linen premium dengan potongan yang longgar namun tetap terstruktur. Nyaman digunakan seharian.', 229000, 'Bawahan', 'Summer 2024', '/images/products/linen-culottes.png', NULL, 20),
('kit_1', 'Paket Lengkap benangbaju', 'Solusi Wardrobe Lengkap (Hemat 20%)', 'Koleksi lengkap seluruh produk fashion kami dalam satu paket hemat. Terdiri dari Atasan Linen, Dress Batik, Rok Plisket, Blouse Katun, dan Kulot Linen.', 1099000, 'Paket Koleksi', NULL, '/images/products/batik-dress.png', 'kit', 10)
ON CONFLICT (id) DO NOTHING;

-- 4. Product Images
INSERT INTO public.product_images (product_id, image_url, sort_order) VALUES
('prod_2', '/images/products/linen-atasan.png', 0),
('prod_2', '/images/products/linen-atasan-detail.png', 1),
('prod_1', '/images/products/batik-dress.png', 0),
('prod_4', '/images/products/cotton-blouse.png', 0),
('prod_3', '/images/products/pleated-skirt.png', 0),
('prod_5', '/images/products/linen-culottes.png', 0)
ON CONFLICT DO NOTHING;

-- 5. Product Variants & Inventory
-- We'll use hardcoded UUIDs for consistency in seed
DO $$
DECLARE
    v_prod2_oatmeal UUID := '88888888-8888-4888-a888-888888888801';
    v_prod2_sage    UUID := '88888888-8888-4888-a888-888888888802';
    v_prod1_forest  UUID := '88888888-8888-4888-a888-888888888803';
BEGIN
    -- Prod 2 Oatmeal
    INSERT INTO public.product_variants (id, product_id, color_name, color_hex, size, price)
    VALUES (v_prod2_oatmeal, 'prod_2', 'Oatmeal', '#D6CFC7', 'M', 259000) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.inventory (variant_id, stock_quantity)
    VALUES (v_prod2_oatmeal, 50) ON CONFLICT (variant_id) DO NOTHING;

    -- Prod 2 Sage
    INSERT INTO public.product_variants (id, product_id, color_name, color_hex, size, price)
    VALUES (v_prod2_sage, 'prod_2', 'Sage Gray', '#8E918F', 'L', 279000) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.inventory (variant_id, stock_quantity)
    VALUES (v_prod2_sage, 30) ON CONFLICT (variant_id) DO NOTHING;

    -- Prod 1 Forest
    INSERT INTO public.product_variants (id, product_id, color_name, color_hex, size, price)
    VALUES (v_prod1_forest, 'prod_1', 'Deep Forest', '#4A5D4E', 'All Size', 389000) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.inventory (variant_id, stock_quantity)
    VALUES (v_prod1_forest, 25) ON CONFLICT (variant_id) DO NOTHING;
END $$;
