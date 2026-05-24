"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/tienda", label: "Tienda" },
    { href: "/#categorias", label: "Categorías" },
    { href: "/#nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream-100/95 backdrop-blur-md border-b border-cream-300/60"
            : "bg-cream-100/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="shrink-0 group">
              <span
                className="text-xl font-semibold tracking-widest text-ink transition-opacity duration-300 group-hover:opacity-70"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.12em" }}
              >
                LUMIÈRE
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-9">
              {navLinks.map((link) => {
                const isActive = link.href.includes("#")
                  ? false
                  : link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
                      isActive ? "text-champagne" : "text-espresso-50 hover:text-champagne"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-champagne" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-espresso-50 hover:text-champagne transition-colors duration-300"
                aria-label="Buscar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.25}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                href="/lista-de-deseos"
                className="relative p-2.5 text-espresso-50 hover:text-champagne transition-colors duration-300"
                aria-label="Lista de deseos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-champagne text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 text-espresso-50 hover:text-champagne transition-colors duration-300"
                aria-label="Carrito de compras"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.25}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm5.625 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-champagne text-white text-[9px] rounded-full flex items-center justify-center font-semibold">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2.5 text-espresso-50 hover:text-champagne transition-colors duration-300"
                aria-label="Abrir menú"
              >
                <div className="relative w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-px bg-current transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                  <span className={`block h-px bg-current transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? "max-h-80 pb-6" : "max-h-0"}`}>
            <div className="border-t border-cream-300/60 pt-4 space-y-1">
              {navLinks.map((link, i) => {
                const isActive = link.href.includes("#")
                  ? false
                  : link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
                      isActive ? "text-champagne" : "text-espresso-50 hover:text-champagne"
                    }`}
                    style={{ transitionDelay: `${i * 40}ms` }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* Search link en mobile */}
              <button
                onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}
                className="block w-full text-left py-3 text-[11px] font-medium tracking-[0.18em] uppercase text-espresso-50 hover:text-champagne transition-colors duration-300"
              >
                Buscar
              </button>
              <Link
                href="/lista-de-deseos"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-3 text-[11px] font-medium tracking-[0.18em] uppercase text-espresso-50 hover:text-champagne transition-colors duration-300"
              >
                Lista de deseos
                {wishlistCount > 0 && (
                  <span className="text-[9px] bg-champagne text-white px-1.5 py-0.5 font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
