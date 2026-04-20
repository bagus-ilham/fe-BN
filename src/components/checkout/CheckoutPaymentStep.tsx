"use client";

import { useEffect, useState } from "react";
import type { CheckoutPaymentPayload } from "@/types/checkout";

export interface CheckoutPaymentStepProps {
  payload: CheckoutPaymentPayload;
  onSuccess: (id: string) => void;
  onError: (message: string) => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: MidtransSnapOptions) => void;
    };
  }
}

type MidtransSnapResult = Record<string, unknown>;

type MidtransSnapOptions = {
  onSuccess?: (result: MidtransSnapResult) => void;
  onPending?: (result: MidtransSnapResult) => void;
  onError?: (result: MidtransSnapResult) => void;
  onClose?: () => void;
};

export default function CheckoutPaymentStep({
  payload,
  onSuccess,
  onError,
}: CheckoutPaymentStepProps) {
  const [snapTriggered] = useState(true);

  useEffect(() => {
    if (window.snap) {
      window.snap.pay(payload.snapToken, {
        onSuccess: function (result) {
          console.log("Midtrans berhasil:", result);
          onSuccess(payload.orderId);
        },
        onPending: function (result) {
          console.log("Midtrans menunggu:", result);
          onSuccess(payload.orderId); // Treat pending as success to show confirmation page
        },
        onError: function (result) {
          console.error("Kesalahan Midtrans:", result);
          onError("Gagal memproses pembayaran. Silakan coba lagi.");
        },
        onClose: function () {
          console.warn("Pengguna menutup jendela Snap");
          onError("Pembayaran dibatalkan. Silakan selesaikan pembayaran untuk memproses pesanan.");
        },
      });
    } else {
      onError("Library Midtrans Snap belum termuat. Silakan muat ulang halaman.");
    }
  }, [payload, onSuccess, onError, snapTriggered]);

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-light uppercase tracking-widest text-brand-softblack">
          Menunggu Pembayaran
        </p>
        <p className="text-xs text-brand-softblack/60 mt-2">
          Halaman checkout Midtrans akan muncul secara otomatis.
        </p>
      </div>

      <div className="p-4 border border-gray-100 rounded-sm bg-gray-50/70 text-center">
        <p className="text-[11px] text-brand-softblack/70 leading-relaxed mb-4">
          Jika jendela pembayaran tidak terbuka, Anda dapat mengklik tombol di bawah ini.
        </p>
        <button
          onClick={() => {
            if (window.snap) {
              window.snap.pay(payload.snapToken, {
                onSuccess: () => onSuccess(payload.orderId),
                onPending: () => onSuccess(payload.orderId),
                onError: () => onError("Pembayaran gagal."),
                onClose: () => onError("Pembayaran dibatalkan."),
              });
            }
          }}
          className="px-6 py-2.5 bg-brand-green text-white text-[10px] uppercase tracking-widest font-medium rounded-sm hover:bg-brand-green/90 transition-colors"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
