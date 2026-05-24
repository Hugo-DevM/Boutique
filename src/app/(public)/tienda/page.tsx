"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter, { PriceRange, PRICE_RANGES } from "@/components/CategoryFilter";
import { Product, Category } from "@/types";

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria") as Category | null;
    if (cat) setActiveCategory(cat);
    const buscar = params.get("buscar");
    if (buscar) setSearch(buscar);
  }, []);

  const activePriceRange = PRICE_RANGES.find((r) => r.key === priceRange)!;

  const visible = products
    .filter((p) => p.visible)
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => p.price >= activePriceRange.min && p.price <= activePriceRange.max)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="pt-16 min-h-[100dvh] bg-cream-100">
      {/* Header editorial — fondo espresso como el hero */}
      <div className="bg-espresso py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-5">
            Lumière Boutique
          </p>
          <h1
            className="text-4xl lg:text-6xl font-light text-cream-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Nuestra Tienda
          </h1>
          <p className="mt-4 text-cream-300/50 text-sm max-w-sm">
            Descubre toda nuestra colección de moda femenina
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          search={search}
          onSearchChange={setSearch}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-cream-200 animate-pulse"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <>
            <p className="text-[10px] tracking-widest uppercase text-ink/30 mb-6">
              {visible.length} prenda{visible.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start justify-center py-24 space-y-5">
            <div className="w-8 h-px bg-champagne" />
            <h3
              className="text-2xl font-light text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Sin resultados
            </h3>
            <p className="text-sm text-ink/40 max-w-xs">
              Intenta con otro término o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setPriceRange("all");
              }}
              className="text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-champagne-dark transition-colors duration-300 border-b border-champagne/40 pb-0.5"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
