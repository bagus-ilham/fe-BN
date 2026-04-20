import { NextResponse, type NextRequest } from "next/server";

/**
 * Route callback untuk autentikasi Supabase
 *
 * Memproses:
 * - Konfirmasi email (signup)
 * - Reset kata sandi (recovery)
 * - OAuth provider (Google, dll.)
 *
 * Mengarahkan ke /auth/confirm dengan tombol wajib (rekomendasi Supabase)
 * agar pemindai email tidak mengonsumsi token.
 */

interface CallbackParams {
  code: string | null;
  type: string | null;
  next: string;
  error: string | null;
  errorCode: string | null;
  errorDescription: string | null;
}

function processAuthError(
  error: string | null,
  errorCode: string | null,
  errorDescription: string | null,
  type: string | null
): { message: string; isEmailConfirmed: boolean; isRecovery: boolean } {
  const isRecovery = type === "recovery";
  let message = "Terjadi kesalahan saat memproses autentikasi.";
  let isEmailConfirmed = false;

  if (errorCode === "otp_expired") {
    message = isRecovery
      ? "Tautan reset sudah kedaluwarsa. Silakan minta tautan baru."
      : "Tautan konfirmasi sudah kedaluwarsa. Jika Anda sudah mengonfirmasi, silakan langsung masuk.";
    isEmailConfirmed = !isRecovery;
    return { message, isEmailConfirmed, isRecovery };
  }

  if (error === "access_denied") {
    message = isRecovery
      ? "Tautan sudah digunakan. Silakan minta tautan baru."
      : "Tautan sudah digunakan. Email Anda sudah terkonfirmasi! Silakan masuk.";
    isEmailConfirmed = !isRecovery;
    return { message, isEmailConfirmed, isRecovery };
  }

  if (errorDescription) {
    message = decodeURIComponent(errorDescription).replace(/\+/g, " ");
    isEmailConfirmed = !isRecovery && (errorDescription.includes("already") || errorDescription.includes("used"));
    return { message, isEmailConfirmed, isRecovery };
  }

  if (error) {
    message = "Terjadi kesalahan saat memproses tautan. Silakan coba lagi.";
  }

  return { message, isEmailConfirmed, isRecovery };
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const searchParams = requestUrl.searchParams;

  // Normalisasi origin
  let origin = requestUrl.origin;
  if (origin.includes("www.")) {
    origin = origin.replace("www.", "");
  }
  if (process.env.NODE_ENV === "production" && origin.startsWith("http://")) {
    origin = origin.replace("http://", "https://");
  }

  const params: CallbackParams = {
    code: searchParams.get("code"),
    type: searchParams.get("type"),
    next: searchParams.get("next") ?? "/",
    error: searchParams.get("error"),
    errorCode: searchParams.get("error_code"),
    errorDescription: searchParams.get("error_description"),
  };

  // SKENARIO 1: error eksplisit
  if (params.error || params.errorCode) {
    const { message, isEmailConfirmed, isRecovery } = processAuthError(
      params.error,
      params.errorCode,
      params.errorDescription,
      params.type
    );

    if (isRecovery) {
      return NextResponse.redirect(`${origin}/forgot-password?error=${encodeURIComponent(message)}`);
    }

    if (isEmailConfirmed) {
      return NextResponse.redirect(`${origin}/login?email-confirmed=true&message=${encodeURIComponent(message)}`);
    }

    return NextResponse.redirect(`${origin}/login?error=auth-error&message=${encodeURIComponent(message)}`);
  }

  // SKENARIO 2: code tersedia - redirect ke halaman dengan tombol wajib
  // (rekomendasi Supabase: mencegah pemindai email mengonsumsi token)
  if (params.code) {
    const confirmUrl = new URL(`${origin}/auth/confirm`);
    confirmUrl.searchParams.set("code", params.code);
    if (params.type) confirmUrl.searchParams.set("type", params.type);
    if (params.next) confirmUrl.searchParams.set("next", params.next);
    return NextResponse.redirect(confirmUrl.toString());
  }

  // SKENARIO 3: tidak ada code di query - token bisa ada di fragment (hash)
  // Server tidak pernah menerima fragment; hanya klien yang melihat.
  // Kita kirim HTML fallback untuk memproses hash di browser.
  return new NextResponse(getAuthCallbackFallbackHtml(origin), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function getAuthCallbackFallbackHtml(origin: string): string {
  const base = origin.replace(/\/$/, "");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Memproses…</title>
</head>
<body>
  <p style="font-family:system-ui;text-align:center;padding:2rem;">Memproses…</p>
  <script>
(function() {
  var hash = window.location.hash && window.location.hash.slice(1);
  var search = window.location.search || "";
  if (!hash) {
    window.location.replace("${base}/login?error=no-code&message=" + encodeURIComponent("Tautan tidak valid. Silakan periksa email Anda."));
    return;
  }
  var params = new URLSearchParams(hash);
  var error = params.get("error");
  var errorDescription = params.get("error_description");
  var type = params.get("type");
  if (error) {
    var msg = errorDescription ? decodeURIComponent(errorDescription.replace(/\\+/g, " ")) : "Terjadi kesalahan saat memproses tautan.";
    var target = type === "recovery" ? "${base}/forgot-password?error=" : "${base}/login?error=auth-error&message=";
    window.location.replace(target + encodeURIComponent(msg));
    return;
  }
  window.location.replace("${base}/auth/process-hash" + search + window.location.hash);
})();
  </script>
</body>
</html>`;
}
