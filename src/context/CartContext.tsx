"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  removeItem: (id: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (id: string, qty: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function sameItem(
  i: CartItem,
  id: string,
  color?: string,
  size?: string
): boolean {
  return (
    i.product.id === id &&
    (i.selectedColor ?? "") === (color ?? "") &&
    (i.selectedSize ?? "") === (size ?? "")
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lumiere_cart");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("lumiere_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (product: Product, selectedColor?: string, selectedSize?: string) => {
    setItems((prev) => {
      const exists = prev.find((i) => sameItem(i, product.id, selectedColor, selectedSize));
      if (exists) {
        return prev.map((i) =>
          sameItem(i, product.id, selectedColor, selectedSize)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, selectedColor, selectedSize }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string, selectedColor?: string, selectedSize?: string) => {
    setItems((prev) => prev.filter((i) => !sameItem(i, id, selectedColor, selectedSize)));
  };

  const updateQuantity = (id: string, qty: number, selectedColor?: string, selectedSize?: string) => {
    if (qty <= 0) { removeItem(id, selectedColor, selectedSize); return; }
    setItems((prev) =>
      prev.map((i) =>
        sameItem(i, id, selectedColor, selectedSize) ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => setItems([]);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((p) => !p),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
