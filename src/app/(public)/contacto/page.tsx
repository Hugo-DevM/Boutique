export default function ContactoPage() {
  return (
    <div className="pt-16 min-h-[100dvh] bg-cream-100">
      {/* Header */}
      <div className="bg-espresso py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-5">
            Estamos aquí para ti
          </p>
          <h1
            className="text-4xl lg:text-6xl font-light text-cream-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Contáctanos
          </h1>
          <p className="mt-4 text-cream-300/50 text-sm max-w-sm">
            Escríbenos por WhatsApp o visítanos en Puerto Vallarta
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Info */}
          <div className="space-y-12">
            <div>
              <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-champagne mb-6">
                Información
              </p>
              <h2
                className="text-3xl lg:text-4xl font-light text-ink"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Información de contacto
              </h2>
            </div>

            <div className="space-y-0 divide-y divide-cream-300/60">
              {[
                {
                  label: "Ubicación",
                  lines: ["Puerto Vallarta, Jalisco", "México"],
                },
                {
                  label: "WhatsApp",
                  lines: ["322 215 1711"],
                  href: "https://wa.me/523222151711",
                },
                {
                  label: "Horario",
                  lines: ["Lunes a Domingo — 9:00 am a 8:00 pm"],
                },
              ].map((item) => (
                <div key={item.label} className="py-6 grid grid-cols-3 gap-4">
                  <p className="text-[10px] tracking-[0.18em] uppercase text-ink/35 pt-0.5">
                    {item.label}
                  </p>
                  <div className="col-span-2">
                    {item.lines.map((line) =>
                      item.href ? (
                        <a
                          key={line}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-champagne hover:text-champagne-dark transition-colors duration-300"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={line} className="text-sm text-ink/70">
                          {line}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="pt-4">
              <p className="text-sm text-ink/50 mb-6 max-w-xs leading-relaxed">
                La forma más rápida de resolver tus dudas o hacer un pedido directamente.
              </p>
              <a
                href="https://wa.me/523222151711"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-champagne hover:bg-champagne-dark text-espresso px-7 py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Abrir WhatsApp
              </a>
            </div>
          </div>

          {/* Visual side — editorial */}
          <div className="hidden lg:flex flex-col gap-px bg-cream-300/50">
            {/* Brand block */}
            <div className="flex-1 bg-cream-200 flex flex-col justify-between p-10">
              <p className="text-[10px] tracking-[0.22em] uppercase text-ink/30">
                Boutique
              </p>
              <div>
                <span
                  className="block text-5xl font-light text-ink mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  LUMIÈRE
                </span>
                <p className="text-xs text-ink/40 tracking-widest uppercase">
                  Puerto Vallarta, México
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="grid grid-cols-2 gap-px bg-cream-300/50">
              {[
                { label: "Envíos rápidos", sub: "A toda la ciudad" },
                { label: "Pago seguro", sub: "Tarjeta y transferencia" },
              ].map((item) => (
                <div key={item.label} className="bg-cream-100 p-8">
                  <div className="w-5 h-px bg-champagne mb-6" />
                  <p className="text-sm font-medium text-ink mb-1">{item.label}</p>
                  <p className="text-[10px] tracking-widest uppercase text-ink/35">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
