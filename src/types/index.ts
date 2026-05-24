export type Category = "sale" | "ultimas_piezas" | "mas_vendidos" | "menos_499";

export const CATEGORY_LABELS: Record<Category, string> = {
  sale: "Ofertas / Sale",
  ultimas_piezas: "Últimas Piezas",
  mas_vendidos: "Más Vendidos",
  menos_499: "Menos de $499",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  sale: "Las mejores piezas a precios irresistibles",
  ultimas_piezas: "Unidades limitadas, no te quedes sin la tuya",
  mas_vendidos: "Lo que nuestras clientas más aman",
  menos_499: "Moda de calidad al mejor precio",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  sale: "🔥",
  ultimas_piezas: "⏳",
  mas_vendidos: "⭐",
  menos_499: "💸",
};

export interface ProductVariant {
  color: string;    // e.g. "Negro"
  colorHex: string; // e.g. "#000000"
}

export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: Category;
  visible: boolean;
  featured?: boolean;
  badge?: string;
  variants?: ProductVariant[]; // variantes de color
  sizes?: string[];            // tallas disponibles e.g. ["S","M","L"]
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}
