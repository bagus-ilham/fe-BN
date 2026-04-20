export interface ColorVariant {
  color: string; // hex code
  name?: string; // e.g., "Sage Green"
  price?: number; // override price for this color
  oldPrice?: number; // override old price
}

export interface Product {
  id: string;
  name: string;
  /** Tagline for page title (e.g., "Bahan Linen Premium") */
  tagline?: string;
  price: number;
  image: string;
  /** Additional images for the product page gallery */
  additionalImages?: string[];
  description: string;
  /** Short phrase for the card; e.g., benefit or differentiator */
  shortDescription?: string;
  category: string;
  collection?: string;
  badge?: 'bestseller' | 'new' | 'vegan' | 'kit';
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  /** Stock information (optional, loaded on demand) */
  stockQuantity?: number;
  /** Available quantity (loaded from stock API, for urgency badges) */
  availableQuantity?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  /** Sold out product — disabled button with "Habis Terjual" label */
  soldOut?: boolean;
  /** Units sold — social proof */
  unitsSold?: number;
  /** Primary CTA — replaces "Beli Sekarang" / card button */
  ctaPrimary?: string;
  /** Secondary CTA — optional */
  ctaSecondary?: string;
  /** Available colors for swatches */
  colorVariants?: ColorVariant[];
  /** Advanced CMS Content */
  sizeGuide?: string;
  careInstructions?: string;
  highlights?: Array<{ name: string; detail: string }>;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod_2',
    name: 'Atasan Linen Elegan',
    tagline: 'Bahan Linen Premium Impor',
    price: 259000,
    oldPrice: 329000,
    image: '/images/products/linen-atasan.png',
    additionalImages: [
      '/images/products/linen-atasan.png',
      '/images/products/linen-atasan-detail.png',
      '/images/products/linen-atasan-hanger.png',
      '/images/products/linen-atasan-lifestyle.png',
      '/images/products/linen-atasan-folded.png',
    ],
    description: 'Atasan berbahan linen premium impor yang ringan dan breathable. Dirancang untuk perempuan modern yang menginginkan tampilan elegan namun tetap nyaman sepanjang hari. Tersedia dalam berbagai pilihan warna netral yang mudah dipadukan.',
    shortDescription: 'Linen premium yang ringan, nyaman, dan elegan untuk aktivitas sehari-hari.',
    category: 'Atasan',
    collection: 'Essentials',
    badge: 'bestseller',
    unitsSold: 40,
    ctaPrimary: 'Tambah ke Tas',
    colorVariants: [
      { color: '#D6CFC7', name: 'Oatmeal', price: 259000, oldPrice: 329000 },
      { color: '#8E918F', name: 'Sage Gray', price: 279000, oldPrice: 349000 },
      { color: '#2C2C2C', name: 'Charcoal', price: 259000, oldPrice: 329000 },
    ],
  },
  {
    id: 'prod_1',
    name: 'Dress Midi Batik Modern',
    tagline: 'Batik Kontemporer Indonesia',
    price: 389000,
    oldPrice: 459000,
    image: '/images/products/batik-dress.png',
    additionalImages: [
      '/images/products/batik-dress.png',
      '/images/products/batik-dress-detail.png',
      '/images/products/batik-dress-lifestyle.png',
      '/images/products/batik-dress-back.png',
      '/images/products/batik-dress-folded.png',
    ],
    description: 'Dress midi dengan motif batik kontemporer yang memadukan warisan budaya Indonesia dengan estetika fashion modern. Potongan A-line yang flattering untuk berbagai bentuk tubuh, cocok untuk acara formal maupun semi-formal.',
    shortDescription: 'Batik kontemporer dalam potongan midi yang elegan and modern.',
    category: 'Dress',
    unitsSold: 32,
    ctaPrimary: 'Temukan Ukuranku',
    colorVariants: [
      { color: '#4A5D4E', name: 'Deep Forest', price: 389000, oldPrice: 459000 },
      { color: '#1B1B1B', name: 'Classic Black', price: 399000, oldPrice: 479000 },
    ],
  },
  {
    id: 'prod_4',
    name: 'Blouse Katun Combed',
    tagline: 'Katun Combed 30s Premium',
    price: 199000,
    oldPrice: 249000,
    image: '/images/products/cotton-blouse.png',
    additionalImages: [
      '/images/products/cotton-blouse.png',
      '/images/products/cotton-blouse-detail.png',
      '/images/products/cotton-blouse-lifestyle.png',
      '/images/products/benangbaju-label.png',
      '/images/products/benangbaju-thank-you.png',
    ],
    description: 'Blouse berbahan katun combed 30s yang lembut di kulit dan mudah dirawat. Desain minimalis dengan detail yang diperhatikan secara cermat — pas untuk tampilan kasual maupun profesional.',
    shortDescription: 'Katun combed premium yang lembut, mudah dirawat, dan nyaman sepanjang hari.',
    category: 'Atasan',
    badge: 'new',
    unitsSold: 24,
    ctaPrimary: 'Tambah ke Tas',
    colorVariants: [
      { color: '#FFFFFF', name: 'Cloud White', price: 199000, oldPrice: 249000 },
      { color: '#F5F5F5', name: 'Off White', price: 199000, oldPrice: 249000 },
      { color: '#E5E5E5', name: 'Soft Gray', price: 209000, oldPrice: 259000 },
    ],
  },
  {
    id: 'prod_3',
    name: 'Rok Plisket Midi',
    tagline: 'Plisket Elegan Anti-Kusut',
    price: 219000,
    oldPrice: 279000,
    image: '/images/products/pleated-skirt.png',
    additionalImages: [
      '/images/products/pleated-skirt.png',
      '/images/products/pleated-skirt-detail.png',
      '/images/products/pleated-skirt-lifestyle.png',
      '/images/products/pleated-skirt-waistband.png',
      '/images/products/benangbaju-thank-you.png',
    ],
    description: 'Rok plisket midi dengan bahan berkualitas tinggi yang tahan lecek dan mudah dipadukan. Siluet mengalir yang feminin dan flowy memberikan kesan anggun di setiap langkah. Cocok untuk berbagai kesempatan dari pagi hingga malam.',
    shortDescription: 'Plisket premium anti-kusut yang feminin dan mudah dipadukan kapan saja.',
    category: 'Bawahan',
    unitsSold: 28,
    ctaPrimary: 'Tambah ke Tas',
    colorVariants: [
      { color: '#2C2C2C', name: 'Midnight', price: 219000, oldPrice: 279000 },
      { color: '#556B2F', name: 'Olive', price: 229000, oldPrice: 289000 },
      { color: '#8B4513', name: 'Terracotta', price: 219000, oldPrice: 279000 },
    ],
  },
  {
    id: 'prod_5',
    name: 'Celana Kulot Linen',
    tagline: 'Kulot Premium Serba Cocok',
    price: 229000,
    oldPrice: 289000,
    image: '/images/products/linen-culottes.png',
    additionalImages: [
      '/images/products/linen-culottes.png',
      '/images/products/linen-culottes-detail.png',
      '/images/products/linen-culottes-lifestyle.png',
      '/images/products/benangbaju-label.png',
      '/images/products/benangbaju-thank-you.png',
    ],
    description: 'Celana kulot berbahan linen premium dengan potongan yang longgar namun tetap terstruktur. Nyaman digunakan seharian dengan sirkulasi udara yang baik. Desain serbaguna yang bisa dipadukan dengan berbagai atasan.',
    shortDescription: 'Kulot linen premium yang nyaman, breathable, dan mudah dipadukan.',
    category: 'Bawahan',
    unitsSold: 20,
    ctaPrimary: 'Tambah ke Tas',
    colorVariants: [
      { color: '#D6CFC7', name: 'Oatmeal', price: 229000, oldPrice: 289000 },
      { color: '#2C2C2C', name: 'Black', price: 229000, oldPrice: 289000 },
    ],
  },
  {
    id: 'kit_1',
    name: 'Paket Lengkap benangbaju',
    category: 'Paket Koleksi',
    tagline: 'Solusi Wardrobe Lengkap (Hemat 20%)',
    price: 1099000,
    oldPrice: 1375000,
    image: '/images/products/batik-dress.png',
    additionalImages: [
      '/images/products/batik-dress.png',
      '/images/products/linen-atasan.png',
      '/images/products/pleated-skirt.png',
      '/images/products/cotton-blouse.png',
      '/images/products/linen-culottes.png',
    ],
    badge: 'kit',
    description: 'Koleksi lengkap seluruh produk fashion kami dalam satu paket hemat. Terdiri dari Atasan Linen, Dress Batik, Rok Plisket, Blouse Katun, dan Kulot Linen. Pilihan sempurna untuk membangun wardrobe impian Anda.',
    shortDescription: 'Seluruh koleksi fashion kami dalam satu paket hemat yang elegan.',
  },
];
