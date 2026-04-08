import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public_id from a Cloudinary URL.
 * e.g. https://res.cloudinary.com/mycloud/image/upload/v123/lumiere_boutique/productos/abc/img.jpg
 *   → lumiere_boutique/productos/abc/img
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Deletes all images of a product from Cloudinary.
 * Deletes individual images AND the folder if it only had those images.
 */
export async function deleteProductImages(
  image: string,
  extraImages: string[] = []
): Promise<void> {
  const allUrls = [image, ...extraImages].filter(Boolean);
  const publicIds = allUrls
    .map(extractPublicId)
    .filter((id): id is string => id !== null);

  if (publicIds.length === 0) return;

  // Delete all images in one batch call
  await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });

  // Try to delete the folder (only succeeds if it's now empty)
  const folderMatch = publicIds[0]?.match(/^(.+\/[^/]+)\//);
  if (folderMatch) {
    try {
      await cloudinary.api.delete_folder(folderMatch[1]);
    } catch {
      // Folder not empty or doesn't exist — ignore
    }
  }
}
