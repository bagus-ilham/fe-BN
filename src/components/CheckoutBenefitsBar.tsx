"use client";

import { motion } from "framer-motion";
import { Truck, Tag, CreditCard, Shield } from "lucide-react";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import { formatPrice } from "@/utils/format";

const CheckoutBenefitsBar = () => {
  const { settings } = useSiteSettings();

  const benefits = [
    {
      icon: Truck,
      label: "Gratis Ongkir",
      desc: `mulai ${formatPrice(settings.freeShippingThreshold)}`,
      accent: "from-brand-green/15 to-brand-green/5",
      iconBg: "bg-brand-green/10 group-hover:bg-brand-green/20",
      iconColor: "text-brand-green",
    },
    {
      icon: Tag,
      label: "Promo Spesial",
      desc: `kode: ${settings.primaryPromoCode}`,
      accent: "from-brand-gold/15 to-brand-gold/5",
      iconBg: "bg-brand-gold/10 group-hover:bg-brand-gold/20",
      iconColor: "text-brand-gold",
    },
    {
      icon: CreditCard,
      label: "Cicilan 3x",
      desc: "tanpa bunga",
      accent: "from-brand-softblack/8 to-brand-softblack/3",
      iconBg: "bg-brand-softblack/8 group-hover:bg-brand-softblack/15",
      iconColor: "text-brand-softblack/70",
    },
    {
      icon: Shield,
      label: "Garansi Produk",
      desc: "kualitas terjamin",
      accent: "from-stone-200/50 to-stone-100/20",
      iconBg: "bg-stone-100 group-hover:bg-stone-200/70",
      iconColor: "text-brand-softblack/60",
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {benefits.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className={`group relative flex items-center gap-3 px-4 py-4 rounded-sm border border-brand-softblack/6 bg-gradient-to-br ${b.accent} overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-softblack/10`}
        >
          {/* Sheen sweep */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full"
            style={{ transition: "opacity 0.3s, transform 0.7s" }}
          />

          {/* Icon — diperbesar */}
          <span className={`relative shrink-0 w-9 h-9 flex items-center justify-center rounded-full ${b.iconBg} ${b.iconColor} transition-colors duration-300`}>
            <b.icon className="w-4 h-4" aria-hidden strokeWidth={1.5} />
          </span>

          <div className="min-w-0">
            <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-softblack leading-tight">
              {b.label}
            </p>
            <p className="text-[9px] text-brand-softblack/45 uppercase tracking-wider leading-tight mt-0.5 truncate">
              {b.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CheckoutBenefitsBar;
