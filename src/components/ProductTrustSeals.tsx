"use client";

import { Shield, Lock, CreditCard, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ProductTrustSealsProps {
  className?: string;
}

const seals = [
  {
    icon: BadgeCheck,
    label: "Bahan Premium",
    desc: "Kualitas Terjamin",
    iconBg: "bg-brand-green/10",
    iconColor: "text-brand-green",
    borderColor: "hover:border-brand-green/20",
  },
  {
    icon: CreditCard,
    label: "Pembayaran Aman",
    desc: "Terverifikasi",
    iconBg: "bg-brand-gold/10",
    iconColor: "text-brand-gold/80",
    borderColor: "hover:border-brand-gold/20",
  },
  {
    icon: Shield,
    label: "Belanja Dilindungi",
    desc: "Data Terenkripsi",
    iconBg: "bg-stone-100",
    iconColor: "text-brand-softblack/50",
    borderColor: "hover:border-stone-300",
  },
  {
    icon: Lock,
    label: "Situs Terpercaya",
    desc: "Keamanan SSL",
    iconBg: "bg-stone-100",
    iconColor: "text-brand-softblack/50",
    borderColor: "hover:border-stone-300",
  },
];

export default function ProductTrustSeals({ className = "" }: ProductTrustSealsProps) {
  return (
    <div
      className={`rounded-sm border border-brand-softblack/8 bg-brand-offwhite/60 py-5 px-4 ${className}`}
      role="group"
      aria-label="Segel kepercayaan dan jaminan"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-4 h-px bg-brand-gold/40" />
        <span className="text-[8px] uppercase tracking-[0.4em] text-brand-softblack/35 font-semibold">
          Belanja dengan Percaya Diri
        </span>
        <span className="w-4 h-px bg-brand-gold/40" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {seals.map((seal, i) => (
          <motion.div
            key={seal.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className={`flex items-center gap-2.5 p-2.5 rounded-sm border border-transparent ${seal.borderColor} transition-colors duration-300 bg-white/50`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${seal.iconBg}`}
              aria-hidden
            >
              <seal.icon className={`w-4 h-4 ${seal.iconColor}`} strokeWidth={1.5} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.18em] font-semibold text-brand-softblack leading-tight">
                {seal.label}
              </p>
              <p className="text-[8px] text-brand-softblack/40 tracking-wider leading-tight mt-0.5">
                {seal.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
