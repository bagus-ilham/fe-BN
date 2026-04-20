"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCheckoutFormState } from "@/hooks/useCheckoutFormState";
import CustomerDetailsSection from "@/components/checkout/CustomerDetailsSection";
import { validateNIK } from "@/utils/validation";
import { formatPrice } from "@/utils/format";

const CHECKOUT_ADDRESS_STORAGE_KEY = "benangbaju_checkout_address";

import { 
  CheckoutFormData, 
  PaymentSummary, 
  OrderSummary, 
  CheckoutStepId as CheckoutFormStep 
} from "@/types/checkout";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  onCancel: () => void;
  initialEmail?: string;
  isLoading?: boolean;
  paymentSummary?: PaymentSummary;
  orderSummary?: OrderSummary;
  embedded?: boolean;
  submitLabel?: string;
  children?: React.ReactNode;
  onZIPChange?: (zip: string) => void;
  step?: CheckoutFormStep;
  onStepChange?: (step: CheckoutFormStep) => void;
  freightSection?: React.ReactNode;
  paymentSection?: React.ReactNode;
  onContinueFromFreight?: () => void;
  /** Abandonment capture callbacks (onBlur) */
  onEmailBlur?: (email: string) => void;
  onPhoneBlur?: (phone: string) => void;
}

// Shared input classes among all fields
const INPUT_BASE =
  "w-full bg-white/70 border rounded-sm px-3 py-3 text-brand-softblack placeholder:text-gray-400 font-light focus:outline-none transition-colors duration-200";
const INPUT_OK =
  "border-gray-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
const INPUT_ERR =
  "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200/40";

