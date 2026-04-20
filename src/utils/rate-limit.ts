/**
 * Rate limiter in-memory dengan sliding window.
 *
 * CATATAN: pada lingkungan serverless (Vercel), tiap instance punya memori terpisah,
 * jadi limiter ini berlaku per instance. Untuk rate limit global di produksi
 * dengan trafik tinggi, gunakan Redis (misalnya Upstash). Untuk skala benangbaju saat ini,
 * pendekatan ini sudah memadai.
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, WindowEntry>();

/** Menghapus entri kedaluwarsa secara berkala agar tidak terjadi memory leak */
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}

let cleanupScheduled = false;
function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setTimeout(() => {
    cleanup();
    cleanupScheduled = false;
  }, 60_000);
}

export interface RateLimitOptions {
  /** Jumlah maksimum request yang diizinkan dalam satu window */
  limit: number;
  /** Durasi window dalam milidetik */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Sisa request pada window saat ini */
  remaining: number;
  /** Unix timestamp (ms) saat window direset */
  resetAt: number;
}

/**
 * Memeriksa apakah identifier (IP, userId, dll.) melewati batas.
 *
 * @param identifier - String identitas klien (IP, email, dll.)
 * @param options - Konfigurasi limit dan window
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${options.windowMs}:${options.limit}`;
  scheduleCleanup();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: options.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Mengambil IP klien dari NextRequest.
 * Mendukung header proxy (Vercel, Cloudflare).
 */
export function getClientIp(req: { headers: { get: (key: string) => string | null } }): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

