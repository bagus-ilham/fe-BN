/**
 * Pengiriman Email Transaksional — benangbaju
 * Menggunakan Resend. Pengirim: benangbaju <halo@benangbaju.com>
 */

import { Resend } from "resend";

const FROM_EMAIL = "halo@benangbaju.com";
const FROM_NAME = "benangbaju";
const BACKGROUND = "#F9F7F2";
const TEXT = "#1B2B22";
const BORDER = "rgba(27,43,34,0.12)";

type EmailSendResult = {
  data?: { id?: string | null } | null;
  error?: { message?: string } | null;
};

type EmailClient = {
  emails: {
    send: (params: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }) => Promise<EmailSendResult>;
  };
};

function getResendClient(): EmailClient {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_123456789") {
    // Fallback to mock if API key is missing or is the placeholder
    return {
      emails: {
        send: async () => {
          console.log("[MOCK EMAIL] API Key missing, simulating success");
          return { data: { id: "mock-email-id" }, error: null };
        }
      }
    };
  }
  return new Resend(apiKey) as unknown as EmailClient;
}

/** Format harga Rupiah (Rp 299.000) */
const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return IDR_FORMATTER.format(value);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export interface SendOrderConfirmationParams {
  customerEmail: string;
  customerName: string | null;
  orderId: string;
  orderDate: string;
  totalAmount: number;
  status: "Paid" | "Processing" | "Pending";
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    product_image?: string | null;
  }>;
  orderUrl?: string;
  siteUrl?: string;
}

