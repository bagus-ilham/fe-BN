"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, ChevronRight, Check } from "lucide-react";

interface SizeHelperProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export default function SizeHelper({ isOpen, onClose, productName }: SizeHelperProps) {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState("regular");
  const [result, setResult] = useState<string | null>(null);

  const calculateSize = () => {
    const h = parseInt(height);
    const w = parseInt(weight);

    if (isNaN(h) || isNaN(w)) return;

    // Logic sederhana untuk simulasi
    let size = "M";
    if (h > 175 || w > 75) size = "XL";
    else if (h > 165 || w > 65) size = "L";
    else if (h < 155 || w < 50) size = "S";

    // Penyesuaian Fit
    if (fit === "tight" && size !== "S") {
        // Jika ingin ketat, mungkin turun satu size
        const sizes = ["S", "M", "L", "XL"];
        const idx = sizes.indexOf(size);
        size = sizes[Math.max(0, idx - 1)];
    } else if (fit === "loose" && size !== "XL") {
        // Jika ingin longgar, naik satu size
        const sizes = ["S", "M", "L", "XL"];
        const idx = sizes.indexOf(size);
        size = sizes[Math.min(3, idx + 1)];
    }

    setResult(size);
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setHeight("");
    setWeight("");
    setFit("regular");
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-softblack/50 backdrop-blur-[4px]"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden"
        >
          {/* Top gold accent */}
          <div className="h-1 bg-gradient-to-r from-brand-gold/60 via-brand-gold to-brand-gold/60" />

          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                <Ruler className="w-4 h-4 text-brand-gold" strokeWidth={1.5} />
              </div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-softblack">
                Find Your Fit
              </h3>
            </div>
            <button onClick={onClose} className="text-brand-softblack/40 hover:text-brand-softblack transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-semibold text-brand-gold/80 flex items-center justify-center gap-2">
                    <span className="w-4 h-px bg-brand-gold/40" />
                    Langkah 1 dari 2
                    <span className="w-4 h-px bg-brand-gold/40" />
                  </p>
                  <h4 className="text-xl font-light text-brand-softblack tracking-[-0.01em]">Berapa tinggi dan berat badanmu?</h4>
                </div>

                <div className="grid grid-cols-2 gap-5 mt-2">
                  <div className="space-y-1.5 group">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-softblack/50 group-focus-within:text-brand-green transition-colors">Tinggi (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="165"
                      className="w-full border-b border-stone-200 py-3 text-2xl font-light text-brand-softblack focus:border-brand-green outline-none transition-colors placeholder:text-stone-300"
                    />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-softblack/50 group-focus-within:text-brand-green transition-colors">Berat (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="55"
                      className="w-full border-b border-stone-200 py-3 text-2xl font-light text-brand-softblack focus:border-brand-green outline-none transition-colors placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <button
                  disabled={!height || !weight}
                  onClick={() => setStep(2)}
                  className="w-full bg-brand-softblack text-white py-4 text-[10px] uppercase tracking-[0.25em] font-semibold rounded-sm disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-2 hover:bg-brand-green transition-colors mt-2"
                >
                  Lanjut
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-semibold text-brand-gold/80 flex items-center justify-center gap-2">
                    <span className="w-4 h-px bg-brand-gold/40" />
                    Langkah 2 dari 2
                    <span className="w-4 h-px bg-brand-gold/40" />
                  </p>
                  <h4 className="text-xl font-light text-brand-softblack tracking-[-0.01em]">Bagaimana gaya berpakaianmu?</h4>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-2">
                  {[
                    { id: "tight", name: "Tight Fit", desc: "Pas di badan, menonjolkan siluet" },
                    { id: "regular", name: "Regular Fit", desc: "Standar, nyaman digunakan sehari-hari" },
                    { id: "loose", name: "Loose Fit", desc: "Longgar, gaya santai dan flowy" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFit(f.id)}
                      className={`p-4 text-left border rounded-sm transition-all duration-300 relative overflow-hidden ${
                        fit === f.id ? "border-brand-green bg-brand-green/5 shadow-sm" : "border-stone-100 hover:border-brand-softblack/20"
                      }`}
                    >
                      {fit === f.id && (
                        <motion.div layoutId="fit-active-bg" className="absolute inset-0 bg-brand-green/5" />
                      )}
                      <div className="flex items-center justify-between relative z-10">
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${fit === f.id ? "text-brand-green" : "text-brand-softblack"}`}>
                          {f.name}
                        </p>
                        {fit === f.id && <Check className="w-4 h-4 text-brand-green" />}
                      </div>
                      <p className="text-xs text-brand-softblack/50 mt-1 relative z-10 font-light">{f.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => setStep(1)}
                        className="flex-1 border border-stone-200 py-4 text-[10px] uppercase tracking-[0.25em] text-brand-softblack/70 hover:bg-stone-50 transition-colors rounded-sm"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={calculateSize}
                        className="flex-[2] glimmer-hover bg-brand-green text-white py-4 text-[10px] uppercase tracking-[0.25em] font-semibold rounded-sm hover:bg-brand-softblack transition-colors"
                    >
                        Lihat Hasil
                    </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="relative py-10 rounded-full w-40 h-40 mx-auto flex items-center justify-center border border-brand-green/20">
                   <div className="absolute inset-2 bg-brand-green/5 rounded-full" />
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-brand-green/20" />
                   <div className="text-center relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-brand-green font-bold mb-1">Ukuranmu</p>
                    <p className="text-6xl font-light text-brand-green tracking-[-0.05em]">{result}</p>
                   </div>
                   {/* Decorative circle glow */}
                   <div className="absolute inset-0 rounded-full bg-brand-green/10 blur-xl -z-10" />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="w-3 h-px bg-brand-gold/40" />
                      <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-softblack">Hasil Rekomendasi</h4>
                      <span className="w-3 h-px bg-brand-gold/40" />
                    </div>
                    <p className="text-sm text-brand-softblack/60 font-light leading-relaxed px-4">
                        Berdasarkan data yang kamu masukkan, ukuran <strong className="font-semibold text-brand-softblack text-base">{result}</strong> adalah yang paling pas untuk dipakai pada koleksi ini.
                    </p>
                </div>

                <div className="space-y-4 pt-2">
                    <button
                        onClick={onClose}
                        className="w-full bg-brand-softblack text-white py-4 text-[10px] uppercase tracking-[0.25em] font-semibold rounded-sm hover:bg-brand-green transition-colors"
                    >
                        Terapkan Ukuran Ini
                    </button>
                    <button
                        onClick={reset}
                        className="text-[10px] uppercase tracking-[0.1em] text-brand-softblack/40 hover:text-brand-softblack underline underline-offset-4 transition-colors"
                    >
                        Hitung Ulang
                    </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer branding */}
          <div className="p-4 bg-stone-50 text-center">
            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Powered by benangbaju Fit-Guide AI
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
