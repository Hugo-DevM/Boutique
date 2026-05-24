"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product, CATEGORY_LABELS } from "@/types";
import { useCart } from "@/context/CartContext";
import SizeGuideModal from "@/components/SizeGuideModal";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useRecentlyViewed, resolveRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { otherIds } = useRecentlyViewed(id);
  const recentProducts = resolveRecentlyViewed(otherIds, allProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = data.products ?? [];
        const found = list.find((p: Product) => p.id === id);
        if (!found) { router.push("/tienda"); return; }
        setProduct(found);
        setAllProducts(list);
        if (found.variants?.length) setSelectedColor(found.variants[0].color);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-16 min-h-[100dvh] bg-cream-100 flex items-center justify-center">
        <div className="w-6 h-6 border border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const gallery = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const hasVariants = product.variants && product.variants.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleAddToCart = () => {
    if (hasVariants && !selectedColor) return;
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    for (let i = 0; i < quantity; i++) addItem(product, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 800);
  };

  const waText = [
    `Hola, me interesa: ${product.name}`,
    selectedColor ? `Color: ${selectedColor}` : "",
    selectedSize ? `Talla: ${selectedSize}` : "",
    `$${product.price.toLocaleString("es-MX")} MXN`,
  ].filter(Boolean).join(" — ");

  return (
    <div className="pt-16 min-h-[100dvh] bg-cream-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 lg:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase text-ink/30 mb-10">
          <Link href="/" className="hover:text-ink transition-colors duration-200">Inicio</Link>
          <span>/</span>
          <Link href="/tienda" className="hover:text-ink transition-colors duration-200">Tienda</Link>
          <span>/</span>
          <span className="text-ink/60 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Galería ───────────────────────────────────── */}
          <div className="space-y-2">
            <div className="relative overflow-hidden bg-cream-200" style={{ aspectRatio: "3/4" }}>
              {gallery[activeIndex] ? (
                <Image
                  src={gallery[activeIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-cream-200" />
              )}

              {product.badge && (
                <span className="absolute top-4 left-4 text-[9px] font-semibold tracking-[0.15em] uppercase bg-espresso text-cream-100 px-2.5 py-1">
                  {product.badge}
                </span>
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIndex((i) => (i === 0 ? gallery.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream-100/80 hover:bg-cream-100 flex items-center justify-center transition-colors duration-200"
                    aria-label="Anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-ink">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveIndex((i) => (i === gallery.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream-100/80 hover:bg-cream-100 flex items-center justify-center transition-colors duration-200"
                    aria-label="Siguiente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-ink">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative shrink-0 overflow-hidden transition-opacity duration-200 ${
                      activeIndex === i ? "opacity-100 ring-1 ring-champagne" : "opacity-50 hover:opacity-80"
                    }`}
                    style={{ width: 56, height: 72 }}
                  >
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ──────────────────────────────────────── */}
          <div className="space-y-7 lg:pt-2">

            {/* Categoría */}
            <p className="text-[10px] tracking-[0.22em] uppercase text-champagne">
              {CATEGORY_LABELS[product.category]}
              {product.featured && <span className="ml-3 text-ink/30">— Destacado</span>}
            </p>

            {/* Nombre + descripción */}
            <div className="space-y-3">
              <h1
                className="text-3xl lg:text-4xl font-light text-ink leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.name}
              </h1>
              {product.description && (
                <p className="text-sm text-ink/55 leading-relaxed max-w-sm">
                  {product.description}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="border-t border-b border-cream-300/60 py-5">
              <span
                className="text-3xl font-medium text-ink"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${product.price.toLocaleString("es-MX")}
              </span>
              <span className="text-xs text-ink/35 ml-2 tracking-widest">MXN</span>
            </div>

            {/* Tallas */}
            {hasSizes && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className={`text-[10px] tracking-[0.18em] uppercase transition-colors duration-200 ${sizeError ? "text-red-400" : "text-ink/40"}`}>
                    {sizeError ? "Selecciona una talla para continuar" : `Talla${selectedSize ? ` — ${selectedSize}` : ""}`}
                  </p>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[10px] tracking-[0.14em] uppercase text-ink/25 hover:text-champagne transition-colors duration-200 border-b border-ink/10 pb-0.5"
                  >
                    Guía de tallas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`min-w-[3rem] px-3 py-2.5 text-xs font-medium tracking-widest transition-all duration-200 border ${
                        selectedSize === size
                          ? "bg-espresso text-cream-100 border-espresso"
                          : sizeError
                          ? "border-red-300 text-ink/50 hover:border-espresso hover:text-ink"
                          : "border-cream-300 text-ink/50 hover:border-espresso hover:text-ink"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colores */}
            {hasVariants && (
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.18em] uppercase text-ink/40">
                  Color — <span className="text-ink/70">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants!.map((v) => (
                    <button
                      key={v.colorHex}
                      onClick={() => setSelectedColor(v.color)}
                      title={v.color}
                      className={`w-8 h-8 transition-all duration-200 ${
                        selectedColor === v.color
                          ? "ring-2 ring-offset-2 ring-champagne ring-offset-cream-100"
                          : "ring-1 ring-cream-300 hover:ring-ink/30"
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.18em] uppercase text-ink/40">Cantidad</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 border border-cream-300 text-ink/50 hover:border-ink hover:text-ink transition-colors duration-200 flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm tabular-nums text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 border border-cream-300 text-ink/50 hover:border-ink hover:text-ink transition-colors duration-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={hasVariants ? !selectedColor : false}
                className={`w-full flex items-center justify-center gap-2.5 py-4 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                  added
                    ? "bg-ink text-cream-100"
                    : sizeError
                    ? "bg-red-400/80 text-white"
                    : "bg-champagne hover:bg-champagne-dark text-espresso"
                }`}
              >
                {added ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Agregado
                  </>
                ) : "Agregar al carrito"}
              </button>

              <a
                href={`https://wa.me/523222151711?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 text-[10px] font-semibold tracking-[0.18em] uppercase border border-cream-300 text-ink/60 hover:border-ink hover:text-ink transition-colors duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Preguntar por WhatsApp
              </a>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-px bg-cream-300/60 pt-2">
              {[
                { label: "Envíos rápidos", sub: "A toda la ciudad" },
                { label: "Pago seguro", sub: "Tarjeta y transferencia" },
                { label: "Cambios", sub: "Disponibles" },
                { label: "Calidad", sub: "Garantizada" },
              ].map((p) => (
                <div key={p.label} className="bg-cream-100 px-4 py-4">
                  <p className="text-xs font-medium text-ink">{p.label}</p>
                  <p className="text-[10px] tracking-widest uppercase text-ink/35 mt-0.5">{p.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RecentlyViewed products={recentProducts} />

      <SizeGuideModal open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}
