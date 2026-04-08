import { NextResponse } from "next/server";
import { getProductsFromGitHub, saveProductsToGitHub } from "@/lib/github";
import { Product } from "@/types";
import fs from "fs";
import path from "path";

// ── Local file fallback ────────────────────────────────────────────────────────
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

function writeLocal(products: Product[]) {
  fs.writeFileSync(LOCAL_FILE, JSON.stringify({ products }, null, 2), "utf-8");
}

async function getProducts() {
  if (isGitHubConfigured()) return getProductsFromGitHub();
  return readLocal();
}

async function saveProducts(products: Product[], sha: string | null) {
  if (isGitHubConfigured()) return saveProductsToGitHub(products, sha);
  writeLocal(products);
}

// ── Auth ───────────────────────────────────────────────────────────────────────
function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}

// ── Handlers ───────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const { products, sha } = await getProducts();
    return NextResponse.json({ products, sha });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ products: [], sha: null });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product, password } = body;

    if (!checkPassword(password)) return unauthorized();

    const { products, sha } = await getProducts();

    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    await saveProducts([...products, newProduct], sha);
    return NextResponse.json({ product: newProduct });
  } catch (err) {
    console.error("[POST /api/products]", err);
    return NextResponse.json(
      { error: "Error al guardar el producto." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { product, password } = body;

    if (!checkPassword(password)) return unauthorized();

    const { products, sha } = await getProducts();
    const updated = products.map((p: Product) =>
      p.id === product.id ? { ...p, ...product } : p
    );

    await saveProducts(updated, sha);
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[PUT /api/products]", err);
    return NextResponse.json(
      { error: "Error al actualizar el producto." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!checkPassword(password)) return unauthorized();

    const { products, sha } = await getProducts();
    const filtered = products.filter((p: Product) => p.id !== id);

    await saveProducts(filtered, sha);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/products]", err);
    return NextResponse.json(
      { error: "Error al eliminar el producto." },
      { status: 500 }
    );
  }
}
