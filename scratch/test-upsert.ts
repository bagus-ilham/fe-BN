import { productRepository } from "./src/lib/repositories/product-repository";
import { config } from "dotenv";
config({ path: ".env.local" });

async function test() {
  const productId = "test-product-" + Math.random().toString(36).substring(7);
  const productData = {
    name: "Test Product",
    base_price: 100000,
    description: "Test description",
  };

  console.log("Testing product upsert...");
  const { data: pData, error: pError } = await productRepository.upsertProductAdmin(productId, productData);
  if (pError) {
    console.error("Product upsert failed:", pError);
    return;
  }
  console.log("Product upsert success!");

  const variant = {
    color: "#ff0000",
    name: "Red",
    price: 120000,
    old_price: 0
  };

  console.log("Testing variant upsert...");
  const { error: vError } = await productRepository.upsertProductVariantAdmin(productId, variant);
  if (vError) {
    console.error("Variant upsert failed:", vError);
  } else {
    console.log("Variant upsert success!");
  }
}

test();
