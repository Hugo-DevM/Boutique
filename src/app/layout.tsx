import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumiereboutique.mx";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lumière Boutique | Moda Femenina en Puerto Vallarta",
    template: "%s | Lumière Boutique",
  },
  description:
    "Moda femenina sofisticada con estilo, elegancia y actitud para cada ocasión en Puerto Vallarta.",
  keywords:
    "boutique de ropa Puerto Vallarta, moda femenina, vestidos elegantes, ropa en tendencia Puerto Vallarta",
  openGraph: {
    type: "website",
    siteName: "Lumière Boutique",
    locale: "es_MX",
    url: SITE_URL,
    title: "Lumière Boutique | Moda Femenina en Puerto Vallarta",
    description:
      "Moda femenina sofisticada con estilo, elegancia y actitud para cada ocasión en Puerto Vallarta.",
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Lumière Boutique — Moda Femenina Puerto Vallarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumière Boutique | Moda Femenina en Puerto Vallarta",
    description:
      "Moda femenina sofisticada con estilo, elegancia y actitud para cada ocasión en Puerto Vallarta.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