function generateOrderConfirmationHtml(params: SendOrderConfirmationParams): string {
  const shortId = params.orderId.slice(0, 8).toUpperCase();
  const siteUrl = params.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://benangbaju.com";
  
  const itemsHtml = params.items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${BORDER};">
        <p style="margin:0;font-size:14px;font-weight:500;">${escapeHtml(item.product_name)}</p>
        <p style="margin:4px 0 0 0;font-size:12px;opacity:0.6;">${item.quantity} x ${formatPrice(item.price)}</p>
      </td>
      <td style="padding:12px 0;text-align:right;border-bottom:1px solid ${BORDER};vertical-align:top;">
        <p style="margin:0;font-size:14px;font-weight:500;">${formatPrice(item.price * item.quantity)}</p>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="id-ID">
<head>
  <meta charset="UTF-8">
  <title>Konfirmasi Pesanan #${shortId} — benangbaju</title>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:${BACKGROUND};color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px 40px;text-align:center;border-bottom:1px solid ${BORDER};">
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};">benangbaju</h1>
            <p style="margin:12px 0 0 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.7;">Konfirmasi Pesanan</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;">Halo, ${escapeHtml(params.customerName?.split(" ")[0] ?? "Pelanggan")}.</p>
            <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;">Terima kasih telah berbelanja di benangbaju. Pesanan Anda <strong>#${shortId}</strong> telah kami terima dan sedang diproses.</p>
            
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <thead>
                <tr>
                  <th style="text-align:left;font-size:10px;text-transform:uppercase;tracking:0.1em;opacity:0.5;padding-bottom:8px;">Produk</th>
                  <th style="text-align:right;font-size:10px;text-transform:uppercase;tracking:0.1em;opacity:0.5;padding-bottom:8px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding:16px 0 8px 0;font-size:13px;opacity:0.7;">Subtotal</td>
                  <td style="padding:16px 0 8px 0;font-size:13px;text-align:right;">${formatPrice(params.totalAmount)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;font-weight:600;">Total Pembayaran</td>
                  <td style="padding:8px 0;font-size:18px;font-weight:600;text-align:right;color:${TEXT};">${formatPrice(params.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background:rgba(27,43,34,0.04);border:1px solid ${BORDER};border-radius:4px;padding:24px;margin-bottom:32px;">
              <h4 style="margin:0 0 12px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Status Pembayaran: ${params.status}</h4>
              <p style="margin:0;font-size:13px;line-height:1.5;opacity:0.8;">Kami akan segera mengirimkan nomor resi setelah pesanan Anda diserahkan ke kurir.</p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${escapeHtml(params.orderUrl ?? siteUrl)}" style="display:inline-block;padding:14px 32px;background-color:${TEXT};color:${BACKGROUND};text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;border-radius:4px;">
                  Lihat Detail Pesanan
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;text-align:center;border-top:1px solid ${BORDER};">
            <p style="margin:0;font-size:11px;color:${TEXT};opacity:0.7;">benangbaju · Dirajut dengan rasa</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationParams,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const html = generateOrderConfirmationHtml(params);
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.customerEmail,
      subject: `Konfirmasi Pesanan #${params.orderId.slice(0, 8).toUpperCase()} — benangbaju`,
      html,
    });

    if (error) throw error;
    return { success: true, messageId: data?.id ?? undefined };
  } catch (err: unknown) {
    console.error("[EMAIL] Error sending confirmation:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── D+3: Check-in ───────────────────────────────────────────────────────────

export interface SendSequenceEmailParams {
  customerEmail: string;
  customerName: string | null;
  productNames: string[];
  productIds?: string[];
  orderId: string;
  siteUrl?: string;
}

function generateD3Html(params: SendSequenceEmailParams): string {
  const siteUrl = params.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://benangbaju.com";
  const firstName = params.customerName?.split(" ")[0] ?? "Pelanggan";
  const productList = params.productNames.length > 0
    ? params.productNames.map((n) => escapeHtml(n)).join(", ")
    : "koleksi benangbaju Anda";
  const firstProductId = params.productIds?.[0];
  const reviewUrl = firstProductId
    ? `${siteUrl}/product/${encodeURIComponent(firstProductId)}`
    : siteUrl;

  return `
<!DOCTYPE html>
<html lang="id-ID">
<head>
  <meta charset="UTF-8">
  <title>Bagaimana pengalaman Anda? — benangbaju</title>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:${BACKGROUND};color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px 40px;text-align:center;border-bottom:1px solid ${BORDER};">
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};">benangbaju</h1>
            <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};opacity:0.7;">3 Hari Bersama benangbaju</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">Halo, ${escapeHtml(firstName)}.</p>
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">
              Sudah 3 hari sejak <strong>${productList}</strong> sampai di tangan Anda. Kami berharap produk tersebut memberikan sentuhan keanggunan pada hari-hari Anda.
            </p>
            <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;">
              Bagaimana pengalaman Anda sejauh ini? Berikan ulasan Anda dan bantu perempuan Indonesia lainnya menemukan gaya terbaik mereka.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td align="center">
                <a href="${escapeHtml(reviewUrl)}" style="display:inline-block;padding:14px 32px;background-color:${TEXT};color:${BACKGROUND};text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;border-radius:4px;">
                  Berikan Ulasan
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;text-align:center;border-top:1px solid ${BORDER};">
            <p style="margin:0;font-size:11px;color:${TEXT};opacity:0.7;">benangbaju · Dirajut dengan rasa</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function sendD3CheckInEmail(params: SendSequenceEmailParams) {
  try {
    const html = generateD3Html(params);
    const resend = getResendClient();
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.customerEmail,
      subject: "Bagaimana pengalaman Anda dengan benangbaju?",
      html,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ─── D+7: Reorder ────────────────────────────────────────────────────────────

function generateD7Html(params: SendSequenceEmailParams): string {
  const siteUrl =
    params.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://benangbaju.com";
  const firstName = params.customerName?.split(" ")[0] ?? "Pelanggan";
  const productList =
    params.productNames.length > 0
      ? params.productNames.map((n) => escapeHtml(n)).join(", ")
      : "koleksi benangbaju Anda";
  const firstProductId = params.productIds?.[0];
  const productUrl = firstProductId
    ? `${siteUrl}/product/${encodeURIComponent(firstProductId)}`
    : siteUrl;

  return `
<!DOCTYPE html>
<html lang="id-ID">
<head>
  <meta charset="UTF-8">
  <title>Waktunya koleksi baru — benangbaju</title>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:${BACKGROUND};color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px 40px;text-align:center;border-bottom:1px solid ${BORDER};">
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};">benangbaju</h1>
            <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};opacity:0.7;">7 Hari Bersama benangbaju</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">Halo, ${escapeHtml(firstName)}.</p>
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">
              Sudah seminggu sejak <strong>${productList}</strong> menemani hari-hari Anda. Kalau Anda suka, mungkin ini saat yang tepat untuk menambah koleksi berikutnya.
            </p>
            <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;">
              Kami siapkan rekomendasi pilihan yang cocok untuk dipadukan dengan gaya Anda.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td align="center">
                <a href="${escapeHtml(productUrl)}" style="display:inline-block;padding:14px 32px;background-color:${TEXT};color:${BACKGROUND};text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;border-radius:4px;">
                  Lihat Rekomendasi
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;text-align:center;border-top:1px solid ${BORDER};">
            <p style="margin:0;font-size:11px;color:${TEXT};opacity:0.7;">benangbaju · Dirajut dengan rasa</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function sendD7ReorderEmail(params: SendSequenceEmailParams) {
  try {
    const html = generateD7Html(params);
    const resend = getResendClient();
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.customerEmail,
      subject: "Waktunya koleksi baru — benangbaju",
      html,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ─── CHECKOUT ABANDONMENT ────────────────────────────────────────────────────

export interface SendAbandonEmailParams {
  customerEmail: string;
  cartItems?: Array<{ name: string; quantity: number; price: number }> | null;
  siteUrl?: string;
}

function generateAbandonHtml(params: SendAbandonEmailParams): string {
  const siteUrl = params.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://benangbaju.com";
  
  return `
<!DOCTYPE html>
<html lang="id-ID">
<head>
  <meta charset="UTF-8">
  <title>Keranjang Anda menanti — benangbaju</title>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:${BACKGROUND};color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};">benangbaju</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">Masih berminat dengan koleksi kami?</p>
            <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;">
              Kami melihat Anda meninggalkan produk cantik di keranjang belanja. Stok kami terbatas dan koleksi ini sedang banyak diminati. Jangan sampai kehabisan gaya favorit Anda!
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td align="center">
                <a href="${escapeHtml(siteUrl + "/checkout")}" style="display:inline-block;padding:14px 32px;background-color:${TEXT};color:${BACKGROUND};text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;border-radius:4px;">
                  Selesaikan Pesanan
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function sendAbandonEmail(params: SendAbandonEmailParams) {
  try {
    const html = generateAbandonHtml(params);
    const resend = getResendClient();
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.customerEmail,
      subject: "Keranjang benangbaju Anda menanti",
      html,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

