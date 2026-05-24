"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Product, Category, CATEGORY_LABELS, ProductVariant, DEFAULT_SIZES } from "@/types";

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "sale" as Category,
  badge: "",
  visible: true,
  featured: false,
};

const PRESET_COLORS = [
  { color: "Negro", colorHex: "#000000" },
  { color: "Blanco", colorHex: "#FFFFFF" },
  { color: "Rojo", colorHex: "#EF4444" },
  { color: "Rosa", colorHex: "#EC4899" },
  { color: "Lila", colorHex: "#8B5CF6" },
  { color: "Azul", colorHex: "#3B82F6" },
  { color: "Verde", colorHex: "#10B981" },
  { color: "Amarillo", colorHex: "#F59E0B" },
  { color: "Naranja", colorHex: "#F97316" },
  { color: "Café", colorHex: "#92400E" },
  { color: "Gris", colorHex: "#6B7280" },
  { color: "Beige", colorHex: "#D4B896" },
];

// Shared input class
const inputCls =
  "w-full border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-ink placeholder-ink/25 focus:outline-none focus:border-champagne transition-colors duration-200";

const labelCls = "block text-[10px] font-medium tracking-[0.16em] uppercase text-ink/40 mb-1.5";

export default function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const [productFolderId] = useState<string>(() => product?.id ?? crypto.randomUUID());

  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          description: product.description,
          price: String(product.price),
          image: product.image,
          category: product.category,
          badge: product.badge ?? "",
          visible: product.visible,
          featured: product.featured ?? false,
        }
      : EMPTY_FORM
  );

  const [localPreview, setLocalPreview] = useState<string>(product?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [extraImages, setExtraImages] = useState<string[]>(product?.images ?? []);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [customHex, setCustomHex] = useState("#000000");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("productId", productFolderId);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
      setLocalPreview(data.url);
    }
    setUploading(false);
  };

  const handleExtraUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingExtra(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("productId", productFolderId);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) { const data = await res.json(); uploaded.push(data.url); }
    }
    setExtraImages((prev) => [...prev, ...uploaded]);
    setUploadingExtra(false);
    e.target.value = "";
  };

  const removeExtraImage = (index: number) =>
    setExtraImages((prev) => prev.filter((_, i) => i !== index));

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = () => {
    const s = customSize.trim().toUpperCase();
    if (!s || sizes.includes(s)) return;
    setSizes((prev) => [...prev, s]);
    setCustomSize("");
  };

  const toggleVariant = (v: ProductVariant) => {
    setVariants((prev) => {
      const exists = prev.find((x) => x.colorHex === v.colorHex);
      return exists ? prev.filter((x) => x.colorHex !== v.colorHex) : [...prev, v];
    });
  };

  const addCustomVariant = () => {
    if (!customColor.trim()) return;
    if (!variants.find((v) => v.colorHex === customHex))
      setVariants((prev) => [...prev, { color: customColor.trim(), colorHex: customHex }]);
    setCustomColor("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const password = sessionStorage.getItem("lumiere_password");
    if (!password) { setSaving(false); setError("Sesión expirada. Vuelve a iniciar sesión."); return; }

    const res = await fetch("/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        product: {
          ...(product ?? {}),
          ...(!product && { id: productFolderId }),
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image: form.image,
          images: extraImages,
          category: form.category,
          badge: form.badge || undefined,
          visible: form.visible,
          featured: form.featured,
          variants: variants.length > 0 ? variants : undefined,
          sizes: sizes.length > 0 ? sizes : undefined,
        },
      }),
    });

    if (res.ok) { onSaved(); }
    else { const data = await res.json().catch(() => ({})); setError(data.error ?? "Error al guardar el producto."); }
    setSaving(false);
  };

  const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

  return (
    <div className="fixed inset-0 bg-espresso/60 z-50 flex items-end sm:items-center justify-center backdrop-blur-[2px]">
      <div className="bg-cream-100 w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300/60 sticky top-0 bg-cream-100 z-10">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-ink/30">
              {product ? "Editar" : "Nuevo"}
            </p>
            <h2
              className="text-lg font-light text-ink"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product ? product.name : "Nueva prenda"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink/25 hover:text-ink transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

          {/* Imagen principal */}
          <div>
            <label className={labelCls}>
              Imagen principal <span className="text-red-400">*</span>
            </label>
            <input id="image-upload" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploading} className="hidden" />
            <label
              htmlFor="image-upload"
              className={`group relative flex flex-col items-center justify-center w-full border border-dashed cursor-pointer transition-colors duration-200 overflow-hidden ${
                uploading ? "border-champagne/50 cursor-wait" : "border-cream-300 hover:border-champagne"
              }`}
              style={{ minHeight: 160 }}
            >
              {localPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={localPreview} alt="Preview" className="w-full h-48 object-cover" />
                  {uploading && (
                    <div className="absolute inset-0 bg-cream-100/80 flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border border-champagne border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] tracking-widest uppercase text-champagne">Subiendo...</p>
                    </div>
                  )}
                  {!uploading && (
                    <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-[10px] tracking-[0.16em] uppercase text-cream-100 bg-espresso/70 px-4 py-2">
                        Cambiar imagen
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border border-champagne border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] tracking-widest uppercase text-champagne">Subiendo...</p>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-8 h-8 text-ink/20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                      </svg>
                      <p className="text-xs text-ink/35">Clic para subir — JPG, PNG o WebP</p>
                    </>
                  )}
                </div>
              )}
            </label>
          </div>

          {/* Galería adicional */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls}>Fotos adicionales</label>
              <label
                htmlFor="extra-upload"
                className={`text-[10px] tracking-[0.14em] uppercase text-champagne border-b border-champagne/40 pb-0.5 cursor-pointer hover:text-champagne-dark transition-colors duration-200 ${uploadingExtra ? "opacity-40 cursor-wait" : ""}`}
              >
                {uploadingExtra ? "Subiendo..." : "+ Agregar"}
              </label>
              <input id="extra-upload" type="file" accept="image/*" multiple onChange={handleExtraUpload} disabled={uploadingExtra} className="hidden" />
            </div>
            {extraImages.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {extraImages.map((src, i) => (
                  <div key={i} className="relative group overflow-hidden aspect-square bg-cream-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`extra ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExtraImage(i)}
                      className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/50 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-cream-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-ink/25 py-4 border border-dashed border-cream-300 text-center tracking-wide">
                Sin fotos adicionales
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className={labelCls}>Nombre <span className="text-red-400">*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Ej: Vestido floral negro" className={inputCls} />
          </div>

          {/* Descripción */}
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe la prenda, materiales, cuidados..." className={`${inputCls} resize-none`} />
          </div>

          {/* Precio + Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Precio MXN <span className="text-red-400">*</span></label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min={0} step={0.01} placeholder="299" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Categoría <span className="text-red-400">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required className={`${inputCls} cursor-pointer`}>
                {CATEGORIES.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className={labelCls}>Badge <span className="text-ink/25 normal-case tracking-normal text-[10px]">(opcional)</span></label>
            <input type="text" name="badge" value={form.badge} onChange={handleChange} placeholder="Ej: Nuevo, Sale, Últimas unidades" className={inputCls} />
          </div>

          {/* Tallas */}
          <div>
            <label className={labelCls}>
              Tallas disponibles <span className="text-ink/25 normal-case tracking-normal text-[10px]">(opcionales)</span>
            </label>

            {/* Tallas predefinidas */}
            <div className="flex flex-wrap gap-2 mb-3">
              {DEFAULT_SIZES.map((size) => {
                const active = sizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`min-w-[3rem] px-3 py-2 text-xs font-medium tracking-widest transition-all duration-200 border ${
                      active
                        ? "bg-espresso text-cream-100 border-espresso"
                        : "border-cream-300 text-ink/50 hover:border-espresso hover:text-ink"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Talla personalizada */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="Talla personalizada (ej: XXXL, 38)"
                className={`${inputCls} flex-1`}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSize())}
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-ink/60 hover:text-ink text-[10px] tracking-[0.14em] uppercase transition-colors duration-200 whitespace-nowrap"
              >
                Agregar
              </button>
            </div>

            {/* Tallas seleccionadas */}
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sizes.map((size) => (
                  <span key={size} className="inline-flex items-center gap-1.5 text-[10px] tracking-wide text-ink/60 border border-cream-300 px-2.5 py-1">
                    {size}
                    <button
                      type="button"
                      onClick={() => setSizes((prev) => prev.filter((s) => s !== size))}
                      className="text-ink/25 hover:text-ink/60 ml-0.5 transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variantes de color */}
          <div>
            <label className={labelCls}>
              Variantes de color <span className="text-ink/25 normal-case tracking-normal text-[10px]">(opcionales)</span>
            </label>

            {/* Colores preset */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((v) => {
                const active = variants.some((x) => x.colorHex === v.colorHex);
                return (
                  <button
                    type="button"
                    key={v.colorHex}
                    onClick={() => toggleVariant(v)}
                    title={v.color}
                    className={`relative w-7 h-7 transition-all duration-200 border ${
                      active ? "ring-2 ring-offset-1 ring-champagne border-transparent" : "border-cream-300 hover:ring-1 hover:ring-ink/20"
                    }`}
                    style={{ backgroundColor: v.colorHex }}
                  >
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke={v.colorHex === "#FFFFFF" || v.colorHex === "#F59E0B" ? "#000" : "#fff"} className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Seleccionados */}
            {variants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {variants.map((v) => (
                  <span key={v.colorHex} className="inline-flex items-center gap-1.5 text-[10px] tracking-wide text-ink/60 border border-cream-300 px-2.5 py-1">
                    <span className="w-2.5 h-2.5 inline-block border border-cream-300" style={{ backgroundColor: v.colorHex }} />
                    {v.color}
                    <button
                      type="button"
                      onClick={() => setVariants((prev) => prev.filter((x) => x.colorHex !== v.colorHex))}
                      className="text-ink/25 hover:text-ink/60 ml-0.5 transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Color personalizado */}
            <div className="flex gap-2">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="w-10 h-10 border border-cream-300 cursor-pointer p-0.5 bg-cream-100"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="Nombre del color personalizado"
                className={`${inputCls} flex-1`}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomVariant())}
              />
              <button
                type="button"
                onClick={addCustomVariant}
                className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-ink/60 hover:text-ink text-[10px] tracking-[0.14em] uppercase transition-colors duration-200 whitespace-nowrap"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Visible + Destacada */}
          <div className="flex gap-6 border-t border-cream-300/60 pt-5">
            {[
              { name: "visible", label: "Visible en tienda", checked: form.visible },
              { name: "featured", label: "Destacada", checked: form.featured },
            ].map((toggle) => (
              <label key={toggle.name} className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 border transition-colors duration-200 flex items-center justify-center ${toggle.checked ? "bg-champagne border-champagne" : "border-cream-300 group-hover:border-ink/30"}`}>
                  {toggle.checked && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#0D0B08" className="w-2.5 h-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <input type="checkbox" name={toggle.name} checked={toggle.checked} onChange={handleChange} className="sr-only" />
                <span className="text-[10px] tracking-[0.14em] uppercase text-ink/50 group-hover:text-ink transition-colors duration-200">
                  {toggle.label}
                </span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-[11px] text-red-400/80 border-l-2 border-red-400/40 pl-3 py-1">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-cream-300 text-ink/50 hover:text-ink hover:border-ink py-3 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading || uploadingExtra}
              className="flex-1 bg-champagne hover:bg-champagne-dark disabled:opacity-40 text-espresso py-3 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : product ? "Guardar cambios" : "Agregar prenda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
