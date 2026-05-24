import { Product } from "@/types";
import { getProductsFromGitHub } from "@/lib/github";
import fs from "fs";
import path from "path";

const LOCAL_FILE = path.join(process.cwd(), "products.json");

function isGitHubConfigured() {
  return !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  );
}

function readLocal(): { products: Product[]; sha: null } {
  try {
    const raw = fs.readFileSync(LOCAL_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return { products: parsed.products ?? [], sha: null };
  } catch {
    return { products: [], sha: null };
  }
}

export async function getProducts(): Promise<{ products: Product[]; sha: string | null }> {
  if (isGitHubConfigured()) return getProductsFromGitHub();
  return readLocal();
}

export async function getProductById(id: string): Promise<Product | null> {
  const { products } = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}
