import { CartProvider } from "@/context/CartContext";
import { StickyBarProvider } from "@/context/StickyBarContext";
import SkipLink from "@/components/SkipLink";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import ClientCustomCursor from "@/components/ui/ClientCustomCursor";
import ClientToastContainer from "@/components/ui/ClientToastContainer";
import ConditionalSiteChrome from "@/components/ConditionalSiteChrome";
import PageTransition from "@/components/ui/PageTransition";
import ExitIntentModal from "@/components/ExitIntentModal";
import type { Metadata, Viewport } from "next";
import { Mulish, Cormorant_Garamond } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";

// Allows pinch zoom on mobile; avoids unstable zoom feeling by not restricting the user
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#8B6F5E",
};

// Optimized Mulish font configuration: display: 'optional' avoids rendering block (LCP)
// Text is displayed immediately with fallback; custom font is only applied if it loads in ~100ms
const mulish = Mulish({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-mulish",
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://benangbaju.com";
const siteName = "benangbaju";
const siteDescription =
  "benangbaju — koleksi fashion pilihan yang merayakan keanggunan wanita Indonesia. Temukan koleksi terbaru pakaian premium kami.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Fashion Pilihan Indonesia`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "fashion",
    "baju wanita",
    "pakaian",
    "busana",
    "koleksi",
    "fashion indonesia",
    "benangbaju",
    "baju premium",
    "outfit",
  ],
  authors: [{ name: "benangbaju" }],
  creator: "benangbaju",
  publisher: "benangbaju",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName,
    title: `${siteName} | Fashion Pilihan Indonesia`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Fashion Pilihan Indonesia`,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${mulish.variable} ${cormorantGaramond.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase CDN — reduces latency for external images */}
        <link rel="preconnect" href="https://gwnegdilmazoobpexlld.supabase.co" />
        <link rel="dns-prefetch" href="https://gwnegdilmazoobpexlld.supabase.co" />
      </head>
      <body className={`${mulish.className} antialiased bg-brand-offwhite`} suppressHydrationWarning>
        <SkipLink />
        <SmoothScrolling>
          <SiteSettingsProvider>
            <CartProvider>
              <StickyBarProvider>
                <PageTransition>
                  <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
                </PageTransition>
                <ExitIntentModal />
                <ClientToastContainer />
              </StickyBarProvider>
            </CartProvider>
          </SiteSettingsProvider>
        </SmoothScrolling>
        {/* Third-party scripts loaded optimally */}
        <ThirdPartyScripts />
        <SpeedInsights />
        <Analytics />
        <ClientCustomCursor />
      </body>
    </html>
  );
}

