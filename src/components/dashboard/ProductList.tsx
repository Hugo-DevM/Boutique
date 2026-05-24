"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, CATEGORY_LABELS } from "@/types";
import ConfirmDialog from "./ConfirmDialog";

function StockControls({ product, onRefresh }: { product: Product; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [localStock, setLocalStock] = useState(product.stock);

  if (localStock === undefined) {
    return <span className="text-[9px] tracking-[0.14em] uppercase text-ink/20">—</span>;
  }

  const adjust = async (delta: number) => {
    const newStock = Math.max(0, localStock + delta);
    setLocalStock(newStock); // optimistic
    setLoading(true);
    try {
      const password = sessionStorage.getItem("lumiere_password") ?? "";
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, delta, password }),
      });
      onRefresh();
    } catch {
      setLocalStock(localStock); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => adjust(-1)}
        disabled={loading || localStock === 0}
        className="w-5 h-5 border border-cream-300 text-ink/40 hover:border-ink hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center text-xs leading-none"
        title="Venta confirmada (-1)"
      >
        −
      </button>
      <span className={`text-[10px] font-semibold tracking-[0.12em] w-8 text-center tabular-nums ${
        localStock === 0
          ? "text-red-400"
          : localStock <= 3
          ? "text-amber-500"
          : localStock <= 5
          ? "text-champagne-dark"
          : "text-green-600"
      }`}>
        {localStock === 0 ? "—" : localStock}
      </span>
      <button
        onClick={() => adjust(+1)}
        disabled={loading}
        className="w-5 h-5 border border-cream-300 text-ink/40 hover:border-ink hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center text-xs leading-none"
        title="Agregar unidad (+1)"
      >
        +
      </button>
    </div>
  );
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

export default function ProductList({ products, onEdit, onRefresh }: ProductListProps) {
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const getPassword = () => sessionStorage.getItem("lumiere_password") ?? "";

  const handleToggleVisible = async (product: Product) => {
    const password = getPassword();
    if (!password) return;
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, product: { ...product, visible: !product.visible } }),
    });
    if (res.ok) onRefresh();
    else alert("Error al actualizar. Vuelve a iniciar sesión.");
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
    if (res.ok) onRefresh();
    else alert("Error al eliminar. Vuelve a iniciar sesión.");
  };

  if (products.length === 0) {
    return (
      <div className="py-20 border border-cream-300/60 flex flex-col items-start px-8 space-y-4">
        <div className="w-8 h-px bg-champagne" />
        <p className="text-sm text-ink/40">No hay prendas en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="border border-cream-300/60 overflow-hidden">
      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-cream-300/60 bg-cream-200">
        {["Producto", "Categoría", "Precio", "Stock", "Estado", ""].map((h) => (
          <span key={h} className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/35">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-cream-300/40">
        {products.map((product) => (
          <div
            key={product.id}
            className={`grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 lg:gap-4 px-6 py-4 items-center hover:bg-cream-200/50 transition-colors duration-200 ${
              !product.visible ? "opacity-50" : ""
            }`}
          >
            {/* Producto */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-12 overflow-hidden bg-cream-200 shrink-0">
                {product.image ? (
                  <div className="relative w-full h-full">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-cream-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {product.name}
                  {product.featured && (
                    <span className="ml-1.5 text-[10px] tracking-widest text-champagne uppercase">Dest.</span>
                  )}
                </p>
                {product.badge && (
                  <span className="text-[9px] tracking-[0.14em] uppercase text-ink/35">{product.badge}</span>
                )}
              </div>
            </div>

            {/* Categoría */}
            <span className="text-xs text-ink/50 truncate">
              {CATEGORY_LABELS[product.category]}
            </span>

            {/* Precio */}
            <span
              className="text-sm font-medium text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ${product.price.toLocaleString("es-MX")}
            </span>

            {/* Stock */}
            <StockControls product={product} onRefresh={onRefresh} />

            {/* Estado */}
            <button
              onClick={() => handleToggleVisible(product)}
              className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.14em] uppercase transition-colors duration-200 w-fit"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.visible ? "bg-green-500" : "bg-ink/20"
                }`}
              />
              <span className={product.visible ? "text-green-700" : "text-ink/35"}>
                {product.visible ? "Visible" : "Oculto"}
              </span>
            </button>

            {/* Acciones */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-ink/25 hover:text-ink transition-colors duration-200"
                aria-label="Editar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => setPendingDelete(product)}
                className="p-2 text-ink/25 hover:text-red-400 transition-colors duration-200"
                aria-label="Eliminar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
