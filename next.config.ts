import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [414, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 85],
    minimumCacheTTL: 2592000, // 30 hari — gambar dari Supabase jarang berubah
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
      // Izinkan localhost untuk pengembangan
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      // Izinkan gambar dari domain produksi
      {
        protocol: 'https',
        hostname: 'benangbaju.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.benangbaju.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thenblank.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Izinkan URL relatif yang diawali /
    unoptimized: false,
  },
  // ============================================================================
  // OPTIMASI PERFORMA
  // ============================================================================
  compress: true, // Kompresi Gzip/Brotli
  poweredByHeader: false, // Hapus header X-Powered-By (keamanan)
  reactStrictMode: true, // Deteksi masalah umum
  
  // ============================================================================
  // OPTIMASI BUILD
  // ============================================================================
  // swcMinify dihapus — SWC sudah menjadi minifier default di Next.js 16+
  ...(process.env.NODE_ENV === "production" && {
    compiler: { 
      removeConsole: { exclude: ["error", "warn"] }, // Hapus console.log di production
    },
  }),

  // ============================================================================
  // OPTIMASI EKSPERIMENTAL
  // ============================================================================
  experimental: {
    // Optimalkan import paket besar (tree-shaking lebih agresif)
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // ============================================================================
  // REDIRECT
  // ============================================================================
  async redirects() {
    return [
      {
        source: '/reset-password',
        destination: '/update-password',
        permanent: true,
      },
      {
        source: '/product',
        destination: '/collections/semua-produk',
        permanent: true,
      },
    ];
  },
  
  // ============================================================================
  // HEADER KEAMANAN & PERFORMA
  // ============================================================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Keamanan
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Performa
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache dioptimasi untuk aset statis
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache untuk font
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // ============================================================================
  // KONFIGURASI TURBOPACK
  // ============================================================================
  // Konfigurasi kosong Turbopack untuk menekan warning
  // Turbopack sudah hadir dengan optimasi luar biasa secara default di Next.js 16
  turbopack: {},
};

export default withPWA(nextConfig);
