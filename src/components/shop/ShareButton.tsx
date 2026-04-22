"use client";

import { useState, useCallback } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  /** Título para navigator.share (ex.: nome do produto). */
  title?: string;
  /** Texto para navigator.share (ex.: descrição curta). */
  text?: string;
  /** URL untuk dibagikan. Jika tidak diisi, gunakan URL saat ini. */
  url?: string;
  /** Classes adicionais no botão. */
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback jika gagal salin */
    }
  }, []);

  const handleClick = useCallback(async () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const shareTitle = title ?? (typeof document !== "undefined" ? document.title : "");
    const shareText = text ?? "";

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(shareUrl);
        }
      }
      return;
    }

    await copyToClipboard(shareUrl);
  }, [title, text, url, copyToClipboard]);

  const label = copied ? "LINK DISALIN" : "BAGIKAN";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex flex-row items-center gap-2 text-stone-500 hover:text-brand-green transition-colors duration-300 ${className}`.trim()}
      aria-label={label}
    >
      <Share2
        strokeWidth={1.5}
        className="w-4 h-4 shrink-0"
        aria-hidden
      />
      <span className="text-xs uppercase tracking-widest font-light">
        {label}
      </span>
    </button>
  );
}
