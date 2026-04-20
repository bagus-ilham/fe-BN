"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Memproses token dalam hash (implicit flow) — digunakan oleh OAuth/pendaftaran saat
 * Supabase mengembalikan token dalam fragment. Menyimpan sesi dalam cookie.
 */
function ProcessHashContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash?.slice(1);
    if (!hash) {
      window.location.replace(
        "/login?error=no-code&message=" +
          encodeURIComponent("Tautan tidak valid. Silakan periksa email Anda.")
      );
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const next = searchParams.get("next");
    const isRecovery =
      type === "recovery" ||
      next === "/update-password" ||
      next === "/reset-password";

    if (error) {
      const msg = errorDescription
        ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
        : "Terjadi kesalahan saat memproses tautan.";
      const target =
        type === "recovery"
          ? "/forgot-password?error="
          : "/login?error=auth-error&message=";
      window.location.replace(target + encodeURIComponent(msg));
      return;
    }

    if (!accessToken || !refreshToken) {
      window.location.replace(
        "/login?error=no-code&message=" +
          encodeURIComponent("Tautan tidak valid. Silakan periksa email Anda.")
      );
      return;
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(() => {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
        if (isRecovery) {
          window.location.replace("/update-password");
        } else if (type === "signup" || type === "email") {
          window.location.replace(
            "/login?email-confirmed=true&message=" +
              encodeURIComponent(
                "Email terkonfirmasi! Silakan masuk dengan email dan kata sandi yang Anda buat saat pendaftaran."
              )
          );
        } else {
          window.location.replace("/");
        }
      })
      .catch(() => {
        window.location.replace(
          "/login?error=auth-error&message=" +
            encodeURIComponent("Terjadi kesalahan. Silakan coba lagi.")
        );
      });
  }, [searchParams]);

  return (
    <div className="page-shell flex items-center justify-center bg-brand-offwhite">
      <p className="text-brand-softblack/60 text-sm font-light">
        Memproses…
      </p>
    </div>
  );
}

export default function ProcessHashPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell flex items-center justify-center bg-brand-offwhite">
          <p className="text-brand-softblack/60 text-sm font-light">
            Memproses…
          </p>
        </div>
      }
    >
      <ProcessHashContent />
    </Suspense>
  );
}
