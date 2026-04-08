"use client";

import { Category, CATEGORY_LABELS, CATEGORY_ICONS } from "@/types";

interface CategoryFilterProps {
  activeCategory: Category | "all";
  onCategoryChange: (cat: Category | "all") => void;
  search: string;
  onSearchChange: (q: string) => void;
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
}: CategoryFilterProps) {
  return (
    <div className="space-y-4 mb-10">
      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const label =
            cat === "all" ? "Todas" : CATEGORY_LABELS[cat as Category];
          const icon =
            cat === "all" ? "🛍️" : CATEGORY_ICONS[cat as Category];

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
