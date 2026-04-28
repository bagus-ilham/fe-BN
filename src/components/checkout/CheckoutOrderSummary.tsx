"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  FREE_SHIPPING_THRESHOLD,
  PAYMENT_DISCOUNT_PERCENT,
  MAX_INSTALLMENTS,
  COUPON_CODE_BENANG10,
  COUPON_BENANG10_DISCOUNT_PERCENT,
} from "@/lib/checkout-config";
import type { PaymentMethod, InstallmentOption } from "@/types/checkout";
import { formatPrice } from "@/utils/format";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface CheckoutOrderSummaryProps {
  paymentMethod: PaymentMethod | null;
  installmentOption?: InstallmentOption | null;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
  onInstallmentChange?: (option: InstallmentOption) => void;
  /** Jika true, tampilkan selector metode pembayaran; jika false, hanya tampilkan total */
  showPaymentSelector?: boolean;
  /** Biaya pengiriman (IDR). */
  shippingReais?: number;
  /** Jika true, tampilkan teks "Gratis" di baris ongkos kirim */
  isFreeShipping?: boolean;
  /** Kode kupon yang digunakan (contoh: BENANG10). */
  couponCode?: string;
  className?: string;
}

export default function CheckoutOrderSummary({
  paymentMethod,
  installmentOption,
  onPaymentMethodChange,
  onInstallmentChange,
  showPaymentSelector = true,
  shippingReais: shippingProp,
  isFreeShipping: isFreeShippingProp,
  couponCode,
  className = "",
}: CheckoutOrderSummaryProps) {
  const { cart, totalPrice } = useCart();
  const { settings } = useSiteSettings();
  const waNumber = settings.contactInfo.whatsapp || "6285001001234";
  
  const isFreeShipping =
    isFreeShippingProp ?? totalPrice >= FREE_SHIPPING_THRESHOLD;
  
  const shippingReais =
    shippingProp ?? (isFreeShipping ? 0 : 0);
    
  const subtotalWithShipping = totalPrice + shippingReais;
  
  const transferDiscount =
    paymentMethod === "qris" ? totalPrice * PAYMENT_DISCOUNT_PERCENT : 0;
    
  const couponDiscount =
    couponCode?.trim().toUpperCase() === COUPON_CODE_BENANG10
      ? totalPrice * COUPON_BENANG10_DISCOUNT_PERCENT
      : 0;
      
  const totalInIDR = subtotalWithShipping - transferDiscount - couponDiscount;

  return (
    <div
      className={`bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-softblack/60 mb-1">
          Ringkasan Pesanan
        </h2>
        <p className="text-sm font-light text-brand-softblack">
          {cart.length} {cart.length === 1 ? "produk" : "produk"}
        </p>
      </div>

      <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.id + (item.isKit ? "kit" : "")}
            className="flex gap-3 text-sm items-center"
          >
            <div className="relative w-14 h-14 shrink-0 rounded-sm overflow-hidden bg-gray-100 border border-gray-100">
              <Image
                src={item.image_url ?? "/images/products/glow.jpeg"}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-brand-softblack/80 font-light line-clamp-2">
                {item.name} × {item.quantity}
              </p>
               <p className="font-medium text-brand-softblack mt-0.5">
                {formatPrice(item.base_price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-100 space-y-2">
        <div className="flex justify-between text-sm font-light text-brand-softblack">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm font-light text-brand-softblack">
          <span>Ongkos Kirim</span>
          <span>
            {isFreeShipping ? (
              <span className="text-brand-green">Gratis</span>
            ) : (
              <>{formatPrice(shippingReais)}</>
            )}
          </span>
        </div>
        {paymentMethod === "qris" && transferDiscount > 0 && (
          <div className="flex justify-between text-sm text-brand-green font-light">
            <span>Diskon 5% (Transfer/QRIS)</span>
            <span>- {formatPrice(transferDiscount)}</span>
          </div>
        )}
        {couponCode?.trim().toUpperCase() === COUPON_CODE_BENANG10 && (
          <div className="flex justify-between text-sm text-brand-green font-light">
            <span>Kupon BENANG10</span>
            {couponDiscount > 0 ? (
              <span>- {formatPrice(couponDiscount)}</span>
            ) : (
              <span>berhasil dipakai</span>
            )}
          </div>
        )}
        <div className="flex justify-between pt-3 border-t border-gray-200 font-medium text-brand-softblack">
          <span>Total</span>
          <span className="text-lg font-semibold">
            {(transferDiscount > 0 || couponDiscount > 0) ? (
              <>
                <span className="line-through text-brand-softblack/50 text-sm font-normal mr-2">
                  {formatPrice(subtotalWithShipping)}
                </span>
                {formatPrice(totalInIDR)}
              </>
            ) : (
              <>{formatPrice(totalInIDR)}</>
            )}
          </span>
        </div>
        <p className="pt-3 text-[10px] uppercase tracking-wider text-brand-softblack/60 text-center font-light">
          Ada pertanyaan?{" "}
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo benangbaju, saya ingin bertanya tentang pesanan saya.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-green hover:text-brand-softblack transition-colors"
          >
            Hubungi Admin
          </a>
        </p>
      </div>

      {showPaymentSelector && (
        <div className="p-6 border-t border-gray-100 space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-softblack/60">
            Metode Pembayaran
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onPaymentMethodChange?.("qris")}
              className={`flex flex-col items-center justify-center p-4 rounded-sm border-2 transition-all duration-200 ${
                paymentMethod === "qris"
                  ? "border-brand-green bg-brand-green/5 text-brand-green"
                  : "border-gray-200 hover:border-brand-green/40 text-brand-softblack/70"
              }`}
              aria-pressed={paymentMethod === "qris"}
              aria-label="Bayar via Transfer / QRIS"
            >
              <div className="w-8 h-8 mb-2 flex items-center justify-center bg-brand-green/10 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  aria-hidden
                >
                  <path d="M4 4h7v7H4V4zm2 2v3h3V6H6zm2 2h1V7H8v1zm10-4h2v2h-2V4zM4 13h7v7H4v-7zm2 2v3h3v-3H6zm2 2h1v-1H8v1zm5-4h2v2h-2v-2zm2 2h2v2h-2v-2zm2 -2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 -2h2v2h-2v-2zm5 -11h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">
                QRIS / Transfer
              </span>
              <span className="text-[10px] text-brand-softblack/60 mt-0.5">
                Diskon 5%
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPaymentMethodChange?.("card")}
              className={`flex flex-col items-center justify-center p-4 rounded-sm border-2 transition-all duration-200 ${
                paymentMethod === "card"
                  ? "border-brand-green bg-brand-green/5 text-brand-green"
                  : "border-gray-200 hover:border-brand-green/40 text-brand-softblack/70"
              }`}
              aria-pressed={paymentMethod === "card"}
              aria-label="Bayar via Kartu Kredit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-8 h-8 mb-2"
                fill="currentColor"
                aria-hidden
              >
                <path d="M32 376a56 56 0 0 0 56 56h336a56 56 0 0 0 56-56V222H32Zm66-76a30 30 0 0 1 30-30h48a30 30 0 0 1 30 30v20a30 30 0 0 1-30 30h-48a30 30 0 0 1-30-30ZM424 80H88a56 56 0 0 0-56 56v26h448v-26a56 56 0 0 0-56-56Z" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider">
                Kartu Kredit
              </span>
              <span className="text-[10px] text-brand-softblack/60 mt-0.5">
                Cicilan s/d {MAX_INSTALLMENTS}x
              </span>
            </button>
          </div>

          {paymentMethod === "card" && (
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-wider text-brand-softblack/60 mb-2 font-light">
                Pilih Cicilan
              </p>
              <div className="flex gap-2">
                {(["1x", "2x", "3x"] as const).map((opt) => {
                  const installmentsCount = parseInt(opt);
                  const amount = Math.round(totalInIDR / installmentsCount);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onInstallmentChange?.(opt)}
                      className={`flex-1 py-2.5 rounded-sm border text-xs font-light transition-all ${
                        installmentOption === opt
                          ? "border-brand-green bg-brand-green/5 text-brand-green font-medium"
                          : "border-gray-200 hover:border-brand-green/40 text-brand-softblack/70"
                      }`}
                      aria-pressed={installmentOption === opt}
                    >
                      {opt === "1x" ? "Bayar Penuh" : opt}
                      {opt !== "1x" && (
                        <span className="block text-[10px] opacity-80 mt-0.5">
                          {formatPrice(amount)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

