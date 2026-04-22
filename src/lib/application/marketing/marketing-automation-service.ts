import { sendAbandonEmail, sendD3CheckInEmail, sendD7ReorderEmail } from "@/lib/email";
import { marketingRepository } from "@/lib/repositories/marketing-repository";

type OrderItemLite = { product_id?: string | null; product_name?: string | null };

export async function processEmailSequenceCron(batchSize = 50) {
  const { data: pending, error: fetchError } = await marketingRepository.listPendingEmailSequences(
    new Date().toISOString(),
    batchSize,
  );
  if (fetchError) return { ok: false as const, error: fetchError.message };

  let sent = 0;
  let failed = 0;

  for (const row of pending ?? []) {
    let customerName: string | null = null;
    let productNames: string[] = [];
    let productIds: string[] = [];

    if (row.order_id) {
      const { data: orderData } = await marketingRepository.getOrderCustomerName(row.order_id);
      customerName = orderData?.customer_name ?? null;
      const { data: orderItems } = await marketingRepository.listOrderProductNames(row.order_id);
      const safeItems = (orderItems || []) as OrderItemLite[];
      productNames = safeItems.map((item) => item.product_name).filter((name): name is string => Boolean(name));
      productIds = safeItems.map((item) => item.product_id).filter((id): id is string => Boolean(id));
    }

    const params = { customerEmail: row.customer_email as string, customerName, productNames, productIds, orderId: (row.order_id as string) ?? "" };
    const result =
      row.sequence_type === "d3_check_in"
        ? await sendD3CheckInEmail(params)
        : row.sequence_type === "d7_reorder"
          ? await sendD7ReorderEmail(params)
          : { success: false, error: "Unsupported sequence type" };

    if (result.success) {
      await marketingRepository.updateEmailSequenceStatus(row.id, "sent");
      sent++;
    } else {
      await marketingRepository.updateEmailSequenceStatus(row.id, "failed");
      failed++;
    }
  }

  const abandon = await processAbandonEmails(batchSize);
  return {
    ok: true as const,
    processed: (pending?.length ?? 0) + abandon.sent + abandon.failed,
    sent: sent + abandon.sent,
    failed: failed + abandon.failed,
  };
}

export async function captureCheckoutAbandonment(params: { email: string; phone: string | null; cartItems: unknown }) {
  const now = new Date();
  const sendAt = new Date(now.getTime() + 60 * 60 * 1000);
  const { data: existing, error: fetchError } = await marketingRepository.getLatestCheckoutAbandonByEmail(params.email);
  if (fetchError) return { ok: false as const, error: fetchError.message };
  if (existing?.status === "converted") return { ok: true as const, skipped: true };

  if (existing?.status === "pending") {
    const { error } = await marketingRepository.updateCheckoutAbandonCapture(existing.id, {
      phone: params.phone,
      cart_items: params.cartItems,
      send_at: sendAt.toISOString(),
      captured_at: now.toISOString(),
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, updated: true };
  }

  const { error } = await marketingRepository.insertCheckoutAbandon({
    email: params.email,
    phone: params.phone,
    cart_items: params.cartItems,
    captured_at: now.toISOString(),
    send_at: sendAt.toISOString(),
    status: "pending",
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, created: true };
}

async function processAbandonEmails(batchSize: number) {
  const { data: abandons, error } = await marketingRepository.listPendingCheckoutAbandons(new Date().toISOString(), batchSize);
  if (error || !abandons?.length) return { sent: 0, failed: 0 };
  let sent = 0;
  let failed = 0;
  for (const row of abandons) {
    const result = await sendAbandonEmail({
      customerEmail: row.email as string,
      cartItems: Array.isArray(row.cart_items) ? (row.cart_items as Array<{ name: string; quantity: number; price: number }>) : null,
    });
    if (result.success) {
      await marketingRepository.updateCheckoutAbandonStatus(row.id, "sent");
      sent++;
    } else {
      await marketingRepository.updateCheckoutAbandonStatus(row.id, "failed");
      failed++;
    }
  }
  return { sent, failed };
}
