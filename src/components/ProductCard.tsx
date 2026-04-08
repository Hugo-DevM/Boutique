"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, CATEGORY_LABELS } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

function getBadgeColor(badge: string): string {
  const b = badge.toLowerCase();
  if (b.includes("sale") || b.includes("oferta") || b.includes("descuento"))
    return "bg-red-500 text-white";
  if (b.includes("nuevo") || b.includes("new"))
    return "bg-violet-600 text-white";
  if (b.includes("último") || b.includes("agotando"))
    return "bg-orange-500 text-white";
  if (b.includes("popular") || b.includes("vendido") || b.includes("top"))
    return "bg-amber-500 text-white";
  return "bg-violet-600 text-white";
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const hasVariants = product.variants && product.variants.length > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasVariants) {
      addItem(product);
    }
    // if has variants, the Link will navigate to detail page
  };

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 hover:border-violet-100"
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-violet-50 flex items-center justify-center text-5xl text-violet-200">
            👗
          </div>
        )}

        {/* Badge top-left */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${getBadgeColor(product.badge)}`}
          >
            {product.badge}
          </span>
        )}

        {/* Multiple images indicator */}
        {product.images && product.images.length > 0 && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            +{product.images.length + 1} fotos
          </span>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category pill bottom-right */}
        <span className="absolute bottom-3 right-3 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full shadow-sm">
          {CATEGORY_LABELS[product.category]}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-snug">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Color dots preview */}
        {hasVariants && (
          <div className="flex items-center gap-1.5">
            {product.variants!.slice(0, 5).map((v) => (
              <span
                key={v.colorHex}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                style={{ backgroundColor: v.colorHex }}
                title={v.color}
              />
            ))}
            {product.variants!.length > 5 && (
              <span className="text-xs text-gray-400">
                +{product.variants!.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xl font-bold text-violet-600"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ${product.price.toLocaleString("es-MX")}
          </span>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors shadow-sm shadow-violet-200 whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            {hasVariants ? "Ver detalles" : "Agregar"}
          </button>
        </div>
      </div>
    </Link>
  );
}
