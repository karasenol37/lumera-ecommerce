import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { buildProductImageFileName } from "@/lib/utils/productImage";

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      {
        error: "Dosya bulunamadı",
      },
      {
        status: 400,
      }
    );
  }

  const customName =
    String(
      formData.get("productName") ||
        formData.get("name") ||
        file.name.replace(/\.[^/.]+$/, "")
    ) || "urun-gorseli";

  const indexRaw = formData.get("index");
  const index = indexRaw ? Number(indexRaw) : undefined;

  const filename = buildProductImageFileName(
    customName,
    file.name,
    index,
    file.type
  );

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return NextResponse.json({
      url: blob.url,
    });
  } else {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
    });
  }
}
