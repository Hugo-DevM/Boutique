"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Product, Category } from "@/types";

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | "all">(
    "all"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Read ?categoria= from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria") as Category | null;
    if (cat) setActiveCategory(cat);
  }, []);

  const visible = products
    .filter((p) => p.visible)
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-violet-200 text-sm uppercase tracking-widest font-medium mb-3">
            Lumière Boutique
          </p>
          <h1
            className="text-4xl lg:text-5xl font-semibold text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Nuestra Tienda
          </h1>
          <p className="text-violet-200 max-w-md mx-auto">
            Descubre toda nuestra colección de moda femenina
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {visible.length} prenda{visible.length !== 1 ? "s" : ""}{" "}
              encontrada{visible.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <span className="text-6xl">👗</span>
            <h3 className="text-lg font-semibold text-gray-700">
              No encontramos prendas
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Intenta con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="text-violet-600 text-sm font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
