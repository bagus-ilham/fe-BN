"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutPaymentStep from "@/components/checkout/CheckoutPaymentStep";
import ShippingQuoteSelector from "@/components/checkout/ShippingQuoteSelector";
import SecurityBadges from "@/components/SecurityBadges";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { trackBeginCheckout } from "@/lib/analytics";
import { fbTrackInitiateCheckout } from "@/lib/meta-pixel";
import type { 
  PaymentMethod, 
  CheckoutPaymentPayload,
  ShippingQuoteOption,
  CheckoutView,
  CheckoutStepId,
  CheckoutFormData
} from "@/types/checkout";

const CHECKOUT_BG = "#F9F7F2";
const CHECKOUT_INK = "#1B2B22";

export default function CheckoutPage() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const { cart, totalPrice, showToast } = useCart();
  const { user } = useAuth();
  const viewRef = useRef<CheckoutView>("form");

  const [paymentMethod] = useState<PaymentMethod | null>(
    "midtrans",
  );
  const [view, setView] = useState<CheckoutView>("form");
  const [paymentPayload, setPaymentPayload] =
    useState<CheckoutPaymentPayload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutZip, setCheckoutZip] = useState("");
  const [selectedShippingQuote, setSelectedShippingQuote] =
    useState<ShippingQuoteOption | null>(null);
  const [activeStep, setActiveStep] = useState<CheckoutStepId>("details");
  const [couponCode, setCouponCode] = useState("");
  const [couponExpanded, setCouponExpanded] = useState(false);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const isFreeShipping = totalPrice >= settings.freeShippingThreshold;
  const isSoubenangbajuApplied =
    couponCode.trim().toUpperCase() === settings.primaryPromoCode;

  const displayShippingIDR =
    isFreeShipping || isSoubenangbajuApplied
      ? 0
      : selectedShippingQuote?.price ?? 0;

  const apiShippingIDR =
    isFreeShipping ? 0 : selectedShippingQuote?.price ?? 0;

  const snapUrl =
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  useEffect(() => {
    if (cart.length === 0) return;
    trackBeginCheckout({
      value: totalPrice,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        category: i.isKit ? "Kit" : "Product",
      })),
      coupon: null,
    });
    fbTrackInitiateCheckout({
      value: totalPrice,
      numItems: cart.reduce((acc, i) => acc + i.quantity, 0),
      contentIds: cart.map((i) => i.id),
    });
  }, [cart, totalPrice]);

  const handleContinueFromFreight = useCallback(() => {
    const hasValidShipping =
      isFreeShipping ||
      (selectedShippingQuote &&
        (apiShippingIDR >= 0 || selectedShippingQuote.type === "local"));
    if (!hasValidShipping) {
      showToast(
        "Masukkan kode pos dan pilih layanan pengiriman untuk melanjutkan.",
      );
      return;
    }
    setActiveStep("payment");
  }, [isFreeShipping, selectedShippingQuote, apiShippingIDR, showToast]);

  const freightSectionMemo = useMemo(
    () => (
      <div className="space-y-6">
        <div
          className="py-6 border-t border-[0.5px] px-6 md:px-8"
          style={{ borderColor: "rgba(27,43,34,0.1)" }}
        >
          <ShippingQuoteSelector
            postalCode={checkoutZip}
            selectedQuote={selectedShippingQuote}
            onSelect={setSelectedShippingQuote}
          />
        </div>
        <div
          className="py-4 border-t border-[0.5px] px-6 md:px-8"
          style={{ borderColor: "rgba(27,43,34,0.1)" }}
        >
          <button
            type="button"
            onClick={() => setCouponExpanded((p) => !p)}
            className="text-[10px] uppercase tracking-[0.2em] opacity-75 hover:opacity-90 transition-opacity"
            aria-expanded={couponExpanded}
          >
            {couponExpanded ? "Sembunyikan kupon" : "Punya kode kupon?"}
          </button>
          {couponExpanded && (
            <div className="mt-3 space-y-1.5">
              <input
                id="checkout-coupon"
                type="text"
                placeholder={`${settings.primaryPromoCode} — diskon member baru`}
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(e.target.value.trim().toUpperCase())
                }
                className="w-full bg-white/70 border border-gray-200 rounded-sm px-3 py-2.5 text-sm font-light text-brand-softblack placeholder:text-gray-400 focus:outline-none focus:border-brand-green"
                style={{ color: CHECKOUT_INK }}
                aria-label="Kupon diskon"
              />
            </div>
          )}
        </div>
      </div>
    ),
    [checkoutZip, selectedShippingQuote, couponExpanded, couponCode, settings.primaryPromoCode],
  );

  const paymentSectionMemo = useMemo(
    () => (
      <div
        className="py-6 border-t border-[0.5px] px-6 md:px-8"
        style={{ borderColor: "rgba(27,43,34,0.1)" }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-75 mb-4">
          Metode Pembayaran
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 py-4 px-5 rounded-sm border-[0.5px] text-left transition-all duration-200 border-[#1B2B22] bg-[#1B2B22]/6"
            style={{ color: CHECKOUT_INK }}
          >
            <span className="block text-xs font-medium uppercase tracking-wider mb-0.5">
              Midtrans (QRIS, VA, Kartu Debit/Kredit)
            </span>
            <span className="text-[11px] opacity-80">Pembayaran Aman & Terpercaya</span>
          </button>
        </div>
      </div>
    ),
    [],
  );

  const handleFormSubmit = useCallback(
    async (data: CheckoutFormData) => {
      const addr = data.address;
      const fullName = data.fullName?.trim();
      const emailVal = (data.email ?? "").trim();
      
      const hasValidShipping =
        isFreeShipping ||
        (selectedShippingQuote && (apiShippingIDR >= 0 || selectedShippingQuote.type === "local"));
      
      if (!hasValidShipping) {
        showToast("Masukkan kode pos dan pilih layanan pengiriman.");
        return;
      }

      const items = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      setIsSubmitting(true);
      /*
      try {
        const result = await checkoutAction({
          form: {
            email: emailVal,
            fullName,
            nik: data.nik,
            phone: data.phone,
            address: {
              zip: addr.zip.trim(),
              street: addr.street.trim(),
              number: addr.number.trim(),
              complement: addr.complement?.trim(),
              neighborhood: addr.neighborhood.trim(),
              city: addr.city.trim(),
              state: addr.state.trim(),
            },
          },
          items,
          paymentMethod: "midtrans",
          userId: user?.id ?? null,
          shippingAmount: apiShippingIDR,
          selectedShippingOption: selectedShippingQuote
            ? { id: selectedShippingQuote.id, name: selectedShippingQuote.name, type: selectedShippingQuote.type }
            : null,
        });

        if (!result.success) {
          showToast(result.error, "error");
          return;
        }

        setPaymentPayload({
          provider: "midtrans",
          orderId: result.data.orderId,
          snapToken: result.data.snapToken,
          snapRedirectUrl: result.data.snapRedirectUrl,
        });
        setView("payment");
      } catch (e) {
        console.error(e);
        showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
      } finally {
        setIsSubmitting(false);
      }
      */
      
      // Simulação de Checkout bem-sucedido (Mockup Mode)
      setTimeout(() => {
        setPaymentPayload({
          provider: "midtrans",
          orderId: `mock-order-${Date.now()}`,
          snapToken: "mock-snap-token",
          snapRedirectUrl: "#mock-payment",
        });
        setView("payment");
        setIsSubmitting(false);
        showToast("Mock: Pesanan berhasil dibuat! Melanjutkan ke pembayaran.");
      }, 1500);
    },
    [cart, isFreeShipping, selectedShippingQuote, apiShippingIDR, showToast],
  );

  const handlePaymentSuccess = useCallback(
    (orderId: string) => {
      router.push(`/checkout/success?order_id=${encodeURIComponent(orderId)}`);
    },
    [router],
  );

  const handlePaymentError = useCallback(
    (message: string) => {
      showToast(message, "error");
    },
    [showToast],
  );

  if (cart.length === 0 && view === "form") {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
        style={{ backgroundColor: CHECKOUT_BG, color: CHECKOUT_INK }}
      >
        <p className="text-sm font-light tracking-wide opacity-80 mb-6">
          Keranjang belanja Anda kosong.
        </p>
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.2em] border-[0.5px] px-6 py-3 transition-colors hover:opacity-80"
          style={{ borderColor: CHECKOUT_INK, color: CHECKOUT_INK }}
        >
          Lanjut Belanja
        </Link>
      </div>
    );
  }

  const currentStep: CheckoutStepId =
    view !== "form" ? "payment" : activeStep;

  return (
    <div
      className="min-h-screen py-10 md:py-14 px-4 sm:px-6"
      style={{ backgroundColor: CHECKOUT_BG, color: CHECKOUT_INK }}
    >
      <Script
        src={snapUrl}
        data-client-key={clientKey}
        strategy="lazyOnload"
      />

      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <SecurityBadges variant="checkout-full" theme="light" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-4 lg:order-1 order-1">
            <div className="lg:sticky lg:top-8">
              <CheckoutOrderSummary
                paymentMethod={paymentMethod}
                showPaymentSelector={false}
                shippingReais={displayShippingIDR}
                isFreeShipping={isFreeShipping || isSoubenangbajuApplied}
                couponCode={couponCode}
                className="rounded-sm shadow-sm border-[0.5px] border-[#1B2B22]/10"
              />
            </div>
          </div>

          <div className="lg:col-span-8 lg:order-2 order-2">
            <CheckoutSteps
              currentStep={currentStep}
              theme="light"
              onStepClick={setActiveStep}
            />
            {view === "form" ? (
              <div
                className="rounded-sm overflow-hidden border-[0.5px] bg-white/90 shadow-sm"
                style={{ borderColor: "rgba(27,43,34,0.12)" }}
              >
                <CheckoutForm
                  embedded
                  onSubmit={handleFormSubmit}
                  onCancel={() => router.push("/")}
                  initialEmail={user?.email ?? undefined}
                  isLoading={isSubmitting}
                  submitLabel="Lanjut ke Pembayaran"
                  onZIPChange={setCheckoutZip}
                  step={activeStep}
                  onStepChange={setActiveStep}
                  onContinueFromFreight={handleContinueFromFreight}
                  freightSection={freightSectionMemo}
                  paymentSection={paymentSectionMemo}
                />
              </div>
            ) : (
              <div
                className="rounded-sm border-[0.5px] bg-white/90 p-8"
                style={{ borderColor: "rgba(27,43,34,0.12)" }}
              >
                <CheckoutPaymentStep
                  payload={paymentPayload!}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

