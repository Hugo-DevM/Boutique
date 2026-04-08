"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

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

    const lines = items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.product.name} — $${(
            i.product.price * i.quantity
          ).toLocaleString("es-MX")}`
      )
      .join("\n");

    const message = `👗 *¡Hola! Quiero hacer un pedido en Lumière Boutique:*\n\n${lines}\n\n*Total: $${total.toLocaleString("es-MX")} MXN*`;
    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "523222151711";
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
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Mi Carrito
            </h2>
            {itemCount > 0 && (
              <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-3">
              <span className="text-5xl">🛍️</span>
              <p className="text-gray-400 text-sm">
                Agrega prendas para comenzar
              </p>
              <button
                onClick={closeCart}
                className="text-violet-600 text-sm font-medium hover:underline mt-2"
              >
                Explorar tienda →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 bg-gray-50 rounded-xl p-3"
              >
                {/* Image */}
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-violet-50 shrink-0">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      👗
                    </div>
                  )}
                  {/* Color dot */}
                  {item.selectedColor && (() => {
                    const variant = item.product.variants?.find(
                      (v) => v.color === item.selectedColor
                    );
                    return variant ? (
                      <span
                        className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: variant.colorHex }}
                        title={variant.color}
                      />
                    ) : null;
                  })()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {item.product.name}
                  </p>
                  {item.selectedColor && (
                    <p className="text-xs text-gray-400">Color: {item.selectedColor}</p>
                  )}
                  <p className="text-sm font-bold text-violet-600">
                    ${item.product.price.toLocaleString("es-MX")}
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                        }
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                        }
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedColor)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                      aria-label="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ${total.toLocaleString("es-MX")} MXN
              </span>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-md shadow-green-100"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </button>

            <button
              onClick={clearCart}
              className="w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
