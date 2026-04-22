import ProductPageContent from "@/components/ProductPageContent";
import { Product } from "@/constants/products";
import { Review, ProductRow } from "@/types/database";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://benangbaju.com";

export async function generateStaticParams() {
  const { listActiveProducts } = await import("@/lib/application/products/product-query-service");
  const products = await listActiveProducts(100);
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<import("next").Metadata> {
  const { id } = await params;
  
  const { getProductById } = await import("@/lib/application/products/product-query-service");
  let resolvedProduct = await getProductById(id);
  
  // Removed fallback to PRODUCTS constant

  if (!resolvedProduct) {
    return {
      title: "Produk tidak ditemukan | benangbaju",
      description: "Produk tidak ditemukan",
    };
  }

  const p_meta = resolvedProduct;

  const productImageUrl = p_meta.image_url;
  const title = p_meta.tagline
    ? `${p_meta.name} | ${p_meta.tagline}`
    : `benangbaju | ${p_meta.name}`;
  const description = `Beli ${p_meta.name}. ${p_meta.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "id_ID",
      images: [
        {
          url: productImageUrl || "",
          width: 1200,
          height: 630,
          alt: p_meta.name,
          type: "image/jpeg",
        },
      ],
      url: `${BASE_URL}/product/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: productImageUrl || "", alt: p_meta.name }],
    },
    alternates: {
      canonical: `${BASE_URL}/product/${id}`,
    },
  };
}



export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  // 1. Coba ambil dari Database Supabase (v6.6)
  let productData: any = null;
  let recommendedProducts: any[] = [];
  
  try {
    const { getProductById, getRecommendedProducts } = await import("@/lib/application/products/product-query-service");
    const dbProduct = await getProductById(id);
    if (dbProduct) {
      productData = dbProduct;
    }
    
    recommendedProducts = await getRecommendedProducts(id);
  } catch (err) {
    console.error("Database fetch failed, using fallback:", err);
  }

  // Fallback to local constants removed

  if (!productData) notFound();
  const product = productData as ProductRow & {
    color_variants?: any[];
    additional_images?: string[];
  };

  const productUrl = `${BASE_URL}/product/${product.id}`;
  const productImageUrl = product.image_url;

  const reviewCount = product.reviews_count || 0;
  const ratingValue = product.rating || null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: productImageUrl,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: "benangbaju",
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "IDR",
          price: (product.base_price || 0).toFixed(0),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "benangbaju",
            url: BASE_URL,
          },
        },
        ...(ratingValue && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: ratingValue,
            reviewCount: reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Produk",
            item: `${BASE_URL}/#products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };

  const productImgEncoded = encodeURIComponent(product.image_url || "");
  const productImgSrcSet = [320, 640, 828]
    .map((w) => `/_next/image?url=${productImgEncoded}&w=${w}&q=80 ${w}w`)
    .join(", ");

  return (
    <>
      <link
        rel="preload"
        as="image"
        imageSrcSet={productImgSrcSet}
        imageSizes="(max-width: 768px) 100vw, 50vw"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageContent product={product} initialRecommendations={recommendedProducts} />
    </>
  );
}
