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
    emoji: "🔥",
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-600",
  },
  {
    key: "ultimas_piezas",
    label: "Últimas Piezas",
    desc: "Unidades limitadas, no te quedes sin la tuya",
    emoji: "⏳",
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-600",
  },
  {
    key: "mas_vendidos",
    label: "Más Vendidos",
    desc: "Lo que nuestras clientas más aman",
    emoji: "⭐",
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-600",
  },
  {
    key: "menos_499",
    label: "Menos de $499",
    desc: "Moda de calidad al mejor precio",
    emoji: "💸",
    bg: "bg-violet-50",
    border: "border-violet-100",
    text: "text-violet-600",
  },
];

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProductsFromGitHub>>["products"] =
    [];

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

      {/* ── Categories ───────────────────────────────────────────── */}
      <section id="categorias" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-violet-500 uppercase tracking-widest mb-3">
              Explora
            </p>
            <h2
              className="text-4xl lg:text-5xl font-semibold text-gray-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Nuestras Categorías
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto">
              Encuentra exactamente lo que buscas para cada ocasión
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/tienda?categoria=${cat.key}`}
                className={`group p-6 rounded-2xl border-2 ${cat.bg} ${cat.border} hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`text-4xl mb-4 w-14 h-14 rounded-xl ${cat.bg} border ${cat.border} flex items-center justify-center`}
                >
                  {cat.emoji}
                </div>
                <h3
                  className={`text-lg font-semibold ${cat.text} mb-1`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {cat.label}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {cat.desc}
                </p>
                <div
                  className={`mt-4 flex items-center gap-1 text-xs font-medium ${cat.text}`}
                >
                  Ver todo
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-violet-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-sm font-semibold text-violet-500 uppercase tracking-widest mb-2">
                  Selección especial
                </p>
                <h2
                  className="text-4xl lg:text-5xl font-semibold text-gray-900"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Prendas Destacadas
                </h2>
              </div>
              <Link
                href="/tienda"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1 shrink-0"
              >
                Ver todo el catálogo →
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

      {/* ── About ─────────────────────────────────────────────────── */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Images grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=530&fit=crop"
                    alt="Moda femenina Lumière"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=400&fit=crop"
                    alt="Boutique Lumière"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative rounded-2xl overflow-hidden aspect-square shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1520975922284-9f9f56f0b5c3?w=400&h=400&fit=crop"
                    alt="Ropa de moda"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
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
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold text-violet-500 uppercase tracking-widest mb-3">
                  Nuestra historia
                </p>
                <h2
                  className="text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Moda con{" "}
                  <span className="text-violet-600 italic">
                    elegancia y actitud
                  </span>
                </h2>
              </div>

              <p className="text-gray-500 leading-relaxed">
                Somos una boutique dedicada a ofrecer moda femenina sofisticada,
                actual y accesible en el corazón de Puerto Vallarta.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Cada prenda es cuidadosamente seleccionada pensando en mujeres
                seguras, auténticas y con estilo propio.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "👗", label: "Tendencia", sub: "Última moda" },
                  { icon: "✨", label: "Calidad", sub: "Prendas selectas" },
                  { icon: "💖", label: "Atención", sub: "Personalizada" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="text-center p-4 bg-violet-50 rounded-2xl border border-violet-100"
                  >
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {f.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{f.sub}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-violet-200"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Products Preview ──────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-violet-500 uppercase tracking-widest mb-3">
                Catálogo
              </p>
              <h2
                className="text-4xl lg:text-5xl font-semibold text-gray-900"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Toda la Colección
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 border-2 border-violet-200 text-violet-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 px-8 py-4 rounded-full font-semibold transition-all duration-200"
              >
                Ver toda la colección
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
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WhatsApp CTA ──────────────────────────────────────────── */}
      <section className="py-16 bg-violet-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2
            className="text-3xl lg:text-4xl font-semibold text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-violet-200">
            Escríbenos por WhatsApp y te atendemos al instante
          </p>
          <a
            href="https://wa.me/523222151711"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chatear ahora
          </a>
        </div>
      </section>
    </>
  );
}
