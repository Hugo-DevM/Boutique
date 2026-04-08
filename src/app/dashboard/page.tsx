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

  useEffect(() => {
    fetchProducts();
  }, []);

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
    { key: "sale", label: "🔥 Ofertas" },
    { key: "ultimas_piezas", label: "⏳ Últimas Piezas" },
    { key: "mas_vendidos", label: "⭐ Más Vendidos" },
    { key: "menos_499", label: "💸 -$499" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👗</span>
          <div>
            <h1
              className="font-semibold text-gray-900 text-lg leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Lumi<span className="text-violet-600">ère</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Panel de administración
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-400 hover:text-violet-600 transition-colors hidden sm:block"
          >
            Ver tienda →
          </a>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 px-3 py-1.5 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total prendas",
              value: products.length,
              emoji: "👗",
              color: "bg-violet-50 border-violet-100",
              text: "text-violet-700",
            },
            {
              label: "Visibles",
              value: products.filter((p) => p.visible).length,
              emoji: "👁️",
              color: "bg-green-50 border-green-100",
              text: "text-green-700",
            },
            {
              label: "Destacadas",
              value: products.filter((p) => p.featured).length,
              emoji: "⭐",
              color: "bg-amber-50 border-amber-100",
              text: "text-amber-700",
            },
            {
              label: "Ocultas",
              value: products.filter((p) => !p.visible).length,
              emoji: "🙈",
              color: "bg-gray-50 border-gray-200",
              text: "text-gray-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.color} border rounded-xl p-4`}
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div
                className={`text-2xl font-bold ${stat.text}`}
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveCategory(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === f.key
                    ? "bg-violet-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-violet-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Nueva prenda
          </button>
        </div>

        {/* Product list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
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

      {/* Product Form Modal */}
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
