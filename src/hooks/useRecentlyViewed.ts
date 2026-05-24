"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";

const KEY = "lumiere_recently_viewed";
const MAX = 8;

export function useRecentlyViewed(currentId?: string) {
  const [ids, setIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      setIds(saved ? JSON.parse(saved) : []);
    } catch { /* ignore */ }
  }, []);

  // Push current product to the front whenever it changes
  useEffect(() => {
    if (!currentId) return;
    setIds((prev) => {
      const next = [currentId, ...prev.filter((id) => id !== currentId)].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [currentId]);

  // Return IDs excluding the current product
  const otherIds = ids.filter((id) => id !== currentId);

  return { otherIds };
}

export function resolveRecentlyViewed(ids: string[], products: Product[]): Product[] {
  return ids
    .map((id) => products.find((p) => p.id === id && p.visible))
    .filter(Boolean) as Product[];
}
