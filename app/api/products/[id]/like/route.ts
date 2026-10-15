import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        likes: { increment: 1 },
      },
      select: {
        id: true,
        likes: true,
      },
    });

    return NextResponse.json({
      success: true,
      likes: updated.likes,
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Beğeni kaydedilemedi" },
      { status: 500 }
    );
  }
}
