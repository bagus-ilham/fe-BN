import type { CreateOrderRequest } from "@/types/contracts/order";

type CartLikeItem = {
  id: string;
  name: string;
  base_price: number;
  quantity: number;
  image_url?: string;
  variantId?: string;
};

export function validateCheckoutCartVariants(items: CartLikeItem[]) {
  const missingVariant = items.find((item) => !item.variantId);
  if (!missingVariant) return null;
  return `Produk "${missingVariant.name}" belum memiliki varian yang valid. Silakan pilih ulang varian sebelum checkout.`;
}

export function mapCartToOrderItems(items: CartLikeItem[]): CreateOrderRequest["items"] {
  return items.map((item) => ({
    variant_id: item.variantId as string,
    quantity: item.quantity,
    price: item.base_price,
    product_id: item.id,
    product_name: item.name,
    image: item.image_url,
  }));
}

