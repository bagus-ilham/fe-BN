import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://benangbaju.com";

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/protocols`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/batch-zero`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  // 2. Fetch Dynamic data
  let productPages: MetadataRoute.Sitemap = [];
  let kitPages: MetadataRoute.Sitemap = [];

  try {
    const { listActiveProducts } = await import("@/lib/application/products/product-query-service");
    const { listActiveKits } = await import("@/lib/kit-service");
    
    const products = await listActiveProducts(1000);
    const kits = await listActiveKits();

    productPages = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    kitPages = kits.map((kit: any) => ({
      url: `${baseUrl}/protocol/${kit.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticPages, ...productPages, ...kitPages];
}

