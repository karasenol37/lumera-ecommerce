import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSessionUser } from "@/lib/actions/session";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function isAuthorizedAdmin() {
  const jwtSession = await getSession();
  if (jwtSession) return true;

  const user = await getSessionUser();
  if (user && user.role === "ADMIN") return true;

  return false;
}

async function saveFile(file: File) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(
      `${Date.now()}-${file.name.replace(/\s+/g, "-")}`,
      file,
      { access: "public" }
    );
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

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await context.params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return NextResponse.json({ message: "Geçersiz ürün ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!product) {
    return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await context.params;
  const productId = Number(id);

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!existingProduct) {
    return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
  }

  const formData = await request.formData();

  const name = String(formData.get("name") || existingProduct.name);
  const slug = String(formData.get("slug") || existingProduct.slug);
  const category = String(
    formData.get("category") || existingProduct.category
  );
  const price = Number(formData.get("price") ?? existingProduct.price);
  const oldPrice = Number(
    formData.get("oldPrice") ?? existingProduct.oldPrice
  );
  const stock = Number(formData.get("stock") ?? existingProduct.stock);
  const description = String(
    formData.get("description") ?? existingProduct.description
  );
  const material = String(
    formData.get("material") ?? existingProduct.material
  );
  const dimensions = String(
    formData.get("dimensions") ?? existingProduct.dimensions
  );
  const isActive = formData.has("isActive")
    ? formData.get("isActive") === "true"
    : existingProduct.isActive;

  const freeShipping = formData.has("freeShipping")
    ? formData.get("freeShipping") === "true"
    : (existingProduct as any).freeShipping ?? true;

  const shippingFee = freeShipping
    ? 0
    : Number(formData.get("shippingFee") ?? (existingProduct as any).shippingFee ?? 0);

  const dataToUpdate: any = {
    name,
    slug,
    category,
    price,
    oldPrice,
    stock,
    description,
    material,
    dimensions,
    isActive,
    freeShipping,
    shippingFee,
  };

  // Ana Görsel Güncelleme
  const mainImage = formData.get("mainImage");
  if (mainImage && mainImage instanceof File && mainImage.size > 0) {
    dataToUpdate.image = await saveFile(mainImage);
  }

  // Silinecek Galeri Görselleri
  const deletedImageIdsRaw = formData.get("deletedImageIds");
  if (deletedImageIdsRaw) {
    try {
      const deletedIds: number[] = JSON.parse(String(deletedImageIdsRaw));
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: { in: deletedIds },
            productId: productId,
          },
        });
      }
    } catch (e) {
      console.error("Görsel silme hatası:", e);
    }
  }

  // Yeni Galeri Yükleme
  const newGalleryFiles = formData.getAll("gallery") as File[];
  const newGalleryUrls: string[] = [];
  for (const file of newGalleryFiles) {
    if (file instanceof File && file.size > 0) {
      const url = await saveFile(file);
      newGalleryUrls.push(url);
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...dataToUpdate,
      images:
        newGalleryUrls.length > 0
          ? {
              create: newGalleryUrls.map((url) => ({ url })),
            }
          : undefined,
    },
    include: { images: true },
  });

  return NextResponse.json({
    success: true,
    message: "Ürün başarıyla güncellendi",
    product: updatedProduct,
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await context.params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return NextResponse.json({ message: "Geçersiz ürün ID" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  // Sipariş kontrolü
  const orderCount = await prisma.orderItem.count({
    where: { productId },
  });

  if (orderCount > 0 && !force) {
    return NextResponse.json({
      requiresConfirmation: true,
      orderCount,
      message: `Bu ürün ${orderCount} adet siparişte yer almaktadır. Yine de ürünü ve bağlı kayıtları tamamen silmek istiyor musunuz?`,
    });
  }

  // Veritabanından tam silme (ilişkili görseller, favoriler ve gerekirse sipariş kalemleri ile)
  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { productId } }),
    prisma.favorite.deleteMany({ where: { productId } }),
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.product.delete({ where: { id: productId } }),
  ]);

  return NextResponse.json({ success: true, message: "Ürün veritabanından başarıyla silindi." });
}