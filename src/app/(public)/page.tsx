import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { getProductsFromGitHub } from "@/lib/github";

export const revalidate = 60;

const CATEGORIES = [
  {
    key: "sale",
    label: "Ofertas / Sale",
    desc: "Las mejores piezas a precios irresistibles",
    index: "01",
  },
  {
    key: "ultimas_piezas",
    label: "Últimas Piezas",
    desc: "Unidades limitadas, no te quedes sin la tuya",
    index: "02",
  },
  {
    key: "mas_vendidos",
    label: "Más Vendidos",
    desc: "Lo que nuestras clientas más aman",
    index: "03",
  },
  {
    key: "menos_499",
    label: "Menos de $499",
    desc: "Moda de calidad al mejor precio",
    index: "04",
  },
];

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProductsFromGitHub>>["products"] = [];

  try {
    const result = await getProductsFromGitHub();
    products = result.products;
  } catch {
    products = [];
  }

  const visible = products.filter((p) => p.visible);
  const featured = visible.filter((p) => p.featured).slice(0, 4);
  const recent = visible.slice(0, 8);

  return (
    <>
      <Hero />

      {/* ── Categories ─────────────────────────────────────────────── */}
      <section id="categorias" className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-4">
              Explora
            </p>
            <h2
              className="text-4xl lg:text-5xl font-light text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Nuestras Categorías
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream-300/50">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/tienda?categoria=${cat.key}`}
                className="group bg-cream-100 hover:bg-cream-200 p-8 transition-colors duration-500 flex flex-col justify-between min-h-[220px]"
              >
                <span className="text-[10px] tracking-[0.2em] text-ink/25 font-medium">
                  {cat.index}
                </span>
                <div className="space-y-2 mt-8">
                  <h3
                    className="text-xl font-medium text-ink leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem" }}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-xs text-ink/50 leading-relaxed">{cat.desc}</p>
                  <div className="flex items-center gap-2 pt-3">
                    <span className="text-[10px] tracking-[0.18em] uppercase text-champagne">
                      Ver todo
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3 text-champagne transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-24 bg-cream-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-4">
                  Selección especial
                </p>
                <h2
                  className="text-4xl lg:text-5xl font-light text-ink"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Prendas Destacadas
                </h2>
              </div>
              <Link
                href="/tienda"
                className="text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-champagne-dark transition-colors duration-300 border-b border-champagne/40 pb-0.5 shrink-0"
              >
                Ver catálogo completo
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About ──────────────────────────────────────────────────── */}
      <section id="nosotros" className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Images — editorial staggered grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3 pt-10">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=530&fit=crop"
                    alt="Moda femenina Lumière"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=400&fit=crop"
                    alt="Boutique Lumière"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop"
                    alt="Ropa de moda"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=530&fit=crop"
                    alt="Tendencias Lumière"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 lg:pl-8">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-5">
                  Nuestra historia
                </p>
                <h2
                  className="text-4xl lg:text-5xl font-light text-ink leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Moda con{" "}
                  <span className="italic text-champagne-dark">
                    elegancia y actitud
                  </span>
                </h2>
              </div>

              <div className="space-y-4 text-sm text-ink/60 leading-relaxed max-w-md">
                <p>
                  Somos una boutique dedicada a ofrecer moda femenina sofisticada,
                  actual y accesible en el corazón de Puerto Vallarta.
                </p>
                <p>
                  Cada prenda es cuidadosamente seleccionada pensando en mujeres
                  seguras, auténticas y con estilo propio.
                </p>
              </div>

              {/* Values — minimal grid */}
              <div className="grid grid-cols-3 gap-px bg-cream-300/60">
                {[
                  { label: "Tendencia", sub: "Última moda" },
                  { label: "Calidad", sub: "Prendas selectas" },
                  { label: "Atención", sub: "Personalizada" },
                ].map((f) => (
                  <div key={f.label} className="bg-cream-100 p-5">
                    <div
                      className="text-base font-medium text-ink mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {f.label}
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-ink/35">{f.sub}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/contacto"
                className="inline-flex items-center gap-3 bg-champagne hover:bg-champagne-dark text-espresso px-7 py-3.5 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Products Preview ───────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="py-24 bg-cream-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-4">
                  Catálogo
                </p>
                <h2
                  className="text-4xl lg:text-5xl font-light text-ink"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Toda la Colección
                </h2>
              </div>
              <Link
                href="/tienda"
                className="text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-champagne-dark transition-colors duration-300 border-b border-champagne/40 pb-0.5 shrink-0"
              >
                Ver todo
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WhatsApp CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-espresso">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <p className="text-[10px] tracking-[0.28em] uppercase text-champagne">
            Atención directa
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-cream-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-sm text-cream-300/50 max-w-md mx-auto">
            Escríbenos por WhatsApp y te atendemos al instante.
          </p>
          <a
            href="https://wa.me/523222151711"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-champagne hover:bg-champagne-dark text-espresso px-8 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chatear ahora
          </a>
        </div>
      </section>
    </>
  );
}
