import Image from "next/image";
import Link from "next/link";
import type { CMSBlock } from "@/types/database";

interface CMSBlocksRendererProps {
  blocks: CMSBlock[];
}

type FAQItem = { q?: unknown; a?: unknown };
type GalleryItem = { src?: unknown; alt?: unknown };

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export default function CMSBlocksRenderer({ blocks }: CMSBlocksRendererProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {blocks.map((block) => {
        const data = block.data ?? {};

        if (block.type === "hero") {
          return (
            <section key={block.id} className="text-center space-y-4">
              {asString(data.eyebrow) && (
                <p className="text-[10px] uppercase tracking-[0.35em] text-brand-green">
                  {asString(data.eyebrow)}
                </p>
              )}
              <h1 className="text-3xl md:text-5xl font-light uppercase tracking-tight text-brand-softblack">
                {asString(data.title, "Judul")}
              </h1>
              {asString(data.subtitle) && (
                <p className="text-sm text-brand-softblack/60 max-w-2xl mx-auto">
                  {asString(data.subtitle)}
                </p>
              )}
            </section>
          );
        }

        if (block.type === "rich_text") {
          return (
            <section key={block.id} className="surface-card p-6 md:p-8">
              <p className="whitespace-pre-line text-sm text-brand-softblack/70 leading-relaxed">
                {asString(data.content, "")}
              </p>
            </section>
          );
        }

        if (block.type === "feature_list") {
          const items = asStringArray(data.items);
          return (
            <section key={block.id} className="space-y-4">
              <h2 className="text-xl font-light uppercase tracking-[0.2em] text-brand-softblack">
                {asString(data.title, "Daftar")}
              </h2>
              <ul className="space-y-2 text-sm text-brand-softblack/70">
                {items.map((item, index) => (
                  <li key={`${block.id}-${index}`} className="flex gap-2">
                    <span className="text-brand-green">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.type === "faq") {
          const items = Array.isArray(data.items) ? data.items : [];
          return (
            <section key={block.id} className="space-y-4">
              <h2 className="text-xl font-light uppercase tracking-[0.2em] text-brand-softblack">
                {asString(data.title, "Pertanyaan Umum")}
              </h2>
              <div className="space-y-2">
                {items.map((item, index) => {
                  const faqItem = typeof item === "object" && item ? (item as FAQItem) : null;
                  const q = faqItem ? asString(faqItem.q) : "";
                  const a = faqItem ? asString(faqItem.a) : "";
                  return (
                    <details
                      key={`${block.id}-${index}`}
                      className="surface-card p-4"
                    >
                      <summary className="cursor-pointer text-sm font-medium text-brand-softblack">
                        {q || `Pertanyaan ${index + 1}`}
                      </summary>
                      <p className="mt-3 text-sm text-brand-softblack/70">{a}</p>
                    </details>
                  );
                })}
              </div>
            </section>
          );
        }

        if (block.type === "cta") {
          const href = asString(data.primaryHref, "/");
          return (
            <section key={block.id} className="surface-card p-8 text-center space-y-4">
              <h2 className="text-2xl font-light text-brand-softblack">
                {asString(data.title, "Lanjutkan")}
              </h2>
              {asString(data.text) && (
                <p className="text-sm text-brand-softblack/60">{asString(data.text)}</p>
              )}
              <Link
                href={href}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-green text-white text-xs uppercase tracking-widest"
              >
                {asString(data.primaryLabel, "Lihat Selengkapnya")}
              </Link>
            </section>
          );
        }

        if (block.type === "gallery") {
          const images = Array.isArray(data.images) ? data.images : [];
          return (
            <section key={block.id} className="space-y-4">
              <h2 className="text-xl font-light uppercase tracking-[0.2em] text-brand-softblack">
                {asString(data.title, "Galeri")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => {
                  const galleryItem = typeof image === "object" && image ? (image as GalleryItem) : null;
                  const src = galleryItem ? asString(galleryItem.src) : "";
                  const alt = galleryItem ? asString(galleryItem.alt, "Gambar") : "Gambar";
                  if (!src) return null;
                  return (
                    <div key={`${block.id}-${index}`} className="relative aspect-[4/3] bg-brand-offwhite">
                      <Image src={src} alt={alt} fill className="object-cover" />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
