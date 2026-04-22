import { getSupabaseAdmin } from "@/utils/supabase";

type AddToWaitlistInput = {
  productId: string;
  email: string;
};

export async function addEmailToWaitlist(input: AddToWaitlistInput) {
  const supabaseAdmin = getSupabaseAdmin();
  const normalizedEmail = input.email.toLowerCase().trim();

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, name")
    .eq("id", input.productId)
    .maybeSingle();

  if (productError) {
    return { ok: false as const, status: 500, error: "Failed to validate product", details: productError.message };
  }

  if (!product) {
    return { ok: false as const, status: 404, error: "Product not found" };
  }

  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .insert({
      product_id: input.productId,
      email: normalizedEmail,
    })
    .select("id")
    .single();

  if (error?.code === "23505") {
    return {
      ok: true as const,
      data: {
        alreadyExists: true,
        productName: product.name,
      },
    };
  }

  if (error) {
    return {
      ok: false as const,
      status: 500,
      error: "Failed to add to waitlist",
      details: error.message,
    };
  }

  return {
    ok: true as const,
    data: {
      alreadyExists: false,
      waitlistId: data.id,
      productName: product.name,
    },
  };
}
