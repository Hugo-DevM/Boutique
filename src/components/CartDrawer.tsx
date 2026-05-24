"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  } = useCart();

  const handleWhatsApp = () => {
    if (items.length === 0) return;

    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "523222151711";

    // Order number: LM-YYMMDD-XXXX
    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    const orderNumber = `LM-${datePart}-${rand}`;

    const divider = "―――――――――――――――――――";

    const lines = items.map((i) => {
      const subtotal = i.product.price * i.quantity;
      const attrs: string[] = [];
      if (i.selectedColor) attrs.push(`Color: ${i.selectedColor}`);
      if (i.selectedSize)  attrs.push(`Talla: ${i.selectedSize}`);

      return [
        `*${i.quantity}x ${i.product.name}*`,
        attrs.length ? `   ${attrs.join(" · ")}` : "",
        `   $${subtotal.toLocaleString("es-MX")} MXN`,
      ].filter(Boolean).join("\n");
    });

    const message = [
      `Hola, me gustaría hacer el siguiente pedido:`,
      ``,
      `*Pedido ${orderNumber}*`,
      divider,
      lines.join("\n\n"),
      divider,
      `*Total: $${total.toLocaleString("es-MX")} MXN*`,
      ``,
      `Quedo en espera de confirmación.`,
    ].join("\n");

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-espresso/50 z-40 backdrop-blur-[2px]"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-cream-100 z-50 flex flex-col transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-300/60">
          <div className="flex items-baseline gap-3">
            <h2
              className="text-base font-medium tracking-[0.1em] text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
            >
              Carrito
            </h2>
            {itemCount > 0 && (
              <span className="text-[10px] tracking-widest text-ink/40 font-medium">
                {itemCount} {itemCount === 1 ? "pieza" : "piezas"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-ink/30 hover:text-ink transition-colors duration-200"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-start justify-center h-full space-y-5">
              <div className="w-8 h-px bg-champagne" />
              <p className="text-sm text-ink/40 leading-relaxed">
                Tu carrito está vacío.<br />Agrega prendas para comenzar.
              </p>
              <Link
                href="/tienda"
                onClick={closeCart}
                className="text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-champagne-dark transition-colors duration-300 border-b border-champagne/40 pb-0.5"
              >
                Explorar tienda
              </Link>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-cream-300/60">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4 py-5">
                  {/* Image */}
                  <div
                    className="relative shrink-0 overflow-hidden bg-cream-200"
                    style={{ width: 64, height: 80 }}
                  >
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-cream-300" />
                    )}
                    {item.selectedColor && (() => {
                      const variant = item.product.variants?.find(
                        (v) => v.color === item.selectedColor
                      );
                      return variant ? (
                        <span
                          className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white/60"
                          style={{ backgroundColor: variant.colorHex }}
                          title={variant.color}
                        />
                      ) : null;
                    })()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-sm text-ink leading-snug line-clamp-2 font-medium">
                      {item.product.name}
                    </p>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-[10px] tracking-widest uppercase text-ink/35 flex gap-2">
                        {item.selectedSize && <span>Talla {item.selectedSize}</span>}
                        {item.selectedColor && <span>{item.selectedColor}</span>}
                      </p>
                    )}
                    <p
                      className="text-base text-champagne-dark font-medium"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      ${item.product.price.toLocaleString("es-MX")}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)
                          }
                          className="w-6 h-6 border border-cream-300 text-ink/50 hover:border-ink hover:text-ink transition-colors duration-200 flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm text-ink w-4 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)
                          }
                          className="w-6 h-6 border border-cream-300 text-ink/50 hover:border-ink hover:text-ink transition-colors duration-200 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-[10px] tracking-widest uppercase text-ink/25 hover:text-ink/60 transition-colors duration-200"
                        aria-label="Eliminar"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-cream-300/60 space-y-4 bg-cream-100">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] tracking-[0.18em] uppercase text-ink/40">Total</span>
              <span
                className="text-xl font-medium text-ink"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${total.toLocaleString("es-MX")} MXN
              </span>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 bg-champagne hover:bg-champagne-dark text-espresso py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </button>

            <button
              onClick={clearCart}
              className="w-full text-[10px] tracking-widest uppercase text-ink/20 hover:text-ink/50 transition-colors duration-200 py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
