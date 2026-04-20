"use client";

import { useEffect } from "react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Batas Error Global]", error.message, error.digest);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          padding: "2rem",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f2f2f0",
          color: "#1a1a1a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <span
            style={{
              display: "block",
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(26,26,26,0.6)",
              marginBottom: "1rem",
            }}
          >
            Kesalahan kritis
          </span>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Terjadi kesalahan
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 300,
              opacity: 0.8,
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman atau
            coba kembali beberapa saat lagi.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "0.75rem 2rem",
                border: "1px solid #0a3323",
                borderRadius: "2px",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#0a3323",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Coba lagi
            </button>
            <Link
              href="/"
              style={{
                padding: "0.75rem 2rem",
                border: "1px solid rgba(26,26,26,0.2)",
                borderRadius: "2px",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(26,26,26,0.8)",
                textDecoration: "none",
              }}
            >
              Beranda
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
