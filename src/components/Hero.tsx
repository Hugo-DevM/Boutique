"use client";

import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-espresso min-h-[100dvh] pt-16 overflow-hidden flex items-center">
      {/* Subtle warm radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-champagne/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-champagne/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Editorial content */}
          <div className="space-y-10">
            {/* Eyebrow */}
            <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne">
              Nueva colección — Puerto Vallarta
            </p>

            {/* Headline */}
            <h1 className="leading-[0.9] -mt-2">
              <span
                className="block text-[clamp(3.5rem,8vw,7rem)] text-cream-100 font-light italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Descubre
              </span>
              <span
                className="block text-[clamp(3.5rem,8vw,7rem)] text-cream-100 font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                tu Estilo
              </span>
              <span
                className="block text-[clamp(3.5rem,8vw,7rem)] text-champagne font-light italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Único
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-cream-300/70 leading-relaxed max-w-md text-base font-light">
              Prendas sofisticadas y modernas que realzan tu personalidad
              en cada ocasión especial.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                href="/tienda"
                className="group inline-flex items-center gap-3 bg-champagne hover:bg-champagne-dark text-espresso px-7 py-3.5 text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300"
                style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}
              >
                Ver colección
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/#nosotros"
                className="text-[11px] font-medium tracking-[0.16em] uppercase text-cream-300/60 hover:text-cream-100 transition-colors duration-300 border-b border-cream-300/30 hover:border-cream-100 pb-0.5"
              >
                Conoce más
              </Link>
            </div>

            {/* Stats — minimal */}
            <div className="flex items-center gap-10 pt-4 border-t border-cream-300/10">
              {[
                { value: "200+", label: "Prendas" },
                { value: "1,500+", label: "Clientas" },
                { value: "5 ★", label: "Calificación" },
              ].map((stat, i) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-semibold text-cream-100"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-cream-300/50 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Editorial image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm lg:max-w-md overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&h=933&fit=crop"
                alt="Lumière Boutique — Moda femenina en Puerto Vallarta"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle dark gradient for editorial depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent" />
            </div>

            {/* Accent line decoration */}
            <div className="absolute -bottom-8 -left-4 lg:-left-10 w-px h-32 bg-champagne/40" />
            <div className="absolute -bottom-8 -left-8 lg:-left-14 w-px h-20 bg-champagne/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
