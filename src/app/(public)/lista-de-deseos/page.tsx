"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { addItem, openCart } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setAllProducts(data.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const products = ids
    .map((id) => allProducts.find((p) => p.id === id && p.visible))
    .filter(Boolean) as Product[];

  return (
    <div className="pt-16 min-h-[100dvh] bg-cream-100">

      {/* Header */}
      <div className="bg-espresso py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-5">
            Lumière Boutique
          </p>
          <h1
            className="text-4xl lg:text-6xl font-light text-cream-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Lista de deseos
          </h1>
          {!loading && products.length > 0 && (
            <p className="mt-4 text-cream-300/50 text-sm">
              {products.length} {products.length === 1 ? "prenda guardada" : "prendas guardadas"}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-cream-200 animate-pulse" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-start justify-center py-24 space-y-5">
            <div className="w-8 h-px bg-champagne" />
            <h2
              className="text-2xl font-light text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Tu lista está vacía
            </h2>
            <p className="text-sm text-ink/40 max-w-xs leading-relaxed">
              Toca el corazón en cualquier prenda para guardarla aquí y volver a verla cuando quieras.
            </p>
            <Link
              href="/tienda"
              className="text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-champagne-dark transition-colors duration-300 border-b border-champagne/40 pb-0.5"
            >
              Explorar tienda
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const needsDetail = !!(product.variants?.length || product.sizes?.length);
              return (
                <div key={product.id} className="group relative bg-cream-100">
                  <Link href={`/producto/${product.id}`} className="block">
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-cream-200" />
                      )}
                      <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors duration-500" />

                      {/* Wishlist remove */}
                      <WishlistButton
                        productId={product.id}
                        className="absolute top-3 right-3 w-8 h-8 bg-cream-100/80 hover:bg-cream-100 backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
                        iconClassName="w-4 h-4"
                      />

                      {/* Hover action */}
                      <div
                        className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-espresso/90 backdrop-blur-sm"
                        style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!needsDetail) { addItem(product); openCart(); }
                          }}
                          className="w-full py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-cream-100 hover:text-champagne transition-colors duration-300"
                        >
                          {needsDetail ? "Ver detalles" : "Agregar al carrito"}
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="pt-3 pb-4 px-0.5 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-ink leading-snug flex-1">
                          {product.name}
                        </h3>
                        <span
                          className="text-sm font-semibold text-champagne-dark shrink-0"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                        >
                          ${product.price.toLocaleString("es-MX")}
                        </span>
                      </div>
                      {product.description && (
                        <p className="text-[11px] text-ink/50 line-clamp-1 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
