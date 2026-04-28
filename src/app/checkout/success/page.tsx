"use client";

import { useEffect, Suspense, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Mail, ArrowRight, Package, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trackPurchase } from "@/lib/analytics";
import { fbTrackPurchase } from "@/lib/meta-pixel";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get("order_id") ??
    searchParams.get("session_id") ??
    searchParams.get("payment_intent");
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<
    "checking" | "found" | "not_found" | "error"
  >(sessionId ? "checking" : "error");
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);
  const purchaseTrackedRef = useRef(false);

  // Bersihkan keranjang
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Periksa apakah pesanan sudah terbentuk
  useEffect(() => {
    if (!sessionId) return;

    // Backoff eksponensial: cepat di awal, sabar di akhir.
    // Mencakup hingga ~5 menit — jendela yang cukup untuk webhook Midtrans yang mungkin tertunda.
    // Upaya 1–5: 2 dtk | 6–10: 5 dtk | 11–20: 10 dtk → total ~5 mnt
    const maxAttempts = 20;
    const getDelay = (attempt: number): number => {
      if (attempt <= 5) return 2000;
      if (attempt <= 10) return 5000;
      return 10000;
    };

    attemptsRef.current = 0;
    let isCancelled = false;

    const checkOrder = async () => {
      if (isCancelled) return;

      attemptsRef.current++;

      try {
        const response = await fetch(
          `/api/orders/verify?session_id=${sessionId}`,
        );
        const data = await response.json();

        if (isCancelled) return;

        if (data.exists) {
          setOrderStatus("found");
          if (pollingRef.current) {
            clearTimeout(pollingRef.current);
            pollingRef.current = null;
          }
          // Fallback: kirim event purchase di halaman sukses (mencegah event hilang saat redirect)
          if (!purchaseTrackedRef.current && data.orderId && data.totalAmount != null && Array.isArray(data.items)) {
            purchaseTrackedRef.current = true;
            trackPurchase({
              transactionId: data.orderId,
              value: data.totalAmount,
              items: data.items.map((i: { id: string; name: string; price: number; quantity: number }) => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
              })),
            });
            // Meta Pixel Purchase - email pesanan atau fallback dari localStorage
            const customerEmail: string | null =
              (data.customerEmail as string | null) ??
              (() => { try { return localStorage.getItem("benangbaju_checkout_email"); } catch { return null; } })();
            void fbTrackPurchase({
              transactionId: data.orderId,
              value: data.totalAmount,
              contentIds: (data.items as Array<{ id: string }>).map((i) => i.id),
              numItems: (data.items as Array<{ quantity: number }>).reduce((acc, i) => acc + i.quantity, 0),
              email: customerEmail,
            }).then(() => {
              try { localStorage.removeItem("benangbaju_checkout_email"); } catch { /* ignore */ }
            });
          }
        } else if (attemptsRef.current < maxAttempts) {
          pollingRef.current = setTimeout(() => {
            checkOrder();
          }, getDelay(attemptsRef.current));
        } else {
          // Timeout setelah ~5 menit - webhook belum diterima
          setOrderStatus("not_found");
          pollingRef.current = null;
        }
      } catch (error) {
        if (isCancelled) return;

        console.error("Gagal memverifikasi pesanan:", error);
        if (attemptsRef.current < maxAttempts) {
          pollingRef.current = setTimeout(() => {
            checkOrder();
          }, getDelay(attemptsRef.current));
        } else {
          setOrderStatus("error");
          pollingRef.current = null;
        }
      }
    };

    // Verifikasi pertama segera
    checkOrder();

    // Pembersihan
    return () => {
      isCancelled = true;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 md:px-6 py-24 md:py-32">
      <div className="flex flex-col items-center text-center max-w-lg w-full mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Ikon sukses */}
        <div className="mb-8 md:mb-10 relative">
          <div className="absolute inset-0 bg-[#082f1e]/10 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-white border border-[#082f1e]/10 rounded-full flex items-center justify-center shadow-sm">
            <Check
              className="w-10 h-10 md:w-12 md:h-12 text-[#082f1e]"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Textos */}
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#082f1e] mb-4 md:mb-6 tracking-wide">
          Pesanan Dikonfirmasi
        </h1>
        <p className="text-stone-600 mb-8 md:mb-10 leading-relaxed text-base md:text-lg max-w-md mx-auto">
          Perjalanan gaya terbaik Anda dimulai sekarang.
        </p>

        {/* Kartu informasi */}
        <div className="w-full bg-white border border-stone-100 rounded-xl p-6 md:p-8 mb-8 md:mb-10 shadow-sm flex items-start space-x-4 text-left">
          <div className="p-2 bg-stone-50 rounded-full shrink-0">
            <Mail className="w-5 h-5 text-stone-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-[#082f1e] mb-2">
              Langkah Selanjutnya
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Kami mengirim konfirmasi beserta detail pengiriman ke email Anda.
            </p>
            <p className="text-xs text-stone-500 mt-3 font-medium">
              Cek kotak masuk Anda
            </p>
          </div>
        </div>

        {/* Status pesanan */}
        {orderStatus === "checking" && (
          <div className="w-full bg-white border border-stone-100 rounded-xl p-6 md:p-8 mb-6 shadow-sm">
            <div className="flex items-center justify-center gap-3 text-stone-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-sm">Memproses pesanan Anda...</p>
            </div>
          </div>
        )}

        {/* Pesanan belum ditemukan setelah polling (webhook bisa tertunda) */}
        {orderStatus === "not_found" && (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-6 shadow-sm">
            <p className="text-sm text-amber-800 font-medium mb-2">
              Pembayaran disetujui
            </p>
            <p className="text-sm text-amber-700 leading-relaxed">
              Kami sedang mengkonfirmasi pesanan Anda. Email konfirmasi akan segera tiba.
              Jika belum diterima dalam 24 jam, silakan hubungi kami.
            </p>
          </div>
        )}

        {/* Kesalahan saat memverifikasi pesanan */}
        {orderStatus === "error" && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 mb-6 shadow-sm">
            <p className="text-sm text-red-800 font-medium mb-2">
              Tidak dapat memverifikasi pesanan
            </p>
            <p className="text-sm text-red-700 leading-relaxed">
              Pembayaran Anda sudah disetujui. Hubungi tim kami dengan kode pembelian Anda untuk konfirmasi pesanan.
            </p>
          </div>
        )}

        {/* Aksi */}
        <div className="space-y-4 w-full max-w-sm">
          {/* Tombol lihat pesanan (saat order ditemukan) */}
          {orderStatus === "found" && (
            <Link
              href="/orders"
              className="w-full py-4 md:py-5 bg-[#082f1e] text-white hover:bg-[#082f1e]/90 transition-all duration-300 rounded-sm uppercase tracking-widest text-xs font-medium flex items-center justify-center gap-2 group"
            >
              <Package className="w-4 h-4" />
              Lihat Pesanan Saya
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          <Link
            href="/"
            className="w-full py-4 md:py-5 border border-[#082f1e] text-[#082f1e] bg-transparent hover:bg-[#082f1e] hover:text-white transition-all duration-300 rounded-sm uppercase tracking-widest text-xs font-medium flex items-center justify-center gap-2 group"
          >
            Lanjut Belanja
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Link buat akun (strategi guest checkout) */}
            <div className="pt-6 text-xs text-stone-400 max-w-sm mx-auto">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-[#082f1e] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Buat kata sandi Anda
              </Link>{" "}
              menggunakan email yang sama untuk melacak pesanan ini.
            </div>

          <div className="pt-2">
            <a
              href="https://wa.me/6285001001234"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-500 hover:text-[#082f1e] transition-colors underline underline-offset-4"
            >
              Butuh bantuan? Hubungi Tim benangbaju
            </a>
          </div>
        </div>

        {/* Session ID (debug - hanya saat development) */}
        {process.env.NODE_ENV === "development" && sessionId && (
          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-400 font-mono">
              Session ID: {sessionId.substring(0, 20)}...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 md:px-6 py-24">
          <div className="flex flex-col items-center w-full max-w-lg mx-auto">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full shimmer mb-8 md:mb-10"></div>
            <div className="h-8 md:h-10 w-64 shimmer rounded-sm mb-4 md:mb-6"></div>
            <div className="h-4 w-72 shimmer rounded-sm mb-8 md:mb-10"></div>
            <div className="w-full h-24 md:h-28 shimmer rounded-xl mb-6"></div>
            <div className="w-full max-w-sm h-14 shimmer rounded-sm mt-4"></div>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

