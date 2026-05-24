"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch products once
  useEffect(() => {
    if (loaded) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setAllProducts((data.products ?? []).filter((p: Product) => p.visible));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [loaded]);

  // Filter on query change
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    setResults(
      allProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
        .slice(0, 8)
    );
  }, [query, allProducts]);

  // Focus input when opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSelect = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-espresso/70 backdrop-blur-[3px] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 right-0 z-[70] bg-cream-100 transition-transform duration-400 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}
      >
        {/* Search bar */}
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4 border-b border-cream-300/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-5 h-5 text-ink/30 shrink-0"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar prendas..."
            className="flex-1 bg-transparent text-base text-ink placeholder-ink/25 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-ink/25 hover:text-ink transition-colors duration-200 text-xs tracking-widest"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-ink/25 hover:text-ink transition-colors duration-200 shrink-0"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-w-3xl mx-auto px-6 overflow-y-auto" style={{ maxHeight: "70dvh" }}>
          {query.trim() === "" ? (
            <div className="py-10 space-y-2">
              <p className="text-[10px] tracking-[0.2em] uppercase text-ink/25 mb-5">Sugerencias</p>
              <div className="flex flex-wrap gap-2">
                {["Sale", "Nuevas piezas", "Vestidos", "Blusas", "Menos $499"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-4 py-2 border border-cream-300 text-xs text-ink/50 hover:border-champagne hover:text-champagne transition-colors duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 space-y-3">
              <div className="w-6 h-px bg-champagne" />
              <p className="text-sm text-ink/40">
                Sin resultados para <span className="text-ink/70">&ldquo;{query}&rdquo;</span>
              </p>
              <Link
                href={`/tienda`}
                onClick={handleSelect}
                className="inline-block text-[10px] tracking-[0.18em] uppercase text-champagne border-b border-champagne/40 pb-0.5"
              >
                Ver toda la tienda
              </Link>
            </div>
          ) : (
            <div className="py-4 divide-y divide-cream-300/40">
              <p className="text-[10px] tracking-[0.2em] uppercase text-ink/25 pb-3">
                {results.length} resultado{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.id}`}
                  onClick={handleSelect}
                  className="flex items-center gap-4 py-3 group hover:bg-cream-200/50 -mx-2 px-2 transition-colors duration-200"
                >
                  {/* Thumb */}
                  <div className="relative w-12 h-16 shrink-0 overflow-hidden bg-cream-200">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-cream-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink leading-snug truncate group-hover:text-champagne-dark transition-colors duration-200">
                      {product.name}
                    </p>
                    {product.description && (
                      <p className="text-[11px] text-ink/40 mt-0.5 line-clamp-1">{product.description}</p>
                    )}
                  </div>

                  {/* Precio */}
                  <span
                    className="text-sm font-medium text-ink shrink-0"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    ${product.price.toLocaleString("es-MX")}
                  </span>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4 text-ink/20 shrink-0 group-hover:text-champagne transition-colors duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}

              {/* Ver todos en tienda */}
              <div className="py-4">
                <Link
                  href={`/tienda?buscar=${encodeURIComponent(query)}`}
                  onClick={handleSelect}
                  className="text-[10px] tracking-[0.18em] uppercase text-champagne border-b border-champagne/40 pb-0.5 hover:text-champagne-dark transition-colors duration-200"
                >
                  Ver todos los resultados en tienda →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
