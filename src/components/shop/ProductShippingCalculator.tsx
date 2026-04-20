"use client";

import { useState, useCallback, useEffect } from "react";
import type { ShippingQuoteOption } from "@/types/checkout";
import { formatPrice } from "@/utils/format";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface ProductShippingCalculatorProps {
  productId: string;
  productPrice: number;
  /** Untuk kit: IDs produk yang menyusun kit */
  isKit?: boolean;
  kitProducts?: string[];
  className?: string;
}

export function ProductShippingCalculator({
  productId,
  productPrice,
  isKit = false,
  kitProducts,
  className = "",
}: ProductShippingCalculatorProps) {
  const { settings } = useSiteSettings();
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<ShippingQuoteOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const zipDigits = zip.replace(/\D/g, "");
  const isFreeByThreshold = productPrice >= settings.freeShippingThreshold;

  const fetchQuote = useCallback(async () => {
    if (zipDigits.length !== 5) return;

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const res = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode: zipDigits,
          cartItems: [
            {
              id: productId,
              quantity: 1,
              price: productPrice,
              isKit: isKit ?? false,
              ...(isKit && kitProducts && { kitProducts }),
            },
          ],
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "Gagal menghitung ongkos kirim.");
        return;
      }

      const options = data?.quotes ?? [];
      const cheapest =
        Array.isArray(options) && options.length > 0
          ? options.reduce(
              (min: ShippingQuoteOption, q: ShippingQuoteOption) =>
                q.price < min.price ? q : min,
            )
          : null;
      setQuote(cheapest);
      setError(null);
    } catch {
      setError("Terjadi kesalahan saat mengecek ongkir.");
    } finally {
      setLoading(false);
    }
  }, [zipDigits, productId, productPrice, isKit, kitProducts]);

  useEffect(() => {
    if (zipDigits.length === 5) {
      void fetchQuote();
    } else {
      setQuote(null);
      setError(null);
    }
  }, [zipDigits, fetchQuote]);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZip(v);
  };

  const handleZipBlur = () => {
    if (zipDigits.length === 5) void fetchQuote();
  };

  return (
    <div className={`space-y-3 p-4 bg-brand-offwhite/50 border border-stone-100 rounded-sm ${className}`}>
      <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack/70">
        Estimasi Ongkos Kirim
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Kode Pos (5 digit)"
          value={zip}
          onChange={handleZipChange}
          onBlur={handleZipBlur}
          maxLength={5}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-stone-200 rounded-sm bg-white text-brand-softblack placeholder:text-brand-softblack/30 focus:outline-none focus:border-brand-green/40 transition-colors"
          aria-label="Kode Pos untuk kalkulasi pengiriman"
        />
        <button
          type="button"
          onClick={() => void fetchQuote()}
          disabled={zipDigits.length !== 5 || loading}
          className="shrink-0 px-5 py-2 text-[10px] font-medium uppercase tracking-widest bg-brand-softblack text-white rounded-sm hover:bg-brand-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Cek"}
        </button>
      </div>

      <p className="text-[11px] text-brand-softblack/70 leading-relaxed">
        <span className="font-semibold text-brand-green underline decoration-brand-green/30 underline-offset-2 italic">Gratis Ongkir</span>{" "}
        untuk pembelian pertama dengan kupon <span className="font-bold text-brand-softblack">{settings.primaryPromoCode}</span>.
      </p>

      {/* Hasil Kalkulasi */}
      {loading && zipDigits.length === 5 && (
        <p className="text-[11px] text-brand-softblack/60 flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full border-2 border-brand-green/30 border-t-brand-green animate-spin"
            aria-hidden
          />
          Mencari opsi terbaik...
        </p>
      )}

      {error && !loading && (
        <p className="text-[11px] text-amber-700 italic">{error}</p>
      )}

      {quote && !loading && !error && (
        <div className="pt-2 border-t border-stone-100 mt-2">
          {isFreeByThreshold ? (
            <p className="text-[11px] font-medium text-brand-green">
              Gratis Ongkir — Belanja di atas {formatPrice(settings.freeShippingThreshold)}
            </p>
          ) : (
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] text-brand-softblack/80">
                Estimasi biaya kirim: <span className="font-semibold text-brand-softblack">{formatPrice(quote.price)}</span>
              </p>
              {quote.deliveryRange && quote.deliveryRange.max > 0 && (
                <p className="text-[10px] text-brand-softblack/50 italic">
                  Estimasi tiba: {quote.deliveryRange.min} - {quote.deliveryRange.max} hari kerja
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

