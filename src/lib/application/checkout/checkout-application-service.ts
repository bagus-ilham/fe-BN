import { mapCartToOrderItems, validateCheckoutCartVariants } from "@/lib/use-cases/checkout-use-cases";
import type { CreateOrderRequest } from "@/types/contracts/order";
import type { CheckoutFormData } from "@/types/checkout";
import { supabase } from "@/utils/supabase";

type CartItem = {
  id: string;
  name: string;
  base_price: number;
  quantity: number;
  image_url?: string;
  variantId?: string;
};

type BuildCheckoutInput = {
  cart: CartItem[];
  userId: string | null;
  form: CheckoutFormData;
  totalPrice: number;
  shippingAmount: number;
  couponCode?: string;
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(" ").filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

export async function createOrderForCheckout(input: BuildCheckoutInput) {
  const variantValidationError = validateCheckoutCartVariants(input.cart);
  if (variantValidationError) {
    return { ok: false as const, error: variantValidationError, status: 400 };
  }

  const addr = input.form.address;
  const fullName = input.form.fullName.trim();
  const email = input.form.email.trim();
  const orderId = `BB-${Date.now()}`;
  const items: CreateOrderRequest["items"] = mapCartToOrderItems(input.cart);

  const { data: result, error } = await supabase.rpc("create_order_v2", {
    p_order_id: orderId,
    p_user_id: input.userId,
    p_email: email,
    p_name: fullName,
    p_phone: input.form.phone,
    p_nik: input.form.nik || null,
    p_total: input.totalPrice + input.shippingAmount,
    p_shipping: input.shippingAmount,
    p_zip: addr.zip,
    p_street: addr.street,
    p_city: addr.city,
    p_state: addr.state,
    p_coupon: input.couponCode || null,
    p_items: items,
  });

  if (error || (result && !result.success)) {
    return { ok: false as const, status: 500, error: result?.error || error?.message || "Gagal membuat pesanan" };
  }

  const { firstName, lastName } = splitName(fullName);

  return {
    ok: true as const,
    data: {
      orderId,
      grossAmount: input.totalPrice + input.shippingAmount,
      customerDetails: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: input.form.phone,
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone: input.form.phone,
          address: addr.street,
          city: addr.city,
          postal_code: addr.zip,
          country_code: "IDN",
        },
      },
      items: input.cart
        .map((item) => ({
          id: item.id,
          price: item.base_price,
          quantity: item.quantity,
          name: item.name,
        }))
        .concat([{ id: "shipping", price: input.shippingAmount, quantity: 1, name: "Biaya Pengiriman" }]),
    },
  };
}
