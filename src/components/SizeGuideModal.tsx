"use client";

import { useEffect } from "react";

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const SIZE_DATA = [
  { talla: "XS", busto: "80–84", cintura: "60–64", cadera: "86–90" },
  { talla: "S",  busto: "84–88", cintura: "64–68", cadera: "90–94" },
  { talla: "M",  busto: "88–92", cintura: "68–72", cadera: "94–98" },
  { talla: "L",  busto: "92–96", cintura: "72–76", cadera: "98–102" },
  { talla: "XL", busto: "96–102", cintura: "76–82", cadera: "102–108" },
  { talla: "XXL", busto: "102–108", cintura: "82–88", cadera: "108–114" },
];

export default function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/60 z-50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-cream-100 w-full max-w-lg max-h-[90dvh] overflow-y-auto flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-cream-300/60 shrink-0">
            <div className="space-y-0.5">
              <p className="text-[9px] tracking-[0.22em] uppercase text-champagne">Lumière</p>
              <h2
                className="text-xl font-light text-ink"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Guía de tallas
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink/30 hover:text-ink transition-colors duration-200"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Intro */}
          <div className="px-7 py-5 border-b border-cream-300/30">
            <p className="text-[11px] text-ink/50 leading-relaxed">
              Toma tus medidas en centímetros sobre ropa interior. Mantén la cinta métrica ajustada pero sin apretar.
            </p>
          </div>

          {/* How to measure */}
          <div className="px-7 py-5 border-b border-cream-300/30 grid grid-cols-3 gap-px bg-cream-300/40">
            {[
              { label: "Busto", desc: "La parte más amplia del pecho" },
              { label: "Cintura", desc: "La parte más estrecha del torso" },
              { label: "Cadera", desc: "La parte más amplia de las caderas" },
            ].map((m) => (
              <div key={m.label} className="bg-cream-100 px-3 py-4">
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-ink">{m.label}</p>
                <p className="text-[10px] text-ink/40 mt-1 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="px-7 py-5">
            <p className="text-[9px] tracking-[0.2em] uppercase text-ink/30 mb-4">Medidas en centímetros</p>
            <div className="border border-cream-300/60 divide-y divide-cream-300/60">
              {/* Head */}
              <div className="grid grid-cols-4 bg-espresso">
                {["Talla", "Busto", "Cintura", "Cadera"].map((h) => (
                  <div key={h} className="px-4 py-2.5">
                    <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-cream-100/70">{h}</span>
                  </div>
                ))}
              </div>
              {/* Rows */}
              {SIZE_DATA.map((row, idx) => (
                <div
                  key={row.talla}
                  className={`grid grid-cols-4 ${idx % 2 === 0 ? "bg-cream-100" : "bg-cream-200/40"}`}
                >
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-xs font-semibold text-ink tracking-wider">{row.talla}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-xs text-ink/60 tabular-nums">{row.busto}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-xs text-ink/60 tabular-nums">{row.cintura}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className="text-xs text-ink/60 tabular-nums">{row.cadera}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-7 pb-6 pt-1">
            <p className="text-[10px] text-ink/35 leading-relaxed">
              Si estás entre dos tallas, te recomendamos elegir la talla mayor para mayor comodidad. Para dudas, escríbenos por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
