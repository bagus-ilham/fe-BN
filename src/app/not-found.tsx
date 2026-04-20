import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-brand-offwhite flex items-center justify-center px-6 py-24 overflow-hidden">

      {/* ── DECORATIVE BACKGROUND ── */}
      {/* Large faint 404 text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[22vw] font-extralight uppercase tracking-tighter text-brand-champagne/60 leading-none"
          style={{ WebkitTextStroke: "1px rgba(201,164,126,0.12)" }}
        >
          404
        </span>
      </div>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]" />
      </div>

      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #1C1C1C 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-8 h-px bg-brand-gold/40" />
          <span className="text-[9px] uppercase tracking-[0.52em] text-brand-gold/70 font-semibold">
            Halaman Tidak Ditemukan
          </span>
          <span className="w-8 h-px bg-brand-gold/40" />
        </div>

        {/* Fashion hanger icon */}
        <div className="w-16 h-16 mx-auto mb-8 text-brand-softblack/15">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M32 10 C32 10 26 18 20 23 C14 28 8 30 8 38 C8 43 14 46 20 46 L44 46 C50 46 56 43 56 38 C56 30 50 28 44 23 C38 18 32 10 32 10 Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M32 10 L32 6 C32 4 33.5 2.5 35.5 2.5 C37.5 2.5 39 4 39 6"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[-0.02em] mb-5 text-brand-softblack">
          Oops!
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base font-light text-brand-softblack/50 mb-4 max-w-md mx-auto leading-relaxed">
          Sepertinya kamu salah belok. Tapi tenang — koleksi terbaik kami masih menunggumu.
        </p>

        {/* Small separator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="w-4 h-px bg-brand-gold/30" />
          <span className="w-1 h-1 rounded-full bg-brand-gold/40" />
          <span className="w-4 h-px bg-brand-gold/30" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="glimmer-hover inline-flex items-center justify-center gap-2.5 bg-brand-green text-brand-offwhite px-10 py-4 text-[10px] uppercase tracking-[0.22em] font-semibold hover:bg-brand-softblack transition-all duration-500 shadow-md hover:shadow-xl rounded-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ke Beranda
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-2.5 border border-brand-softblack/15 text-brand-softblack px-10 py-4 text-[10px] uppercase tracking-[0.22em] font-light hover:border-brand-green hover:text-brand-green transition-all duration-500 rounded-sm"
          >
            Lihat Koleksi
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
