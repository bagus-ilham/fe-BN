/**
 * Types for benangbaju — Midtrans as unique gateway.
 */

/** Item keranjang yang dikirim ke API checkout */
export interface CheckoutCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  kitProducts?: string[];
  isKit?: boolean;
}

/** Payload untuk langkah pembayaran - Midtrans Snap */
export type CheckoutPaymentPayload = {
  provider: "midtrans";
  orderId: string;
  snapToken: string;
  snapRedirectUrl: string;
};

/** Data formulir checkout (pengiriman + identitas) */
export interface CheckoutFormData {
  email: string;
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
}

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

