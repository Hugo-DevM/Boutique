"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, CATEGORY_LABELS } from "@/types";
import { useCart } from "@/context/CartContext";
import ShareButton from "@/components/ShareButton";
import WishlistButton from "@/components/WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const hasVariants = product.variants && product.variants.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  // Si tiene tallas o colores, llevar al detalle para que la clienta seleccione
  const needsDetail = hasVariants || hasSizes;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!needsDetail) {
      addItem(product);
    }
  };

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block bg-cream-100 overflow-hidden hover:bg-cream-200 transition-colors duration-500"
    >
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
          <div className="absolute inset-0 bg-cream-200 flex items-center justify-center">
            <span className="text-4xl text-cream-300">—</span>
          </div>
        )}

        {/* Wishlist */}
        <WishlistButton
          productId={product.id}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center bg-cream-100/70 hover:bg-cream-100 backdrop-blur-sm transition-colors duration-200"
          iconClassName="w-3.5 h-3.5"
        />

        {/* Badge — minimal */}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[0.15em] uppercase bg-espresso text-cream-100 px-2.5 py-1">
            {product.badge}
          </span>
        )}

        {/* Photo count */}
        {product.images && product.images.length > 0 && (
          <span className="absolute top-3 right-3 text-[9px] tracking-widest text-cream-100/80 bg-espresso/60 px-2 py-0.5 backdrop-blur-sm">
            +{product.images.length + 1}
          </span>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-espresso/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick action on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-espresso/90 backdrop-blur-sm flex items-stretch"
          style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}>
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-cream-100 hover:text-champagne transition-colors duration-300"
          >
            {needsDetail ? "Ver detalles" : "Agregar al carrito"}
          </button>
          <ShareButton
            url={`/producto/${product.id}`}
            title={product.name}
            className="shrink-0 px-3.5 border-l border-cream-100/10 text-cream-100/50 hover:text-champagne transition-colors duration-300 flex items-center justify-center"
            iconClassName="w-3.5 h-3.5"
          />
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-4 px-0.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-medium text-ink leading-snug flex-1"
          >
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

        {/* Color dots */}
        {hasVariants && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {product.variants!.slice(0, 5).map((v) => (
              <span
                key={v.colorHex}
                className="w-3 h-3 rounded-full border border-cream-300"
                style={{ backgroundColor: v.colorHex }}
                title={v.color}
              />
            ))}
            {product.variants!.length > 5 && (
              <span className="text-[10px] text-ink/40">+{product.variants!.length - 5}</span>
            )}
          </div>
        )}

        {/* Category */}
        <p className="text-[9px] tracking-[0.18em] uppercase text-ink/30">
          {CATEGORY_LABELS[product.category]}
        </p>
      </div>
    </Link>
  );
}
