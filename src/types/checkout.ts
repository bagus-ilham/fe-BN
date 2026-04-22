/**
 * Types for benangbaju — Midtrans as unique gateway.
 */

/** Payload untuk langkah pembayaran - Midtrans Snap */
export type CheckoutPaymentPayload = {
  provider: "midtrans";
  orderId: string;
  snapToken: string;
  snapRedirectUrl: string;
};

/** Data formulir checkout (pengiriman + identitas) */
export interface CheckoutFormData {
  fullName: string;
  nik: string;
  phone: string;
  address: {
    zip: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  email: string;
}

/** Payment summary to display in the form (e.g. installments) */
export interface PaymentSummary {
  installments: 2 | 3;
  total: number;
  installmentAmount: number;
}

/** Ringkasan pesanan: subtotal, ongkir, dan total */
export interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
  /** Discount in IDR (e.g. 5% transfer) */
  discount?: number;
}

/** Steps for the checkout process */
export type CheckoutStepId = "details" | "shipping" | "payment";

/** View state for the checkout page */
export type CheckoutView = "form" | "payment";

/** Midtrans menangani cicilan melalui UI Snap miliknya */
export type InstallmentOption = "1x" | "2x" | "3x";

/** Metode pembayaran yang dipilih pengguna sebelum redirect ke gateway */
export type PaymentMethod = "midtrans" | "qris" | "card";

/** Opsi pengiriman dari API */
export interface ShippingQuoteOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: number;
  deliveryRange?: { min: number; max: number };
  company?: { id: number; name: string };
  type: string; // standard, express, local
}

