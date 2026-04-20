import { memo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import SecurityBadges from "@/components/SecurityBadges";
import TextReveal from "@/components/ui/text-reveal";

interface FooterProps {
  className?: string;
}

function Footer({ className = "" }: FooterProps) {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className={`bg-brand-softblack text-brand-offwhite ${className}`}>
      {/* Top gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {settings.navigation.footer.map((column, ci) => (
            <div key={column.title}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-px bg-brand-gold/50" />
                <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-offwhite/70">
                  {column.title}
                </p>
              </div>
              <ul className="space-y-4 text-xs font-light tracking-widest">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-brand-offwhite/50 hover:text-brand-offwhite transition-colors duration-300 hover:pl-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-px bg-brand-gold/50" />
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-offwhite/70">
                Newsletter
              </p>
            </div>
            <p className="text-xs font-light tracking-widest mb-5 text-brand-offwhite/50 leading-relaxed">
              Daftar untuk mendapatkan koleksi terbaru dan penawaran eksklusif dari {settings.storeName}.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 py-3 text-brand-gold text-xs tracking-widest"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Terima kasih telah berlangganan!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center border-b border-brand-offwhite/20 focus-within:border-brand-gold/50 transition-colors duration-300">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ANDA"
                  className="flex-1 bg-transparent py-2.5 text-[10px] focus:outline-none text-brand-offwhite placeholder:text-brand-offwhite/30 tracking-widest"
                  required
                />
                <button
                  type="submit"
                  className="text-brand-gold hover:text-brand-offwhite transition-colors duration-300 ml-2 p-1"
                  aria-label="Berlangganan newsletter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* ── Metode Pembayaran ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-7xl mx-auto mt-14 pt-10 border-t border-brand-offwhite/8"
        >
          <div className="text-center mb-6">
            <h4 className="text-[9px] uppercase tracking-[0.4em] mb-5 font-bold text-brand-offwhite/40 flex items-center justify-center gap-3">
              <span className="w-6 h-px bg-brand-offwhite/15" />
              Metode Pembayaran
              <span className="w-6 h-px bg-brand-offwhite/15" />
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {/* Visa */}
              <div className="flex items-center justify-center w-14 h-10 bg-white rounded-sm p-1.5 opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="Visa">
                <svg viewBox="0 0 36 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.6 24H2.4A2.4 2.4 0 0 1 0 21.6V2.4A2.4 2.4 0 0 1 2.4 0h31.2A2.4 2.4 0 0 1 36 2.4v19.2a2.4 2.4 0 0 1-2.4 2.4zm-15.76-9.238l-.359 2.25a6.84 6.84 0 0 0 2.903.531h-.011a5.167 5.167 0 0 0 3.275-.933l-.017.011a3.085 3.085 0 0 0 1.258-2.485v-.015v.001c0-1.1-.736-2.014-2.187-2.72a7.653 7.653 0 0 1-1.132-.672l.023.016a.754.754 0 0 1-.343-.592v-.002a.736.736 0 0 1 .379-.6l.004-.002a1.954 1.954 0 0 1 1.108-.257h-.006h.08l.077-.001c.644 0 1.255.139 1.806.388l-.028-.011l.234.125l.359-2.171a6.239 6.239 0 0 0-2.277-.422h-.049h.003a5.067 5.067 0 0 0-3.157.932l.016-.011a2.922 2.922 0 0 0-1.237 2.386v.005c-.01 1.058.752 1.972 2.266 2.72c.4.175.745.389 1.054.646l-.007-.006a.835.835 0 0 1 .297.608v.004c0 .319-.19.593-.464.716l-.005.002c-.3.158-.656.25-1.034.25h-.046h.002h-.075c-.857 0-1.669-.19-2.397-.53l.035.015l-.343-.172zm10.125 1.141h3.315q.08.343.313 1.5H34L31.906 7.372h-2a1.334 1.334 0 0 0-1.357.835l-.003.009l-3.84 9.187h2.72l.546-1.499zM14.891 7.372l-1.626 10.031h2.594l1.625-10.031zM4.922 9.419l2.11 7.968h2.734l4.075-10.015h-2.746l-2.534 6.844l-.266-1.391l-.904-4.609a1.042 1.042 0 0 0-1.177-.844l.006-.001H2.033l-.031.203c3.224.819 5.342 2.586 6.296 5.25A5.74 5.74 0 0 0 6.972 10.8l-.001-.001a6.103 6.103 0 0 0-2.007-1.368l-.04-.015zm25.937 4.421h-2.16q.219-.578 1.032-2.8l.046-.141l.16-.406c.066-.166.11-.302.14-.406l.188.859l.593 2.89z" fill="#1434CB" />
                </svg>
              </div>
              {/* Mastercard */}
              <div className="flex items-center justify-center w-14 h-10 bg-white rounded-sm p-1.5 opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="Mastercard">
                <svg viewBox="0 0 38 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="12" r="10" fill="#EB001B"/>
                  <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
                  <path d="M19 5.5C21.2 7.2 22.5 9.9 22.5 12C22.5 14.1 21.2 16.8 19 18.5C16.8 16.8 15.5 14.1 15.5 12C15.5 9.9 16.8 7.2 19 5.5Z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* GoPay */}
              <div className="flex items-center justify-center px-3 h-10 bg-white rounded-sm opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="GoPay">
                <span className="text-[11px] font-black text-[#0081A0] tracking-tighter">go<span className="text-[#7FBC41]">pay</span></span>
              </div>
              {/* OVO */}
              <div className="flex items-center justify-center px-3 h-10 bg-[#4C3494] rounded-sm opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="OVO">
                <span className="text-[11px] font-bold text-white tracking-widest">OVO</span>
              </div>
              {/* Dana */}
              <div className="flex items-center justify-center px-3 h-10 bg-[#118EEA] rounded-sm opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="Dana">
                <span className="text-[11px] font-black text-white italic">DANA</span>
              </div>
              {/* QRIS */}
              <div className="flex items-center justify-center px-3 h-10 bg-white rounded-sm opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="QRIS">
                <span className="text-[10px] font-bold text-brand-softblack tracking-tighter">QRIS</span>
              </div>
              {/* Transfer */}
              <div className="flex items-center justify-center px-3 h-10 bg-white rounded-sm opacity-85 hover:opacity-100 transition-all hover:scale-105 duration-300 shadow-sm" title="Transfer Bank">
                <span className="text-[9px] font-bold text-brand-softblack tracking-widest uppercase">Transfer</span>
              </div>
            </div>
          </div>

          {/* Security Seals */}
          <div className="mt-10 pt-8 border-t border-brand-offwhite/8">
            <h4 className="text-[9px] uppercase tracking-[0.4em] mb-5 font-bold text-brand-offwhite/40 text-center flex items-center justify-center gap-3">
              <span className="w-6 h-px bg-brand-offwhite/15" />
              Keamanan Berbelanja
              <span className="w-6 h-px bg-brand-offwhite/15" />
            </h4>
            <SecurityBadges variant="horizontal" theme="dark" />
          </div>
        </motion.div>

        {/* ── Legal Links ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="max-w-7xl mx-auto mt-10 pt-8 border-t border-brand-offwhite/8"
        >
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-light tracking-wider text-brand-offwhite/35">
            <Link href="/terms" className="hover:text-brand-offwhite/70 transition-colors duration-300">Syarat Penggunaan</Link>
            <span className="text-brand-offwhite/15">·</span>
            <Link href="/privacy" className="hover:text-brand-offwhite/70 transition-colors duration-300">Kebijakan Privasi</Link>
            <span className="text-brand-offwhite/15">·</span>
            <Link href="/returns" className="hover:text-brand-offwhite/70 transition-colors duration-300">Pengiriman dan Pengembalian</Link>
          </div>
        </motion.div>

        {/* ── Copyright ── */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/6">
          <TextReveal
            text="© 2025 benangbaju. Hak cipta dilindungi."
            el="p"
            className="text-[10px] text-white/25 text-center font-light tracking-widest"
            delay={0.2}
            duration={0.6}
          />
        </div>

        {/* ── Alamat ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/6"
        >
          <div className="hidden md:block">
            <div className="text-[9px] font-mono text-white/25 text-center leading-relaxed tracking-widest">
              <span>PT {settings.storeName} Indonesia</span>
              <span className="mx-3 text-brand-gold/30">·</span>
              <span>{settings.storeName}.com</span>
              <span className="mx-3 text-brand-gold/30">·</span>
              <span>{settings.contactInfo.address}</span>
              <span className="mx-3 text-brand-gold/30">·</span>
              <span>{settings.contactInfo.email}</span>
              <span className="mx-3 text-white/15">|</span>
              <span>{settings.contactInfo.whatsapp}</span>
            </div>
          </div>

          <div className="md:hidden">
            <div className="text-[9px] font-mono text-white/25 text-center space-y-1.5 leading-relaxed tracking-widest">
              <p>PT {settings.storeName} Indonesia</p>
              <p>{settings.storeName}.com</p>
              <p>{settings.contactInfo.address}</p>
              <p>
                <span>{settings.contactInfo.email}</span>
                <span className="mx-2 text-white/15">|</span>
                <span>{settings.contactInfo.whatsapp}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default memo(Footer);
