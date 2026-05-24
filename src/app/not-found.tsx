import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-cream-100 flex flex-col">

      {/* Top bar */}
      <div className="px-6 py-5 border-b border-cream-300/60">
        <Link
          href="/"
          className="text-[11px] tracking-[0.28em] uppercase text-ink/40 hover:text-ink transition-colors duration-200"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Lumière
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-start justify-center px-8 sm:px-16 lg:px-24 max-w-3xl">

        {/* Eyebrow */}
        <p className="text-[9px] tracking-[0.28em] uppercase text-champagne mb-6">
          Error 404
        </p>

        {/* Headline */}
        <h1
          className="font-light text-ink leading-none mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(4rem, 12vw, 9rem)",
          }}
        >
          Página no<br />encontrada
        </h1>

        {/* Divider */}
        <div className="w-12 h-px bg-champagne mb-7" />

        {/* Message */}
        <p className="text-sm text-ink/45 leading-relaxed max-w-sm mb-10">
          La página que buscas no existe o fue movida. Explora nuestra tienda y encuentra algo que te encante.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tienda"
            className="px-8 py-3.5 bg-espresso text-cream-100 text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-espresso-50 transition-colors duration-300"
          >
            Ir a la tienda
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 border border-cream-300 text-ink/50 text-[10px] font-semibold tracking-[0.18em] uppercase hover:border-ink hover:text-ink transition-colors duration-300"
          >
            Inicio
          </Link>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="px-8 sm:px-16 lg:px-24 py-8">
        <p className="text-[9px] tracking-[0.2em] uppercase text-ink/20">
          Lumière Boutique — Puerto Vallarta
        </p>
      </div>
    </div>
  );
}
