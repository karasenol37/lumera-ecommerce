const TURKISH_CHAR_MAP: Record<string, string> = {
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

/**
 * Converts a product name into a clean SEO-friendly slug for image filenames.
 * Example: "Lüxtel Izgara & Ateş Çukuru" -> "luxtel-izgara-ates-cukuru"
 */
export function createProductImageSlug(text: string): string {
  if (!text) return "urun-gorseli";

  const normalized = text
    .split("")
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join("");

  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "urun-gorseli";
}

const VALID_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "avif",
]);

/**
 * Extracts a clean file extension from a URL, filename, or MIME type.
 */
export function getImageExtension(
  filenameOrUrl?: string | null,
  mimeType?: string | null
): string {
  if (mimeType) {
    const cleanMime = mimeType.toLowerCase().trim();
    if (cleanMime === "image/jpeg" || cleanMime === "image/jpg") return "jpg";
    if (cleanMime === "image/png") return "png";
    if (cleanMime === "image/webp") return "webp";
    if (cleanMime === "image/gif") return "gif";
    if (cleanMime === "image/svg+xml") return "svg";
    if (cleanMime === "image/avif") return "avif";
  }

  if (filenameOrUrl) {
    try {
      const withoutQuery = filenameOrUrl.split("?")[0].split("#")[0];
      const lastSegment = withoutQuery.split("/").pop() || "";
      const parts = lastSegment.split(".");
      if (parts.length > 1) {
        const ext = parts.pop()!.toLowerCase();
        if (VALID_IMAGE_EXTENSIONS.has(ext)) {
          return ext === "jpeg" ? "jpg" : ext;
        }
      }
    } catch {
      // Fallback to jpg
    }
  }

  return "jpg";
}

/**
 * Builds a filename named after the product.
 * Example (index 1 or undefined): "kestane-agaci-ahsap-sezlong.jpg"
 * Example (index 2): "kestane-agaci-ahsap-sezlong-2.jpg"
 */
export function buildProductImageFileName(
  productName: string,
  originalFilenameOrUrl?: string | null,
  index?: number,
  mimeType?: string | null
): string {
  const baseSlug = createProductImageSlug(productName);
  const ext = getImageExtension(originalFilenameOrUrl, mimeType);
  const suffix = index && index > 1 ? `-${index}` : "";
  return `${baseSlug}${suffix}.${ext}`;
}

/**
 * Encodes an image source URL into a URL-safe base64 string (works in both Node and Browser).
 */
export function encodeImageSource(url: string): string {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(url, "utf-8")
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
    const bytes = new TextEncoder().encode(url);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

/**
 * Decodes a base64url encoded image source URL back to the original string.
 */
export function decodeImageSource(encoded: string): string | null {
  if (!encoded) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(padded, "base64").toString("utf-8");
    }
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/**
 * Returns a product-named image URL (e.g., `/urun-gorseli/luxtel-izgara-ates-cukuru.jpg?k=...`)
 * so that all product images on the site have the product's name as their filename.
 */
export function getProductImageUrl(
  originalUrl: string | null | undefined,
  productName: string,
  index?: number
): string {
  if (!originalUrl) {
    return "/images/no-image.jpg";
  }

  const trimmed = originalUrl.trim();
  if (!trimmed) {
    return "/images/no-image.jpg";
  }

  // Keep client-side preview URLs (blob: / data:) intact
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // If already wrapped in /urun-gorseli/, extract original source if re-indexing/renaming, or return as-is
  if (trimmed.startsWith("/urun-gorseli/") || trimmed.includes("/urun-gorseli/")) {
    const queryIdx = trimmed.indexOf("?k=");
    if (queryIdx !== -1) {
      const kParam = trimmed.slice(queryIdx + 3).split("&")[0];
      const decoded = decodeImageSource(kParam);
      if (decoded) {
        const fileName = buildProductImageFileName(productName, decoded, index);
        return `/urun-gorseli/${fileName}?k=${kParam}`;
      }
    }
    return trimmed;
  }

  // Check if local static file already has the exact product filename
  const fileName = buildProductImageFileName(productName, trimmed, index);
  const encodedSource = encodeImageSource(trimmed);

  return `/urun-gorseli/${fileName}?k=${encodedSource}`;
}

