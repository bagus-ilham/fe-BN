import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | benangbaju",
  description:
    "Selesaikan belanja Anda dengan aman. Pembayaran Midtrans dan pengiriman ke seluruh Indonesia.",
  robots: { index: false, follow: true },
};

/**
 * Layout minimalista para rotas /checkout* — apenas logo no header.
 * Navbar e Footer são ocultados pelo ConditionalSiteChrome no root layout.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <header className="shrink-0 border-b border-brand-softblack/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-brand-softblack font-light uppercase tracking-[0.2em] text-sm hover:opacity-80 transition-opacity"
          >
            benangbaju
          </Link>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-wider text-brand-softblack/60 hover:text-brand-green transition-colors"
          >
            Kembali
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
