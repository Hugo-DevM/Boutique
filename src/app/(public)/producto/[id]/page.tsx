import type { Metadata } from "next";
import { getProductById } from "@/lib/products";
import ProductPageClient from "@/components/ProductPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumiereboutique.mx";
const SITE_NAME = "Lumière Boutique";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: `Producto no encontrado | ${SITE_NAME}`,
    };
  }

  const title = `${product.name} | ${SITE_NAME}`;
  const description = product.description
    ? `${product.description} — $${product.price.toLocaleString("es-MX")} MXN. Disponible en Lumière Boutique, Puerto Vallarta.`
    : `${product.name} — $${product.price.toLocaleString("es-MX")} MXN. Moda femenina en Lumière Boutique, Puerto Vallarta.`;
  const url = `${SITE_URL}/producto/${id}`;
  const image = product.image ?? `${SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "es_MX",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ProductPage() {
  return <ProductPageClient />;
}
