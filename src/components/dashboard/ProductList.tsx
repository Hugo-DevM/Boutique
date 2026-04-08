"use client";

import Image from "next/image";
import { Product, CATEGORY_LABELS, CATEGORY_ICONS } from "@/types";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export default function ProductList({
  products,
  onEdit,
  onRefresh,
}: ProductListProps) {
  const getPassword = () => sessionStorage.getItem("lumiere_password") ?? "";

  const handleToggleVisible = async (product: Product) => {
    const password = getPassword();
    if (!password) return;

    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        product: { ...product, visible: !product.visible },
      }),
    });

    if (res.ok) {
      onRefresh();
    } else {
      alert("Error al actualizar. Vuelve a iniciar sesión.");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const password = getPassword();
    if (!password) return;

    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id: product.id }),
    });

    if (res.ok) {
      onRefresh();
    } else {
      alert("Error al eliminar. Vuelve a iniciar sesión.");
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <span className="text-5xl">👗</span>
        <p className="mt-4 text-gray-400 text-sm">No hay prendas en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className={`bg-white rounded-xl border overflow-hidden transition-all ${
            product.visible
              ? "border-gray-100 hover:border-violet-200 hover:shadow-md"
              : "border-gray-100 opacity-60"
          }`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] bg-violet-50">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-3xl text-violet-200">
                👗
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {!product.visible && (
                <span className="text-xs bg-gray-700/80 text-white px-2 py-0.5 rounded-full">
                  Oculto
                </span>
              )}
              {product.featured && (
                <span className="text-xs bg-amber-400/90 text-white px-2 py-0.5 rounded-full">
                  ⭐ Destacado
                </span>
              )}
              {product.badge && (
                <span className="text-xs bg-violet-600/90 text-white px-2 py-0.5 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 flex-1">
                {product.name}
              </h3>
              <span className="text-xs text-gray-400 shrink-0">
                {CATEGORY_ICONS[product.category]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-base font-bold text-violet-600"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${product.price.toLocaleString("es-MX")}
              </span>
              <span className="text-xs text-gray-400">
                {CATEGORY_LABELS[product.category]}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 text-xs font-medium text-violet-600 border border-violet-200 hover:bg-violet-50 py-1.5 rounded-lg transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleToggleVisible(product)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors border ${
                  product.visible
                    ? "text-gray-500 border-gray-200 hover:bg-gray-50"
                    : "text-green-600 border-green-200 hover:bg-green-50"
                }`}
              >
                {product.visible ? "Ocultar" : "Mostrar"}
              </button>
              <button
                onClick={() => handleDelete(product)}
                className="w-8 h-8 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center border border-transparent hover:border-red-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
