import { NextRequest } from "next/server";
import { processEmailSequenceCron } from "@/lib/application/marketing/marketing-automation-service";
import { internalError, ok, unauthorized } from "@/lib/http/api-response";

/**
 * Cron: processar fila de e-mails da sequence pós-compra + abandono de checkout.
 *
 * Busca até 50 registros com status "pending" e send_at <= agora,
 * envia via Resend e atualiza o status.
 *
 * vercel.json: { "crons": [{ "path": "/api/cron/email-sequence", "schedule": "0 * * * *" }] }
 * → executa a cada hora (plano Hobby: 2 crons máx.)
 */

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return unauthorized();
  }

  const result = await processEmailSequenceCron(50);
  if (!result.ok) {
    return internalError(result.error);
  }
  return ok({
    processed: result.processed,
    sent: result.sent,
    failed: result.failed,
  });
}

export async function POST(req: NextRequest) {
  return GET(req);
}

