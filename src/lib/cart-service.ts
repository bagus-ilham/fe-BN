import { cartRepository } from "@/lib/repositories/cart-repository";

export async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) return null;

  const { data, error } = userId
    ? await cartRepository.getByUserId(userId)
    : await cartRepository.getBySessionId(sessionId as string);

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching cart:", error);
    return null;
  }

  if (data) return data;

  // Create new cart if not found
  const { data: newCart, error: createError } = await cartRepository.create({
      user_id: userId || null,
      session_id: userId ? null : (sessionId ?? null),
    });

  if (createError) {
    console.error("Error creating cart:", createError);
    return null;
  }

  return newCart;
}

export async function addToCartDB(cartId: string, variantId: string, quantity = 1) {
  const { data, error } = await cartRepository.addItem(cartId, variantId, quantity);

  return { data, error };
}

export async function removeFromCartDB(cartId: string, variantId: string) {
  const { error } = await cartRepository.removeItem(cartId, variantId);

  return { error };
}

export async function updateCartItemQtyDB(cartId: string, variantId: string, quantity: number) {
  const { data, error } = await cartRepository.updateItemQty(cartId, variantId, quantity);

  return { data, error };
}

