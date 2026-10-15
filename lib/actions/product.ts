"use server";

import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function saveImage(file: File) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const blob = await put(fileName, file, { access: "public" });
    return blob.url;
  } else {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);
    return `/uploads/${fileName}`;
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = String(formData.get("name") || "");
    const category = String(formData.get("category") || "Hamak");
    const price = Number(formData.get("price") || 0);
    const oldPrice = Number(formData.get("oldPrice") || 0);
    const description = String(formData.get("description") || "");
    const material = String(formData.get("material") || "");
    const dimensions = String(formData.get("dimensions") || "");
    const stock = Number(formData.get("stock") || 0);

    const feeInput = Number(formData.get("shippingFee") || 0);
    const freeShippingRaw = formData.get("freeShipping");
    const freeShipping = feeInput > 0 ? false : freeShippingRaw === "false" || freeShippingRaw === "0" ? false : true;
    const shippingFee = freeShipping ? 0 : feeInput;

    const mainImage = formData.get("mainImage") as File;
    if (!mainImage || mainImage.size === 0) {
      throw new Error("Ana resim zorunludur.");
    }

    const imageUrl = await saveImage(mainImage);

    let slug = createSlug(name);
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        price,
        oldPrice,
        description,
        material,
        dimensions,
        stock,
        freeShipping,
        shippingFee,
        image: imageUrl,
      },
    });

    const galleryImages = (formData.getAll("images") as File[]).filter(
      (image) => image && image instanceof File && image.size > 0
    );

    if (galleryImages.length > 0) {
      const galleryUrls = await Promise.all(
        galleryImages.map((image) => saveImage(image))
      );

      await prisma.productImage.createMany({
        data: galleryUrls.map((url) => ({
          url,
          productId: product.id,
        })),
      });
    }

    return { success: true, product };
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);
    throw new Error(error?.message || "Ürün eklenirken bir hata oluştu.");
  }
}