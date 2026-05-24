"use client";

import { Category, CATEGORY_LABELS } from "@/types";

export type PriceRange = "all" | "u500" | "500_1000" | "1000_2000" | "o2000";

export const PRICE_RANGES: { key: PriceRange; label: string; min: number; max: number }[] = [
  { key: "all",       label: "Cualquier precio", min: 0,    max: Infinity },
  { key: "u500",      label: "Menos de $500",    min: 0,    max: 499 },
  { key: "500_1000",  label: "$500 – $1,000",    min: 500,  max: 1000 },
  { key: "1000_2000", label: "$1,000 – $2,000",  min: 1000, max: 2000 },
  { key: "o2000",     label: "Más de $2,000",    min: 2001, max: Infinity },
];

interface CategoryFilterProps {
  activeCategory: Category | "all";
  onCategoryChange: (cat: Category | "all") => void;
  search: string;
  onSearchChange: (q: string) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (r: PriceRange) => void;
}

const ALL_CATEGORIES: (Category | "all")[] = [
  "all",
  "sale",
  "ultimas_piezas",
  "mas_vendidos",
  "menos_499",
];

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-5 mb-10">
      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar prendas..."
          className="w-full pl-11 pr-4 py-3 border border-cream-300 bg-cream-100 text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-champagne transition-colors duration-300"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors duration-200 text-xs tracking-widest"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-px bg-cream-300/50">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const label = cat === "all" ? "Todas" : CATEGORY_LABELS[cat as Category];
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-5 py-2.5 text-[10px] font-medium tracking-[0.16em] uppercase transition-colors duration-300 ${
                isActive
                  ? "bg-espresso text-cream-100"
                  : "bg-cream-100 text-ink/50 hover:bg-cream-200 hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Price range filters */}
      <div className="flex flex-wrap items-center gap-px bg-cream-300/50">
        {PRICE_RANGES.map((r) => {
          const isActive = priceRange === r.key;
          return (
            <button
              key={r.key}
              onClick={() => onPriceRangeChange(r.key)}
              className={`px-5 py-2 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors duration-300 ${
                isActive
                  ? "bg-champagne text-espresso"
                  : "bg-cream-100 text-ink/40 hover:bg-cream-200 hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
