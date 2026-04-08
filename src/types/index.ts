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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  visible: boolean;
  featured?: boolean;
  badge?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
