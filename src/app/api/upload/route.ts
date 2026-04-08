import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const productId = (formData.get("productId") as string | null) ?? "general";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize productId to be safe as a folder name
  const safeId = productId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
  const folder = `lumiere_boutique/productos/${safeId}`;

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: "image" },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { secure_url: string });
          }
        )
        .end(buffer);
    }
  );

  return NextResponse.json({ url: result.secure_url });
}
