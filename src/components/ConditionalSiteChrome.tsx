"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const MobileMenu = dynamic(() => import("@/components/MobileMenu"));
const SearchOverlay = dynamic(() => import("@/components/SiteSearch"));
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"));
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

/**
 * Merender Navbar, MobileMenu, SearchOverlay, dan Footer hanya saat route
 * bukan checkout. Pada checkout, keranjang diarahkan lewat link ke `/checkout`.
 */
export default function ConditionalSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCleanRoute =
    pathname === "/checkout" || 
    pathname?.startsWith("/checkout/") ||
    pathname?.startsWith("/admin");

  if (isCleanRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <WhatsAppButton />
      <div id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <Footer className="batch-zero-footer" />
    </>
  );
}
