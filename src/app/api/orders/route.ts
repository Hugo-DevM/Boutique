import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { saveProductsToGitHub } from "@/lib/github";
import { Product } from "@/types";
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

function writeLocal(products: Product[]) {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify({ products }, null, 2), "utf-8");
}

function checkPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}

// PATCH /api/orders — adjust stock for a single product (admin only)
// body: { productId, delta, password }
//   delta: +N to add stock, -N to subtract (confirmed sale)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { productId, delta, password } = body;

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId || typeof delta !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { products, sha } = await getProducts();

    const updated = products.map((p: Product) => {
      if (p.id !== productId || p.stock === undefined) return p;
      return { ...p, stock: Math.max(0, p.stock + delta) };
    });

    if (isGitHubConfigured()) {
      await saveProductsToGitHub(updated, sha);
    } else {
      writeLocal(updated);
    }

    const product = updated.find((p: Product) => p.id === productId);
    return NextResponse.json({ stock: product?.stock });
  } catch (err) {
    console.error("[PATCH /api/orders]", err);
    return NextResponse.json({ error: "Error al actualizar stock." }, { status: 500 });
  }
}
