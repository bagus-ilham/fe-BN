import { listActiveProducts } from "@/lib/application/products/product-query-service";
import { getActiveFlashSale } from "@/lib/application/marketing/marketing-query-service";
import HomepageClient from "@/components/HomepageClient";

export default async function HomePage() {
  const [finalProducts, flashSale] = await Promise.all([
    listActiveProducts(20),
    getActiveFlashSale()
  ]);

  return <HomepageClient products={finalProducts} flashSale={flashSale} />;
}
