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

function getResendClient(): any {
  // Use a dummy client for mockup mode
  return {
    emails: {
      send: async () => ({ data: { id: "mock-email-id" }, error: null })
    }
  };
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
  pixCopyPaste?: string | null;
  pixInstructions?: string | null;
  orderUrl?: string;
  siteUrl?: string;
}

function generateOrderConfirmationHtml(params: SendOrderConfirmationParams): string {
  // Logic remains for previewing or template work
  return "MOCK_HTML";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * MOCK: Simulates sending order confirmation email
 */
export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationParams,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  console.log(`[MOCK EMAIL] Sending order confirmation to ${params.customerEmail}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, messageId: "mock-msg-123" };
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

// ─── SHIPPING TRACKING ───────────────────────────────────────────────────────

export interface SendTrackingEmailParams {
  customerEmail: string;
  customerName: string | null;
  orderId: string;
  trackingCode: string;
  trackingUrl?: string | null;
  trackingCarrier?: string | null;
  siteUrl?: string;
}

function generateTrackingHtml(params: SendTrackingEmailParams): string {
  const shortId = params.orderId.slice(0, 8).toUpperCase();
  const carrier = params.trackingCarrier ?? "Kurir Lokal";
  
  return `
<!DOCTYPE html>
<html lang="id-ID">
<head>
  <meta charset="UTF-8">
  <title>Pesanan Anda Sedang Dikirim — benangbaju</title>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:${BACKGROUND};color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px 40px;text-align:center;border-bottom:1px solid ${BORDER};">
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};">benangbaju</h1>
            <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};opacity:0.7;">Pesanan Dikirim</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;">Halo, ${escapeHtml(params.customerName?.split(" ")[0] ?? "Pelanggan")}.</p>
            <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;">
              Kabar baik! Pesanan <strong>#${shortId}</strong> Anda telah diserahkan ke kurir dan sedang dalam perjalanan menuju lokasi Anda.
            </p>
            <div style="background:rgba(27,43,34,0.04);border:1px solid ${BORDER};border-radius:4px;padding:24px;margin:0 0 28px 0;">
              <p style="margin:0 0 8px 0;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;opacity:0.7;">Resi Pengiriman</p>
              <p style="margin:0 0 12px 0;font-size:20px;font-family:monospace;letter-spacing:0.08em;">${escapeHtml(params.trackingCode)}</p>
              <p style="margin:0;font-size:13px;opacity:0.75;">Kurir: ${escapeHtml(carrier)}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;text-align:center;border-top:1px solid ${BORDER};">
            <p style="margin:0;font-size:11px;color:${TEXT};opacity:0.7;">benangbaju · Keanggunan di Setiap Helai</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function sendTrackingEmail(params: SendTrackingEmailParams) {
  try {
    const html = generateTrackingHtml(params);
    const resend = getResendClient();
    const shortId = params.orderId.slice(0, 8).toUpperCase();
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.customerEmail,
      subject: `Pesanan #${shortId} Sedang Dikirim — Resi: ${params.trackingCode} | benangbaju`,
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

// ─── PASSWORD RESET ──────────────────────────────────────────────────────────

export interface SendPasswordResetParams {
  to: string;
  tempPassword: string;
}

function generatePasswordResetHtml(params: SendPasswordResetParams): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://benangbaju.com";
  
  return `
<!DOCTYPE html>
<html lang="id-ID">
<head>
  <meta charset="UTF-8">
  <title>Pemulihan Akses — benangbaju</title>
</head>
<body style="margin:0;padding:0;font-family:sans-serif;background-color:${BACKGROUND};color:${TEXT};">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND};border:1px solid ${BORDER};">
        <tr>
          <td style="padding:32px 40px;text-align:center;border-bottom:1px solid ${BORDER};">
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:${TEXT};">benangbaju</h1>
            <p style="margin:12px 0 0 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.7;">Pemulihan Akses</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;">Anda meminta pengaturan ulang kata sandi. Berikut adalah kata sandi sementara Anda:</p>
            <div style="background:rgba(27,43,34,0.08);border:1px solid ${BORDER};border-radius:4px;padding:20px;margin-bottom:24px;text-align:center;">
              <p style="margin:0;font-size:24px;font-family:monospace;letter-spacing:0.1em;">${escapeHtml(params.tempPassword)}</p>
            </div>
            <p style="margin:0 0 24px 0;font-size:14px;line-height:1.6;">Silakan masuk menggunakan kata sandi ini dan segera ganti di halaman <strong>Profil</strong> Anda.</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${escapeHtml(siteUrl + "/login")}" style="display:inline-block;padding:14px 28px;background-color:${TEXT};color:${BACKGROUND};text-decoration:none;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;border-radius:4px;">
                  Masuk Sekarang
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

export async function sendPasswordResetEmail(params: SendPasswordResetParams) {
  try {
    const html = generatePasswordResetHtml(params);
    const resend = getResendClient();
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.to,
      subject: "Pemulihan Akses Akun — benangbaju",
      html,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