export default function CheckoutForm({
  onSubmit,
  onCancel,
  initialEmail,
  isLoading = false,
  paymentSummary,
  orderSummary,
  embedded = false,
  submitLabel,
  children,
  onZIPChange,
  step: stepProp,
  onStepChange,
  freightSection,
  paymentSection,
  onContinueFromFreight,
  onEmailBlur,
  onPhoneBlur,
}: CheckoutFormProps) {
  const isStepMode = stepProp != null;

  const formState = useCheckoutFormState({ initialEmail, onZIPChange });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Langkah detail: validasi lalu lanjut
      if (isStepMode && stepProp === "details") {
        if (formState.validateStepDetails()) {
          const cleanedZIP = formState.address.zip.replace(/\D/g, "");
          try {
            localStorage.setItem(
              CHECKOUT_ADDRESS_STORAGE_KEY,
              JSON.stringify({
                zip: cleanedZIP,
                street: formState.address.street.trim(),
                number: formState.address.number.trim(),
                complement: formState.address.complement?.trim() ?? "",
                neighborhood: formState.address.neighborhood.trim(),
                city: formState.address.city.trim(),
                state: formState.address.state.trim(),
              }),
            );
          } catch {
            /* ignore */
          }
          onStepChange?.("shipping");
        }
        return;
      }

      // Langkah pengiriman: proses dilanjutkan oleh parent
      if (isStepMode && stepProp === "shipping") {
        onContinueFromFreight?.();
        return;
      }

      // Complete mode / Payment step: validate NIK and submit
      formState.touchField("nik");
      formState.validateField("nik", formState.nik);
      const cleanedNIK = formState.nik.replace(/\D/g, "");
      if (!validateNIK(formState.nik)) {
        return;
      }

      const emailValue = (initialEmail ?? formState.email).trim().toLowerCase();
      const cleanedPhone = formState.phone.replace(/\D/g, "");
      const cleanedZIP = formState.address.zip.replace(/\D/g, "");

      onSubmit({
        fullName: formState.fullName.trim(),
        nik: cleanedNIK,
        phone: cleanedPhone,
        address: { ...formState.address, zip: cleanedZIP },
        email: emailValue,
      });
    },
    [
      isStepMode,
      stepProp,
      formState,
      initialEmail,
      onStepChange,
      onContinueFromFreight,
      onSubmit,
    ],
  );

  const showStepDetails = !isStepMode || stepProp === "details";
  const showStepShipping = isStepMode && stepProp === "shipping";
  const showStepPayment = isStepMode && stepProp === "payment";

  const formEl = (
    <form onSubmit={handleSubmit} className="p-8 md:p-12">
      {/* Judul */}
      <div className="mb-12">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-softblack/60 mb-2">
          benangbaju · CHECKOUT
        </p>
        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-widest text-brand-softblack mb-3">
          Kurasi Fashion Terbaik
        </h2>
        {paymentSummary ? (
          <p className="text-sm font-light text-brand-softblack/80 leading-relaxed mb-2">
            Cicilan{" "}
            <strong className="font-medium text-brand-green">
              {paymentSummary.installments}x {formatPrice(paymentSummary.installmentAmount)} tanpa bunga
            </strong>{" "}
            (total {formatPrice(paymentSummary.total)}).
          </p>
        ) : null}
        {orderSummary ? (
          <div className="mb-4 p-4 bg-gray-50/80 rounded-sm border border-gray-100">
            <p className="text-[10px] uppercase tracking-widest text-brand-softblack/60 mb-2">
              Ringkasan Pesanan
            </p>
            <div className="space-y-1 text-sm font-light text-brand-softblack">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>
                  {orderSummary.freeShipping ? (
                    <span className="text-brand-green">Gratis</span>
                  ) : (
                    <>{formatPrice(orderSummary.shipping)}</>
                  )}
                </span>
              </div>
              {orderSummary.discount != null && orderSummary.discount > 0 && (
                <div className="flex justify-between text-brand-green">
                  <span>Diskon 5% (Transfer)</span>
                  <span>- {formatPrice(orderSummary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                <span>Total</span>
                <span>{formatPrice(orderSummary.total)}</span>
              </div>
            </div>
          </div>
        ) : null}
        <p className="text-sm font-light text-brand-softblack/60 leading-relaxed">
          Lengkapi rincian pengiriman di bawah ini.
        </p>
      </div>

      <div className="space-y-10">
        {/* Langkah detail */}
        {showStepDetails && (
          <CustomerDetailsSection
            email={formState.email}
            fullName={formState.fullName}
            phone={formState.phone}
            address={formState.address}
            initialEmail={initialEmail}
            isLoadingZIP={formState.isLoadingZIP}
            errors={formState.errors}
            touched={formState.touched}
            setEmail={formState.setEmail}
            setFullName={formState.setFullName}
            handlePhoneChange={formState.handlePhoneChange}
            handleZIPChange={formState.handleZIPChange}
            handleZIPBlur={formState.handleZIPBlur}
            validateField={formState.validateField}
            touchField={formState.touchField}
            updateAddressField={formState.updateAddressField}
            setAddress={formState.setAddress}
            inputBase={INPUT_BASE}
            inputOk={INPUT_OK}
            inputErr={INPUT_ERR}
            onEmailBlur={onEmailBlur}
            onPhoneBlur={onPhoneBlur}
          />
        )}

        {/* Langkah pengiriman */}
        {showStepShipping && freightSection}

        {/* Payment Step */}
        {showStepPayment && (
          <>
            {/* Tax ID for invoicing */}
            <div className="p-5 md:p-6 border border-gray-100 bg-white rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-softblack/70 mb-1">
                Informasi Pajak
              </p>
              <p className="text-[11px] text-brand-softblack/50 mb-6">
                NIK Anda diperlukan untuk keperluan faktur pengiriman.
              </p>
              <div>
                <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.nik}
                  onChange={(e) => formState.handleNIKChange(e.target.value)}
                  onBlur={() => {
                    formState.touchField("nik");
                    formState.validateField("nik", formState.nik);
                  }}
                  placeholder="16 digit NIK"
                  maxLength={19}
                  className={`${INPUT_BASE} ${formState.errors.nik ? INPUT_ERR : INPUT_OK}`}
                />
                {formState.errors.nik && (
                  <p className="text-[10px] text-red-500 mt-2">
                    {formState.errors.nik}
                  </p>
                )}
              </div>
            </div>

            {paymentSection}
          </>
        )}

        {/* Single list mode (no steps) */}
        {!isStepMode && children}

        {/* Actions */}
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-3 md:justify-between pt-2">
          <button
            type="button"
            onClick={
              isStepMode && stepProp === "shipping"
                ? () => onStepChange?.("details")
                : isStepMode && stepProp === "payment"
                  ? () => onStepChange?.("shipping")
                  : onCancel
            }
            className="w-full md:w-auto px-5 py-3 border border-gray-200 rounded-sm text-brand-softblack/80 text-[11px] uppercase tracking-widest hover:border-brand-green/40 hover:text-brand-softblack transition-colors"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-brand-green text-white rounded-sm text-[11px] uppercase tracking-widest hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading
              ? "Memproses..."
              : isStepMode && stepProp === "details"
                ? "Lanjut ke Pengiriman"
                : isStepMode && stepProp === "shipping"
                  ? "Lanjut ke Pembayaran"
                  : (submitLabel ?? "Lanjutkan")}
          </button>
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return <div className="w-full">{formEl}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/55 backdrop-blur-sm z-80 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/95 rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-softblack transition-colors duration-300 z-10"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 min-h-0 overflow-y-auto">{formEl}</div>
      </motion.div>
    </motion.div>
  );
}

