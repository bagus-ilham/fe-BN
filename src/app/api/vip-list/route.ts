import { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/utils/rate-limit";
import { upsertVipEntry } from "@/lib/application/marketing/vip-list-use-case";
import { badRequest, internalError, ok, tooManyRequests } from "@/lib/http/api-response";
import { VIP_LIST_ERROR_MESSAGES, VIP_LIST_MESSAGES } from "@/constants/api-messages";

// ============================================================================
// CONFIGURAÇÃO DE RUNTIME PARA API ROUTE
// ============================================================================
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Esta rota usa a service role key para garantir inserção na VIP list
// mesmo para usuários não autenticados, contornando as políticas RLS
//
// NOTA: A coluna 'phone' não está sendo usada aqui porque pode não existir na tabela.
// Para adicionar suporte a phone, execute o script vip_list_add_phone.sql no Supabase SQL Editor.
// Após adicionar a coluna, você pode descomentar as linhas que incluem phone nos dados.
export async function POST(request: NextRequest) {
  const rl = rateLimit(getClientIp(request), { limit: 5, windowMs: 60_000 });
  if (!rl.success) {
    return tooManyRequests(
      VIP_LIST_ERROR_MESSAGES.TOO_MANY_ATTEMPTS,
      Math.ceil((rl.resetAt - Date.now()) / 1000),
    );
  }

  try {
    let body: { email?: string; full_name?: string; phone?: string };
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[VIP LIST API] Erro ao parsear body:", parseError);
      return badRequest(VIP_LIST_ERROR_MESSAGES.INVALID_DATA_FORMAT);
    }

    const { email, full_name, phone } = body;
    if (!email || !email.trim()) {
      return badRequest(VIP_LIST_ERROR_MESSAGES.EMAIL_REQUIRED);
    }

    if (!full_name || !full_name.trim()) {
      return badRequest(VIP_LIST_ERROR_MESSAGES.FULL_NAME_REQUIRED);
    }

    const result = await upsertVipEntry({
      email,
      fullName: full_name,
      phone,
    });

    if (!result.ok) {
      return internalError(VIP_LIST_ERROR_MESSAGES.REGISTRATION_FAILED as string, result.error);
    }

    return ok({
      success: true,
      message: VIP_LIST_MESSAGES.ENROLLED,
      data: result.data,
    });
  } catch (err: unknown) {
    console.error("[VIP LIST API] Exceção não tratada:", err);
    return internalError(
      VIP_LIST_ERROR_MESSAGES.UNEXPECTED_ERROR as string,
      err instanceof Error ? err.message : VIP_LIST_ERROR_MESSAGES.UNKNOWN_ERROR,
    );
  }
}
