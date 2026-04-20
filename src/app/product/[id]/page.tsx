import ProductPageContent from "@/components/ProductPageContent";
import { Product, PRODUCTS } from "@/constants/products";
import { Review } from "@/types/database";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://benangbaju.com";

export async function generateStaticParams() {
  
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<import("next").Metadata> {
  const { id } = await params;
  
  let resolvedProduct = null;
  
  if (!resolvedProduct) {
    const fallback = PRODUCTS.find((pr: Product) => pr.id === id);
    if (fallback) {
      resolvedProduct = {
        id: fallback.id,
        name: fallback.name,
        tagline: fallback.tagline,
        description: fallback.description,
        image_url: fallback.image
      } as any;
    }
  }

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
  
  
  // Se houver erro ou tidak FIND di DATABASE, mencari di konstanta lokal (fallback)
  let productData = null; 
  
  if (!productData) {
    const fallbackProduct = PRODUCTS.find((prod: Product) => prod.id === id);
    if (fallbackProduct) {
      // Map constant to DB-like structure for the mapping logic below
      productData = {
        id: fallbackProduct.id,
        name: fallbackProduct.name,
        price: fallbackProduct.price,
        old_price: fallbackProduct.oldPrice,
        image_url: fallbackProduct.image,
        description: fallbackProduct.description,
        category: fallbackProduct.category,
        badge: fallbackProduct.badge,
        tagline: fallbackProduct.tagline,
        short_description: fallbackProduct.shortDescription,
        units_sold: fallbackProduct.unitsSold,
        cta_primary: fallbackProduct.ctaPrimary,
        additional_images: fallbackProduct.additionalImages,
        color_variants: fallbackProduct.colorVariants
      };
    }
  }

  if (!productData) notFound();
  
  const p_final = productData;


  const PRODUCT_BADGES = new Set<Product["badge"]>(["bestseller", "new", "vegan", "kit"]);

  // Map to UI Product interface
  const product: Product = {
    id: p_final.id,
    name: p_final.name,
    price: p_final.price,
    oldPrice: p_final.old_price,
    image: p_final.image_url || "",
    description: p_final.description || "",
    category: p_final.category,
    badge: PRODUCT_BADGES.has(p_final.badge as Product["badge"])
      ? (p_final.badge as Product["badge"])
      : undefined,
    tagline: p_final.tagline,
    shortDescription: p_final.short_description,
    unitsSold: p_final.units_sold,
    ctaPrimary: p_final.cta_primary,
    additionalImages: typeof p_final.additional_images === 'string' ? JSON.parse(p_final.additional_images) : (p_final.additional_images || []),
    colorVariants: p_final.color_variants
  };

  const productUrl = `${BASE_URL}/product/${product.id}`;
  const productImageUrl = product.image;

  
  const reviewCount = product.reviews || 0;
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
          price: product.price.toFixed(0),
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

  const productImgEncoded = encodeURIComponent(product.image);
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
      <ProductPageContent product={product} />
    </>
  );
}
