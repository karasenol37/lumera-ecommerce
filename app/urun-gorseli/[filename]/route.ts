import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  createProductImageSlug,
  decodeImageSource,
  getImageExtension,
} from "@/lib/utils/productImage";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

function isAllowedRemoteUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    return (
      host.endsWith(".public.blob.vercel-storage.com") ||
      host.endsWith(".vercel-storage.com") ||
      host === "lumeratasarim.com" ||
      host === "www.lumeratasarim.com" ||
      host === "images.unsplash.com"
    );
  } catch {
    return false;
  }
}

async function resolveSourceFromDatabase(filename: string): Promise<string | null> {
  try {
    const withoutExt = filename.replace(/\.[^/.]+$/, "");
    const galleryMatch = withoutExt.match(/^(.*)-(\d+)$/);
    const baseSlug = galleryMatch ? galleryMatch[1] : withoutExt;
    const galleryIndex = galleryMatch ? parseInt(galleryMatch[2], 10) : 1;

    // 1. Try direct slug match
    const directProduct = await prisma.product.findUnique({
      where: { slug: baseSlug },
      include: { images: { orderBy: { id: "asc" } } },
    });

    if (directProduct) {
      if (galleryIndex <= 1) {
        return directProduct.image;
      }
      const galleryImg = directProduct.images[galleryIndex - 2];
      return galleryImg?.url || directProduct.image;
    }

    // 2. Fallback: match against slugified product name
    const allProducts = await prisma.product.findMany({
      select: {
        name: true,
        slug: true,
        image: true,
        images: { select: { url: true }, orderBy: { id: "asc" } },
      },
    });

    const matched = allProducts.find(
      (p: {
        name: string;
        slug: string | null;
        image: string;
        images: { url: string }[];
      }) =>
        createProductImageSlug(p.name) === baseSlug ||
        (p.slug && createProductImageSlug(p.slug) === baseSlug)
    );

    if (matched) {
      if (galleryIndex <= 1) {
        return matched.image;
      }
      const galleryImg = matched.images[galleryIndex - 2];
      return galleryImg?.url || matched.image;
    }
  } catch {
    // Ignore DB errors and fall back to static file lookup
  }

  return null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const safeFilename = path.basename(filename || "urun-gorseli.jpg");
    const ext = getImageExtension(safeFilename);
    const defaultMime = MIME_BY_EXT[ext] || "image/jpeg";

    const { searchParams } = new URL(request.url);
    const kParam = searchParams.get("k");
    const srcParam = searchParams.get("src");

    let targetSource: string | null = null;

    if (kParam) {
      targetSource = decodeImageSource(kParam);
    } else if (srcParam) {
      targetSource = srcParam;
    }

    if (!targetSource) {
      targetSource = await resolveSourceFromDatabase(safeFilename);
    }

    // Also check if a local file with this exact name exists in public/uploads or public/images/products
    if (!targetSource) {
      targetSource = `/images/products/${safeFilename}`;
    }

    // Serve remote URL (e.g. Vercel Blob)
    if (
      targetSource.startsWith("http://") ||
      targetSource.startsWith("https://")
    ) {
      if (!isAllowedRemoteUrl(targetSource)) {
        return new NextResponse("Forbidden image source", { status: 403 });
      }

      const upstream = await fetch(targetSource, {
        next: { revalidate: 86400 },
      });

      if (!upstream.ok) {
        return new NextResponse("Image not found", { status: upstream.status });
      }

      const contentType =
        upstream.headers.get("content-type") || defaultMime;
      const arrayBuffer = await upstream.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${safeFilename}"`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Serve local file from /public
    const relativePath = targetSource.replace(/^\/+/, "");
    const resolvedPublicPath = path.resolve(process.cwd(), "public", relativePath);
    const publicRoot = path.resolve(process.cwd(), "public");

    if (!resolvedPublicPath.startsWith(publicRoot)) {
      return new NextResponse("Invalid path", { status: 400 });
    }

    try {
      const fileBuffer = await readFile(resolvedPublicPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": defaultMime,
          "Content-Disposition": `inline; filename="${safeFilename}"`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Fallback to /uploads/${safeFilename} if /images/products/${safeFilename} didn't exist
      const fallbackPath = path.resolve(
        process.cwd(),
        "public",
        "uploads",
        safeFilename
      );
      try {
        const fallbackBuffer = await readFile(fallbackPath);
        return new NextResponse(fallbackBuffer, {
          status: 200,
          headers: {
            "Content-Type": defaultMime,
            "Content-Disposition": `inline; filename="${safeFilename}"`,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch {
        return new NextResponse("Image not found", { status: 404 });
      }
    }
  } catch (error) {
    console.error("Error serving product image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

