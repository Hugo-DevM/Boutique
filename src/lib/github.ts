import { Product } from "@/types";

const GITHUB_API = "https://api.github.com";
const FILE_PATH = "products.json";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export async function getProductsFromGitHub(): Promise<{
  products: Product[];
  sha: string | null;
}> {
  const url = `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${FILE_PATH}`;

  const res = await fetch(url, {
    headers: headers(),
    cache: "no-store",
  });

  if (res.status === 404) {
    return { products: [], sha: null };
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  const parsed = JSON.parse(content);

  return { products: parsed.products ?? [], sha: data.sha };
}

export async function saveProductsToGitHub(
  products: Product[],
  sha: string | null,
): Promise<void> {
  const url = `${GITHUB_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${FILE_PATH}`;

  const content = Buffer.from(JSON.stringify({ products }, null, 2)).toString(
    "base64",
  );

  const body: Record<string, string> = {
    message: `chore: update products ${new Date().toISOString()}`,
    content,
  };

  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to save products: ${err}`);
  }
}
