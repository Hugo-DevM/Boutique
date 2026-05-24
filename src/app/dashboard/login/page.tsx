"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("lumiere_auth", "authenticated");
      sessionStorage.setItem("lumiere_password", password);
      router.push("/dashboard");
    } else {
      setError("Contraseña incorrecta. Inténtalo de nuevo.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[100dvh] bg-espresso flex">
      {/* Panel izquierdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-cream-300/10">
        <span
          className="text-lg font-medium tracking-[0.14em] text-cream-100"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          LUMIÈRE
        </span>
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-champagne mb-4">
            Panel de administración
          </p>
          <p
            className="text-4xl font-light text-cream-100/80 leading-snug max-w-xs"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Gestiona tu boutique con elegancia
          </p>
        </div>
        <p className="text-[10px] tracking-widest text-cream-300/20 uppercase">
          Puerto Vallarta, México
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        {/* Logo mobile */}
        <div className="lg:hidden mb-10 text-center">
          <span
            className="text-xl font-medium tracking-[0.14em] text-cream-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            LUMIÈRE
          </span>
          <p className="text-[10px] tracking-[0.2em] uppercase text-champagne mt-2">
            Administración
          </p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-light text-cream-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Iniciar sesión
            </h1>
            <p className="text-[11px] text-cream-300/40 mt-1 tracking-wide">
              Ingresa tu contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[10px] tracking-[0.18em] uppercase text-cream-300/50"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="••••••••"
                className="w-full bg-transparent border border-cream-300/20 px-4 py-3 text-sm text-cream-100 placeholder-cream-300/20 focus:outline-none focus:border-champagne transition-colors duration-300"
              />
            </div>

            {error && (
              <p className="text-[11px] text-red-400/80 border-l-2 border-red-400/40 pl-3 py-1">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-champagne hover:bg-champagne-dark disabled:opacity-40 text-espresso py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Verificando..." : "Entrar al panel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
