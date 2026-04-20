"use client";

import Link from "next/link";
import { Shield, Lock, CreditCard, BadgeCheck, RotateCcw } from "lucide-react";

interface SecurityBadgesProps {
  /** Layout: horizontal (footer), compact (checkout) or checkout-full (with ANVISA and guarantee) */
  variant?: "horizontal" | "compact" | "checkout-full";
  /** Theme: dark (footer) or light (checkout) */
  theme?: "dark" | "light";
  className?: string;
}

const BADGES = [
  {
    icon: Lock,
    label: "Situs Aman",
    sublabel: "Enkripsi SSL",
  },
  {
    icon: Shield,
    label: "Pembelian Terlindungi",
    sublabel: "Data Terjaga",
  },
  {
    icon: CreditCard,
    label: "Pembayaran Aman",
    sublabel: "Sertifikasi Midtrans",
  },
] as const;

export default function SecurityBadges({
  variant = "horizontal",
  theme = "light",
  className = "",
}: SecurityBadgesProps) {
  const isDark = theme === "dark";
  const textClass = isDark ? "text-brand-offwhite/90" : "text-brand-softblack/80";
  const subtextClass = isDark ? "text-brand-offwhite/60" : "text-brand-softblack/60";
  const iconClass = isDark ? "text-brand-gold/80" : "text-brand-green/80";

  if (variant === "compact") {
    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-4 md:gap-6 ${className}`}
      >
        {BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2"
            title={label}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${iconClass}`}
              strokeWidth={1.5}
              aria-hidden
            />
            <span className={`text-[10px] uppercase tracking-[0.15em] font-light ${textClass}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "checkout-full") {
    return (
      <div
        className={`rounded-sm border border-brand-softblack/10 bg-white/80 py-6 px-6 ${className}`}
        role="group"
        aria-label="Lencana kepercayaan dan jaminan"
      >
        <p className="text-[10px] uppercase tracking-[0.25em] font-medium text-brand-softblack/70 text-center mb-5">
          Pembelian Anda 100% Aman
        </p>
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-x-4 gap-y-5 md:gap-x-8 md:gap-y-5 items-start md:items-center">
          {/* Quality Guarantee */}
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/15">
              <BadgeCheck
                className="w-5 h-5 text-brand-green"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack">
                Kualitas Premium
              </p>
              <p className="text-[9px] uppercase tracking-wider text-brand-softblack/70">
                QC Sangat Ketat
              </p>
            </div>
          </div>
          {BADGES.map(({ icon: Icon, label, sublabel }) => (
            <div key={label} className="flex items-start gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/15">
                <Icon
                  className="w-5 h-5 text-brand-green"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack">
                  {label}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-brand-softblack/70">
                  {sublabel}
                </p>
              </div>
            </div>
          ))}
          {/* Return guarantee */}
          <Link
            href="/returns"
            className="flex items-start gap-3 min-w-0 group"
            aria-label="Kebijakan pengembalian: 7 hari untuk pengembalian"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/15 group-hover:bg-brand-green/25 transition-colors">
              <RotateCcw
                className="w-5 h-5 text-brand-green"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-brand-softblack group-hover:text-brand-green transition-colors">
                7 Hari Pengembalian
              </p>
              <p className="text-[9px] uppercase tracking-wider text-brand-softblack/70">
                Sesuai UU Perlindungan Konsumen
              </p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 md:gap-8 ${className}`}
    >
      {BADGES.map(({ icon: Icon, label, sublabel }) => (
        <div
          key={label}
          className="flex items-center gap-3"
          title={`${label} — ${sublabel}`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isDark ? "bg-brand-offwhite/10" : "bg-brand-green/10"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${iconClass}`}
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
          <div>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-medium ${textClass}`}>
              {label}
            </p>
            <p className={`text-[9px] uppercase tracking-wider ${subtextClass}`}>
              {sublabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
