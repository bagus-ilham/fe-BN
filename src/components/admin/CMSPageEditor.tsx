"use client";

import { useCallback, useMemo, useState } from "react";
import { Save, Eye, EyeOff, Plus, Trash2, ArrowUp, ArrowDown, GripVertical, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CMSBlock, CMSPage, CMSPageVersion } from "@/types/database";

interface CMSPageEditorProps {
  page: CMSPage;
  initialVersions: CMSPageVersion[];
}

const VERSION_PAGE_SIZE = 20;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseFaqLines(value: string): Array<{ q: string; a: string }> {
  return value
    .split("\n")
    .map((line) => {
      const [q, ...aParts] = line.split("|");
      return { q: q?.trim() ?? "", a: aParts.join("|").trim() };
    })
    .filter((item) => item.q || item.a);
}

function parseGalleryLines(value: string): Array<{ src: string; alt: string }> {
  return value
    .split("\n")
    .map((line) => {
      const [src, ...altParts] = line.split("|");
      return { src: src?.trim() ?? "", alt: altParts.join("|").trim() };
    })
    .filter((item) => item.src);
}

function formatFaqLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const row = item as { q?: unknown; a?: unknown };
      return `${asString(row.q)}|${asString(row.a)}`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

function formatGalleryLines(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const row = item as { src?: unknown; alt?: unknown };
      return `${asString(row.src)}|${asString(row.alt)}`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

function formatListLines(value: unknown): string {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string").join("\n") : "";
}

function createEmptyBlock(type: CMSBlock["type"]): CMSBlock {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const byType: Record<CMSBlock["type"], Record<string, unknown>> = {
    hero: { eyebrow: "", title: "Judul", subtitle: "" },
    rich_text: { content: "" },
    feature_list: { title: "Daftar Fitur", items: [] },
    faq: { title: "Pertanyaan Umum", items: [] },
    cta: { title: "Lanjutkan", text: "", primaryLabel: "Lihat Selengkapnya", primaryHref: "/" },
    gallery: { title: "Galeri", images: [] },
  };

  return { id, type, data: byType[type] };
}

function formatVersionDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function CMSPageEditor({
  page,
  initialVersions,
}: CMSPageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [seoTitle, setSeoTitle] = useState(page.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(page.seo_description ?? "");
  const [isPublished, setIsPublished] = useState(page.is_published);
  const [blocks, setBlocks] = useState<CMSBlock[]>(page.blocks ?? []);
  const [versions, setVersions] = useState<CMSPageVersion[]>(initialVersions);
  const [hasMoreVersions, setHasMoreVersions] = useState(
    initialVersions.length >= VERSION_PAGE_SIZE,
  );
  const [versionsOffset, setVersionsOffset] = useState(initialVersions.length);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const blocksPreviewCount = useMemo(() => blocks.length, [blocks]);

  const updateBlockData = (
    index: number,
    key: string,
    value: string,
    mode: "text" | "lines" | "faq" | "gallery" = "text",
  ) => {
    setBlocks((prev) =>
      prev.map((block, i) => {
        if (i !== index) return block;
        let nextValue: unknown = value;
        if (mode === "lines") nextValue = parseLines(value);
        if (mode === "faq") nextValue = parseFaqLines(value);
        if (mode === "gallery") nextValue = parseGalleryLines(value);
        return { ...block, data: { ...block.data, [key]: nextValue } };
      }),
    );
  };

  const updateBlockType = (index: number, type: CMSBlock["type"]) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...createEmptyBlock(type), id: block.id } : block)),
    );
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setBlocks((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const cloned = [...prev];
      const [item] = cloned.splice(index, 1);
      cloned.splice(nextIndex, 0, item);
      return cloned;
    });
  };

  const refreshVersions = useCallback(async () => {
    // Mocking the refresh of versions locally
    console.log("Mock: Refreshing versions for", page.slug);
  }, [page.slug]);

  const loadMoreVersions = useCallback(async () => {
    // Mocking loading more versions
    console.log("Mock: Loading more versions for", page.slug);
    setHasMoreVersions(false);
  }, [page.slug]);

  const getVersionLabel = useCallback(
    (index: number, version: CMSPageVersion) => {
      const versionNumber = versions.length - index;
      const titleSnippet = version.title?.trim()
        ? version.title.trim().slice(0, 36)
        : "Tanpa Judul";
      return `v${Math.max(versionNumber, 1)} · ${titleSnippet}`;
    },
    [versions.length],
  );

  const onSave = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Create a mock new version
      const newVersion: CMSPageVersion = {
        id: crypto.randomUUID(),
        page_id: page.id,
        created_at: new Date().toISOString(),
        title,
        seo_title: seoTitle,
        seo_description: seoDescription,
        blocks,
        is_published: isPublished,
        edited_by: null,
      };

      setVersions((prev) => [newVersion, ...prev]);
      setMessage("Konten berhasil disimpan (Simulasi).");
    } catch (e: unknown) {
      setError("Terjadi kesalahan simulasi.");
    } finally {
      setLoading(false);
    }
  };

  const onRestoreVersion = async (versionId: string) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const version = versions.find(v => v.id === versionId);
      if (!version) throw new Error("Versi tidak ditemukan");

      setTitle(version.title);
      setSeoTitle(version.seo_title ?? "");
      setSeoDescription(version.seo_description ?? "");
      setIsPublished(version.is_published);
      setBlocks(version.blocks ?? []);
      setMessage("Versi berhasil dipulihkan (Simulasi).");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal restore versi.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-8">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Editor Halaman: <span className="font-medium">{page.slug}</span>
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Ubah struktur dan konten halaman dinamis
          </p>
        </div>
      </div>

      <div className="surface-card p-6 md:p-8 space-y-8">
        {/* SEO & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-brand-softblack/5 pb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-brand-softblack/50 mb-2 font-medium">
                Judul Halaman
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-brand-offwhite/50 border-b border-brand-softblack/10 px-0 py-2 text-sm text-brand-softblack focus:border-brand-green outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-brand-softblack/50 mb-2 font-medium">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-brand-offwhite/50 border-b border-brand-softblack/10 px-0 py-2 text-sm text-brand-softblack focus:border-brand-green outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-brand-softblack/50 mb-2 font-medium">
                SEO Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="w-full bg-brand-offwhite/50 border-b border-brand-softblack/10 px-0 py-2 text-sm text-brand-softblack focus:border-brand-green outline-none transition-colors resize-none"
              />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-softblack/50 font-medium">Status Publikasi:</span>
              <button
                type="button"
                onClick={() => setIsPublished((prev) => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                  isPublished
                    ? "bg-brand-green text-white"
                    : "bg-stone-200 text-brand-softblack/60"
                }`}
              >
                {isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                {isPublished ? "Published" : "Draft"}
              </button>
            </div>
          </div>
        </div>


      {/* BLOCKS EDITOR */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-brand-softblack/5 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[14px] uppercase tracking-[0.2em] text-brand-softblack font-medium">
              Struktur Konten (Blocks)
            </h3>
            <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green text-[10px] uppercase tracking-widest rounded-full">
              {blocksPreviewCount} item
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            className="text-[10px] uppercase tracking-widest px-3 py-1.5 text-brand-softblack/60 hover:text-brand-softblack transition-colors flex items-center gap-2"
          >
            <Settings2 size={14} />
            {showPreview ? "Sembunyikan Raw JSON" : "Raw JSON"}
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {blocks.map((block, index) => (
              <motion.div 
                key={block.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-white border border-stone-200 rounded-sm shadow-sm hover:border-brand-green/40 transition-colors overflow-hidden"
              >
                {/* Block Header Toolbar */}
                <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-stone-300 cursor-grab active:cursor-grabbing" />
                    <select
                      value={block.type}
                      onChange={(e) => updateBlockType(index, e.target.value as CMSBlock["type"])}
                      className="bg-transparent text-[10px] uppercase tracking-widest font-bold text-brand-softblack focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="hero">Hero Banner</option>
                      <option value="rich_text">Rich Text / Paragraph</option>
                      <option value="feature_list">Feature List</option>
                      <option value="faq">FAQ Accordion</option>
                      <option value="cta">Call to Action (CTA)</option>
                      <option value="gallery">Image Gallery</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="p-1.5 text-stone-400 hover:text-brand-softblack hover:bg-stone-200 rounded-md disabled:opacity-30 transition-colors">
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="p-1.5 text-stone-400 hover:text-brand-softblack hover:bg-stone-200 rounded-md disabled:opacity-30 transition-colors">
                      <ArrowDown size={14} />
                    </button>
                    <div className="w-px h-4 bg-stone-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => setBlocks((prev) => prev.filter((_, i) => i !== index))}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Block Content Editor */}
                <div className="p-5">
                  {block.type === "hero" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[9px] uppercase tracking-widest text-stone-400">Eyebrow</label>
                         <input value={asString(block.data.eyebrow)} onChange={(e) => updateBlockData(index, "eyebrow", e.target.value)} placeholder="Teks kecil di atas judul" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] uppercase tracking-widest text-stone-400">Judul Utama</label>
                         <input value={asString(block.data.title)} onChange={(e) => updateBlockData(index, "title", e.target.value)} placeholder="Judul besar" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                         <label className="text-[9px] uppercase tracking-widest text-stone-400">Subtitle / Deskripsi</label>
                         <textarea value={asString(block.data.subtitle)} onChange={(e) => updateBlockData(index, "subtitle", e.target.value)} placeholder="Penjelasan singkat" rows={2} className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none resize-none" />
                      </div>
                    </div>
                  )}

                  {block.type === "rich_text" && (
                     <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-stone-400">Konten Teks</label>
                       <textarea value={asString(block.data.content)} onChange={(e) => updateBlockData(index, "content", e.target.value)} placeholder="Ketik konten paragraf di sini..." rows={6} className="w-full border border-stone-200 rounded-sm bg-stone-50/50 p-4 text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none" />
                     </div>
                  )}

                  {block.type === "feature_list" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Judul Daftar</label>
                        <input value={asString(block.data.title)} onChange={(e) => updateBlockData(index, "title", e.target.value)} placeholder="Judul list" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Item (Satu per baris)</label>
                        <textarea value={formatListLines(block.data.items)} onChange={(e) => updateBlockData(index, "items", e.target.value, "lines")} placeholder="Item 1&#10;Item 2" rows={4} className="w-full border border-stone-200 rounded-sm bg-stone-50/50 p-4 text-sm focus:border-brand-green outline-none" />
                      </div>
                    </div>
                  )}

                  {block.type === "faq" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Judul Bagian FAQ</label>
                        <input value={asString(block.data.title)} onChange={(e) => updateBlockData(index, "title", e.target.value)} placeholder="Judul FAQ" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Daftar Pertanyaan & Jawaban</label>
                        <textarea value={formatFaqLines(block.data.items)} onChange={(e) => updateBlockData(index, "items", e.target.value, "faq")} placeholder="Pertanyaan di sini | Jawaban di sini&#10;Pertanyaan dua | Jawaban dua" rows={5} className="w-full border border-stone-200 rounded-sm bg-stone-50/50 p-4 text-sm font-mono focus:border-brand-green outline-none" />
                      </div>
                    </div>
                  )}

                  {block.type === "cta" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Judul CTA</label>
                        <input value={asString(block.data.title)} onChange={(e) => updateBlockData(index, "title", e.target.value)} placeholder="Teks ajakan utama" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Deskripsi Singkat</label>
                        <input value={asString(block.data.text)} onChange={(e) => updateBlockData(index, "text", e.target.value)} placeholder="Teks kecil pendukung" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Label Tombol Utama</label>
                        <input value={asString(block.data.primaryLabel)} onChange={(e) => updateBlockData(index, "primaryLabel", e.target.value)} placeholder="Beli Sekarang" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Link Tombol (URL)</label>
                        <input value={asString(block.data.primaryHref)} onChange={(e) => updateBlockData(index, "primaryHref", e.target.value)} placeholder="/collections" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                    </div>
                  )}

                  {block.type === "gallery" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Judul Galeri</label>
                        <input value={asString(block.data.title)} onChange={(e) => updateBlockData(index, "title", e.target.value)} placeholder="Judul Galeri (Opsional)" className="w-full border-b border-stone-200 bg-transparent px-0 py-1.5 text-sm focus:border-brand-green outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-stone-400">Daftar URL Gambar</label>
                        <textarea value={formatGalleryLines(block.data.images)} onChange={(e) => updateBlockData(index, "images", e.target.value, "gallery")} placeholder="/images/foto1.jpg | Alt teks 1&#10;/images/foto2.jpg | Alt teks 2" rows={5} className="w-full border border-stone-200 rounded-sm bg-stone-50/50 p-4 text-sm font-mono focus:border-brand-green outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Block Buttons */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-3">
          {(["hero", "rich_text", "feature_list", "faq", "cta", "gallery"] as CMSBlock["type"][]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBlocks((prev) => [...prev, createEmptyBlock(type)])}
              className="inline-flex items-center gap-2 bg-white border border-stone-200 hover:border-brand-green hover:text-brand-green px-4 py-2 text-[10px] uppercase tracking-widest text-stone-500 rounded-full transition-colors"
            >
              <Plus size={14} />
              {type.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      </div>

      {showPreview && (
        <div className="surface-card p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-brand-softblack/60">
            Preview Draft (Admin)
          </h3>
          <div className="space-y-3">
            {blocks.map((block) => (
              <div key={`preview-${block.id}`} className="border border-brand-softblack/10 p-3 bg-white">
                <p className="text-[10px] uppercase tracking-widest text-brand-softblack/50 mb-1">{block.type}</p>
                <pre className="text-xs text-brand-softblack/70 whitespace-pre-wrap break-words">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface-card p-5 space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-brand-softblack/60">
          Riwayat Versi
        </h3>
        {versions.length === 0 ? (
          <p className="text-xs text-brand-softblack/60">
            Belum ada riwayat versi untuk halaman ini.
          </p>
        ) : (
          <div className="space-y-2">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="border border-brand-softblack/10 bg-white p-3 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-medium text-brand-softblack">
                    {getVersionLabel(index, version)}
                  </p>
                  <p className="text-xs text-brand-softblack/70 mt-0.5">
                    {formatVersionDate(version.created_at)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-brand-softblack/50 mt-1">
                    {version.is_published ? "Status: Published" : "Status: Draft"} | {version.blocks.length} blok | editor: {version.edited_by ? "Admin" : "Sistem"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRestoreVersion(version.id)}
                  disabled={loading}
                  className="border border-brand-softblack/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-brand-softblack/70 disabled:opacity-50"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
        {hasMoreVersions && (
          <div className="pt-2">
            <button
              type="button"
              onClick={loadMoreVersions}
              disabled={loading}
              className="border border-brand-softblack/20 px-3 py-1.5 text-[10px] uppercase tracking-widest text-brand-softblack/70 disabled:opacity-50"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-brand-softblack/10 pt-8 mt-12">
        <div className="flex flex-col">
          {message && <p className="text-xs text-brand-green font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-green inline-block"></span>{message}</p>}
          {error && <p className="text-xs text-red-600 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>{error}</p>}
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 bg-brand-softblack text-brand-offwhite px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-green transition-colors disabled:opacity-60 shadow-lg shadow-brand-softblack/20 group"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} className="group-hover:scale-110 transition-transform" />
          )}
          {loading ? "Menyimpan..." : "Simpan Konten"}
        </button>
      </div>
    </div>
  );
}
