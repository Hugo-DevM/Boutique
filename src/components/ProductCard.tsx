"use client";

import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

function getBadgeColor(badge: string): string {
  const b = badge.toLowerCase();
  if (b.includes("sale") || b.includes("oferta") || b.includes("descuento")) {
    return "bg-red-500 text-white";
  }
  if (b.includes("nuevo") || b.includes("new")) {
    return "bg-violet-600 text-white";
  }
  if (b.includes("último") || b.includes("last") || b.includes("agotando")) {
    return "bg-orange-500 text-white";
  }
  if (b.includes("popular") || b.includes("vendido") || b.includes("top")) {
    return "bg-amber-500 text-white";
  }
  return "bg-gray-700 text-white";
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-violet-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl text-violet-200">
            👗
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${getBadgeColor(product.badge)}`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <button
          onClick={() => addItem(product)}
          className="absolute bottom-3 left-3 right-3 bg-white text-violet-700 font-semibold text-sm py-2.5 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-violet-600 hover:text-white shadow-lg"
        >
          + Agregar al carrito
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span
            className="text-lg font-bold text-violet-600"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ${product.price.toLocaleString("es-MX")}
          </span>
          <button
            onClick={() => addItem(product)}
            className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors shadow-sm"
            aria-label={`Agregar ${product.name} al carrito`}
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
          </button>
        </div>
      </div>
    </div>
  );
}
