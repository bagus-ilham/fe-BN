import { NextRequest } from "next/server";
import { captureCheckoutAbandonment } from "@/lib/application/marketing/marketing-automation-service";
import { badRequest, internalError, ok } from "@/lib/http/api-response";
import { API_ERROR_MESSAGES } from "@/constants/api-messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/checkout/abandon
 *
 * Registra (upsert por e-mail) um abandono de checkout.
 * Chamado no onBlur do campo de e-mail e do campo de telefone do checkout.
 *
 * Body: { email, phone?, cart_items? }
 *
 * Comportamento:
 * - Se já existe um registro pendente para o e-mail, atualiza (phone, cart_items, send_at).
 * - Se o pedido já foi concluído (status = converted), não faz nada.
 * - send_at = agora + 1h (o cron envia após esse intervalo).
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; phone?: string; cart_items?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return badRequest(API_ERROR_MESSAGES.INVALID_JSON);
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return badRequest(API_ERROR_MESSAGES.INVALID_EMAIL);
  }

  const phone = body.phone?.replace(/\D/g, "").slice(0, 11) || null;
  const result = await captureCheckoutAbandonment({
    email,
    phone,
    cartItems: body.cart_items ?? null,
  });

  if (!result.ok) {
    return internalError(result.error);
  }

  if ("skipped" in result) return ok({ ok: true, skipped: true });
  if ("updated" in result) return ok({ ok: true, updated: true });
  return ok({ ok: true, created: true });
}
