"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface RecentlyViewedProps {
  products: Product[];
}

export default function RecentlyViewed({ products }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-cream-300/60 py-14">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Heading */}
        <div className="flex items-baseline justify-between mb-8">
          <div className="space-y-1">
            <p className="text-[9px] tracking-[0.26em] uppercase text-champagne">Historial</p>
            <h2
              className="text-2xl font-light text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Vistos recientemente
            </h2>
          </div>
          <span className="text-[10px] tracking-widest uppercase text-ink/25">
            {products.length} {products.length === 1 ? "prenda" : "prendas"}
          </span>
        </div>

        {/* Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/producto/${product.id}`}
              className="group shrink-0 snap-start w-36 sm:w-44"
            >
              {/* Image */}
              <div
                className="relative overflow-hidden bg-cream-200 mb-2.5"
                style={{ aspectRatio: "3/4" }}
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-cream-200" />
                )}
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors duration-500" />
              </div>

              {/* Info */}
              <p className="text-xs font-medium text-ink leading-snug line-clamp-2 group-hover:text-champagne-dark transition-colors duration-200">
                {product.name}
              </p>
              <p
                className="text-sm text-champagne-dark mt-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${product.price.toLocaleString("es-MX")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
