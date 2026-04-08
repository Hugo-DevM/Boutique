"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, CATEGORY_LABELS, CATEGORY_ICONS } from "@/types";
import ConfirmDialog from "./ConfirmDialog";

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
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

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

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const password = getPassword();
    if (!password) { setPendingDelete(null); return; }

    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id: pendingDelete.id }),
    });

    setPendingDelete(null);
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
        <p className="mt-4 text-gray-400 text-sm">
          No hay prendas en esta categoría
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Producto
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Categoría
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Precio
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Estado
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pr-2">
          Acciones
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {products.map((product) => (
          <div
            key={product.id}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors ${
              !product.visible ? "opacity-60" : ""
            }`}
          >
            {/* Product */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-violet-50 shrink-0 border border-gray-100">
                {product.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">
                    👗
                  </div>
                )}
              </div>

              {/* Name + badge */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                  </span>
                  {product.featured && (
                    <span className="text-amber-400 text-sm">★</span>
                  )}
                </div>
                {product.badge && (
                  <span className="inline-block mt-1 text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <span className="text-sm text-gray-500">
              {CATEGORY_ICONS[product.category]}{" "}
              {CATEGORY_LABELS[product.category]}
            </span>

            {/* Price */}
            <span
              className="text-sm font-bold text-gray-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ${product.price.toLocaleString("es-MX")}
            </span>

            {/* Status */}
            <div>
              <button
                onClick={() => handleToggleVisible(product)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  product.visible
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    product.visible ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {product.visible ? "Visible" : "Oculto"}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-violet-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                aria-label="Editar"
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button
                onClick={() => setPendingDelete(product)}
                className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Eliminar"
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
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        danger
        title="Eliminar prenda"
        message={`¿Eliminar "${pendingDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
