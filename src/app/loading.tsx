/**
 * Global loading fallback — branded skeleton
 * Digunakan saat route belum punya loading.tsx khusus
 */
export default function Loading() {
  return (
    <main className="relative min-h-screen bg-brand-offwhite" aria-busy="true" aria-label="Memuat halaman">
      {/* ── HERO SKELETON ── */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-brand-softblack">
        {/* Shimmer background */}
        <div className="absolute inset-0 shimmer opacity-20" />

        {/* Centered brand mark while loading */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Logo placeholder */}
          <div className="text-brand-offwhite/20 text-sm font-light uppercase tracking-[0.55em] animate-pulse">
            benangbaju
          </div>

          {/* Loading indicator — three dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand-gold/40"
                style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>

          {/* Fake title block */}
          <div className="space-y-3 text-center">
            <div className="h-px w-24 bg-brand-gold/20 mx-auto" />
            <div className="h-12 w-80 bg-brand-offwhite/5 rounded-sm animate-pulse" />
            <div className="h-4 w-64 bg-brand-offwhite/5 rounded-sm animate-pulse mx-auto" />
          </div>

          {/* Fake CTA */}
          <div className="h-11 w-40 bg-brand-offwhite/8 rounded-sm animate-pulse mt-4" />
        </div>

        {/* Bottom dots indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border border-brand-offwhite/10 flex items-center justify-center"
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-brand-offwhite/20"
                style={{ animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT GRID SKELETON ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        {/* Section heading */}
        <div className="text-center mb-14 space-y-3">
          <div className="h-2 w-16 bg-brand-champagne/60 rounded-full mx-auto animate-pulse" />
          <div className="h-9 w-56 bg-brand-champagne/50 rounded-sm mx-auto animate-pulse" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-x-8 sm:gap-y-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="aspect-[3/4] w-full bg-brand-champagne/40 rounded-sm shimmer" />
              <div className="h-3 w-3/4 bg-brand-champagne/40 rounded animate-pulse" />
              <div className="h-4 w-24 bg-brand-champagne/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
