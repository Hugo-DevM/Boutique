"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 pt-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-50 rounded-full opacity-30 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-5 py-2 rounded-full text-sm font-medium border border-violet-200">
              <span>✨</span>
              <span>Nueva colección disponible</span>
            </div>

            {/* Headline */}
            <h1 className="leading-tight">
              <span
                className="block text-5xl lg:text-6xl xl:text-7xl text-gray-800 font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Descubre tu
              </span>
              <span
                className="block text-5xl lg:text-6xl xl:text-7xl text-violet-600 font-bold italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Estilo Único
              </span>
              <span
                className="block text-5xl lg:text-6xl xl:text-7xl text-gray-800 font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                En Puerto Vallarta
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Prendas sofisticadas y modernas que realzan tu personalidad en
              cada ocasión especial.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5"
              >
                Ver Colección
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
              <Link
                href="/#nosotros"
                className="inline-flex items-center gap-2 border-2 border-violet-200 text-violet-700 hover:bg-violet-50 px-8 py-4 rounded-full font-semibold transition-all duration-200"
              >
                Conoce más
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div>
                <div
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  200+
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Prendas disponibles
                </div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  1,500+
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Clientas felices
                </div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  5 ★
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Calificación promedio
                </div>
              </div>
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-violet-200">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop"
                alt="Lumière Boutique — Moda femenina en Puerto Vallarta"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent" />
            </div>

            {/* Floating card — shipping */}
            <div className="absolute -left-4 lg:-left-8 top-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100">
              <span className="text-2xl">🚚</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Envíos rápidos
                </div>
                <div className="text-xs text-gray-400">A toda la ciudad</div>
              </div>
            </div>

            {/* Floating card — payments */}
            <div className="absolute -right-4 lg:-right-8 bottom-1/4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100">
              <span className="text-2xl">💳</span>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Pagos seguros
                </div>
                <div className="text-xs text-gray-400">
                  Tarjeta y transferencia
                </div>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="absolute -z-10 w-full max-w-md aspect-square rounded-3xl border-2 border-violet-100 top-4 left-4 lg:left-auto lg:right-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
