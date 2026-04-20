import { PRODUCTS } from "@/constants/products";
import HomepageClient from "@/components/HomepageClient";

export default async function HomePage() {
  const finalProducts = PRODUCTS;

  return <HomepageClient products={finalProducts} />;
}
