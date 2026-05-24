"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/dashboard/ProductForm";
import ProductList from "@/components/dashboard/ProductList";
import { Product } from "@/types";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("lumiere_auth");
    sessionStorage.removeItem("lumiere_password");
    router.push("/dashboard/login");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSaved = () => {
    handleFormClose();
    fetchProducts();
  };

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const FILTERS = [
    { key: "all", label: "Todos" },
    { key: "sale", label: "Ofertas" },
    { key: "ultimas_piezas", label: "Últimas Piezas" },
    { key: "mas_vendidos", label: "Más Vendidos" },
    { key: "menos_499", label: "Menos $499" },
  ];

  const stats = [
    { label: "Total", value: products.length },
    { label: "Visibles", value: products.filter((p) => p.visible).length },
    { label: "Destacadas", value: products.filter((p) => p.featured).length },
    { label: "Ocultas", value: products.filter((p) => !p.visible).length },
  ];

  return (
    <div className="min-h-[100dvh] bg-cream-100">

      {/* Header */}
      <header className="bg-cream-100 border-b border-cream-300/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <span
            className="text-base font-medium tracking-[0.12em] text-ink"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            LUMIÈRE
          </span>
          <span className="text-[10px] tracking-[0.18em] uppercase text-ink/30 ml-3">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-ink/50 hover:text-ink transition-colors duration-200"
          >
            Ver tienda
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <button
            onClick={handleLogout}
            className="text-[10px] tracking-[0.14em] uppercase text-ink/30 hover:text-ink transition-colors duration-200"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-cream-300/50">
          {stats.map((s) => (
            <div key={s.label} className="bg-cream-100 px-6 py-5">
              <div
                className="text-3xl font-light text-ink"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.value}
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-ink/35 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-px bg-cream-300/50">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveCategory(f.key)}
                className={`px-4 py-2 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors duration-200 ${
                  activeCategory === f.key
                    ? "bg-espresso text-cream-100"
                    : "bg-cream-100 text-ink/45 hover:bg-cream-200 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-champagne hover:bg-champagne-dark text-espresso px-5 py-2.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva prenda
          </button>
        </div>

        {/* Product list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-cream-200 animate-pulse" style={{ height: 260 }} />
            ))}
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onEdit={handleEdit}
            onRefresh={fetchProducts}
          />
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
