import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/utils/rate-limit';
import { InventoryStatusItem } from '@/types/contracts/inventory';
import { getInventoryStatus } from '@/lib/inventory-service';
import { API_ERROR_MESSAGES, INVENTORY_ERROR_MESSAGES } from '@/constants/api-messages';

// ============================================================================
// API: CONSULTAR STATUS DO ESTOQUE
// ============================================================================
// Rota: GET /api/inventory/status
// Retorna o status do estoque de todos os produtos ou de um produto específico
// ============================================================================

/**
 * GET /api/inventory/status
 * Query params:
 * - product_id (opcional): ID do produto específico
 */
export async function GET(req: NextRequest) {
  const rl = rateLimit(getClientIp(req), { limit: 60, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.TOO_MANY_REQUESTS },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');
    const result = await getInventoryStatus(productId);
    if (!result.ok) {
      return NextResponse.json(
        { error: INVENTORY_ERROR_MESSAGES.FETCH_STATUS_FAILED, details: result.error },
        { status: 500 }
      );
    }
    const normalized: InventoryStatusItem[] = result.data;

    // Se consultou produto específico, retornar apenas ele
    if (productId) {
      const product = normalized.length > 0 ? normalized[0] : null;
      
      if (!product) {
        return NextResponse.json(
          { error: INVENTORY_ERROR_MESSAGES.PRODUCT_NOT_FOUND },
          { status: 404 }
        );
      }

      return NextResponse.json(product, {
        headers: {
          // Cache de 30s na CDN; serve dado stale por até 60s enquanto revalida.
          // Estoque pode mudar com compras, por isso o TTL é curto.
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      });
    }

    // Retornar todos os produtos
    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });

  } catch (err: unknown) {
    console.error('Error in inventory status API:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
