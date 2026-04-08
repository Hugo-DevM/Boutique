"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Product, Category, CATEGORY_LABELS } from "@/types";

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

export default function ProductForm({
  product,
  onClose,
  onSaved,
}: ProductFormProps) {
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    // Upload to Cloudinary in background
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.url }));
      setLocalPreview(data.url);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const password = sessionStorage.getItem("lumiere_password");

    if (!password) {
      setSaving(false);
      setError("Sesión expirada. Vuelve a iniciar sesión.");
      return;
    }

    const payload = {
      password,
      product: {
        ...(product ?? {}),
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image: form.image,
        category: form.category,
        badge: form.badge || undefined,
        visible: form.visible,
        featured: form.featured,
      },
    };

    const res = await fetch("/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSaved();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error al guardar el producto.");
    }
    setSaving(false);
  };

  const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product ? "Editar prenda" : "Nueva prenda"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del producto <span className="text-red-400">*</span>
            </label>

            {/* Hidden file input */}
            <input
              id="image-upload"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />

            {/* Drop zone */}
            <label
              htmlFor="image-upload"
              className={`group relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${
                uploading
                  ? "border-violet-300 bg-violet-50 cursor-wait"
                  : "border-violet-200 bg-violet-50/50 hover:bg-violet-50 hover:border-violet-400"
              }`}
              style={{ minHeight: "180px" }}
            >
              {localPreview ? (
                /* Preview */
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={localPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  {/* Uploading overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-violet-600 font-medium">Subiendo...</p>
                    </div>
                  )}
                  {/* Hover overlay to change */}
                  {!uploading && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full">
                        Cambiar imagen
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
                  {uploading ? (
                    <>
                      <div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-violet-500 font-medium">
                        Subiendo imagen...
                      </p>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-12 h-12 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Haz clic para subir imagen
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG o WebP
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </label>

          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ej: Vestido floral negro"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe la prenda brevemente..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Precio (MXN) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                placeholder="299"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Categoría <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
              >
                {CATEGORIES.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Badge (opcional)
            </label>
            <input
              type="text"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="Ej: Nuevo, Sale, Últimas unidades"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>

          {/* Visible + Featured */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="visible"
                checked={form.visible}
                onChange={handleChange}
                className="w-4 h-4 accent-violet-600"
              />
              <span className="text-sm text-gray-700">Visible en tienda</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-violet-600"
              />
              <span className="text-sm text-gray-700">Destacada</span>
            </label>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? "Guardando..." : product ? "Guardar cambios" : "Agregar prenda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
