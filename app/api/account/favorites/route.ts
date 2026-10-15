import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json([]);
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Giriş yapılmamış" },
      { status: 401 }
    );
  }

  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Ürün ID gerekli" },
        { status: 400 }
      );
    }

    const pId = Number(productId);
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: pId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, favorited: false });
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId: pId,
        },
      });
      return NextResponse.json({ success: true, favorited: true });
    }
  } catch (error) {
    console.error("Favorite toggle error:", error);
    return NextResponse.json(
      { success: false, error: "İşlem gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
