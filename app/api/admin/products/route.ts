import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { buildProductImageFileName } from "@/lib/utils/productImage";

async function saveFile(file: File, productName: string, index?: number) {
  const fileName = buildProductImageFileName(
    productName,
    file.name,
    index,
    file.type
  );

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  } else {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);
    return `/uploads/${fileName}`;
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        price: true,
        image: true,
        material: true,
        dimensions: true,
        stock: true,
        isActive: true,
      },
    });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Ürünler alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Yetkisiz erişim",
      },
      {
        status: 401,
      }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      {
        message: "Admin yetkisi gerekli",
      },
      {
        status: 403,
      }
    );
  }

  const formData = await request.formData();

  const mainImage = formData.get("mainImage") as File;

  if (!mainImage) {
    return NextResponse.json(
      {
        message: "Ana görsel gerekli",
      },
      {
        status: 400,
      }
    );
  }

  const productName = String(formData.get("name") || "urun");

  const mainImageUrl = await saveFile(mainImage, productName, 1);

  const galleryFiles = formData.getAll("gallery") as File[];

  const galleryUrls: string[] = [];

  let galleryIdx = 2;
  for (const file of galleryFiles) {
    if (file.size > 0) {
      const url = await saveFile(file, productName, galleryIdx++);
      galleryUrls.push(url);
    }
  }

  const product = await prisma.product.create({
    data: {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      category: String(formData.get("category")),
      price: Number(formData.get("price")),
      oldPrice: Number(formData.get("oldPrice")),
      image: mainImageUrl,
      description: String(formData.get("description")),
      material: String(formData.get("material")),
      dimensions: String(formData.get("dimensions")),
      stock: Number(formData.get("stock")),
      freeShipping:
        Number(formData.get("shippingFee") || 0) > 0
          ? false
          : formData.get("freeShipping") === "false"
          ? false
          : true,
      shippingFee:
        formData.get("freeShipping") === "false" ||
        Number(formData.get("shippingFee") || 0) > 0
          ? Number(formData.get("shippingFee") || 0)
          : 0,
      images: {
        create: galleryUrls.map((url) => ({
          url,
        })),
      },
    },
  });

  return NextResponse.json({
    success: true,
    product,
  });
}
