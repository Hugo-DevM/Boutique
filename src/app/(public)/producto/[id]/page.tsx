"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product, CATEGORY_LABELS, CATEGORY_ICONS } from "@/types";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.products ?? []).find((p: Product) => p.id === id);
        if (!found) {
          router.push("/tienda");
          return;
        }
        setProduct(found);
        // pre-select first color if variants exist
        if (found.variants?.length) {
          setSelectedColor(found.variants[0].color);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  // Build full gallery: main image + extra images
  const gallery = [
    product.image,
    ...(product.images ?? []),
  ].filter(Boolean) as string[];

  const hasVariants = product.variants && product.variants.length > 0;

  const handleAddToCart = () => {
    if (hasVariants && !selectedColor) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedColor);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/tienda"
            className="hover:text-violet-600 transition-colors"
          >
            Tienda
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Gallery ─────────────────────────────────────── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-violet-50 aspect-square w-full">
              {gallery[activeIndex] ? (
                <Image
                  src={gallery[activeIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-7xl text-violet-200">
                  👗
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-semibold bg-violet-600 text-white px-3 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}

              {/* Prev / Next arrows (if multiple images) */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveIndex((i) =>
                        i === 0 ? gallery.length - 1 : i - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition-all"
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
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setActiveIndex((i) =>
                        i === gallery.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center transition-all"
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
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeIndex === i
                        ? "border-violet-500 shadow-md"
                        : "border-transparent hover:border-violet-200"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Category */}
            <div className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-100">
              <span>{CATEGORY_ICONS[product.category]}</span>
              <span>{CATEGORY_LABELS[product.category]}</span>
            </div>

            {/* Name */}
            <div>
              <h1
                className="text-4xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.name}
                {product.featured && (
                  <span className="ml-2 text-amber-400 text-3xl">★</span>
                )}
              </h1>
              {product.description && (
                <p className="mt-3 text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div
              className="text-4xl font-bold text-violet-600"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ${product.price.toLocaleString("es-MX")}
              <span className="text-base font-normal text-gray-400 ml-1">
                MXN
              </span>
            </div>

            {/* Color variants */}
            {hasVariants && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                  Color:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.variants!.map((v) => (
                    <button
                      key={v.colorHex}
                      onClick={() => setSelectedColor(v.color)}
                      title={v.color}
                      className={`w-9 h-9 rounded-full border-2 transition-all shadow-sm ${
                        selectedColor === v.color
                          ? "border-violet-600 scale-110 shadow-md"
                          : "border-white hover:scale-105 ring-1 ring-gray-200"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Cantidad</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={hasVariants ? !selectedColor : false}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 hover:-translate-y-0.5"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    ¡Agregado al carrito!
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                      />
                    </svg>
                    Agregar al carrito
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/523222151711?text=${encodeURIComponent(
                  `👗 Hola, me interesa: *${product.name}*${selectedColor ? ` (Color: ${selectedColor})` : ""} — $${product.price.toLocaleString("es-MX")} MXN`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base border-2 border-green-200 text-green-700 hover:bg-green-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Preguntar por WhatsApp
              </a>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: "🚚", text: "Envíos a toda la ciudad" },
                { icon: "💳", text: "Tarjeta y transferencia" },
                { icon: "🔄", text: "Cambios disponibles" },
                { icon: "✅", text: "Calidad garantizada" },
              ].map((p) => (
                <div
                  key={p.text}
                  className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2"
                >
                  <span>{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
