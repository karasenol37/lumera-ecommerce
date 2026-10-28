import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSessionUser } from "@/lib/actions/session";
import { syncDefaultReviewsToDatabase } from "@/lib/data/defaultReviews";

async function isAuthorizedAdmin() {
  const jwtSession = await getSession();
  if (jwtSession) return true;

  const user = await getSessionUser();
  if (user && user.role === "ADMIN") return true;

  return false;
}

export async function GET() {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  try {
    await syncDefaultReviewsToDatabase();

    const [reviews, products] = await Promise.all([
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.product.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      products,
    });
  } catch (error: any) {
    console.error("Admin reviews GET error:", error);
    return NextResponse.json(
      { error: "Yorumlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { productId, name, rating, comment } = body;

    if (!productId || !name?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: "Lütfen ürün seçiniz, müşteri adını ve yorum metnini giriniz." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: Number(productId),
        name: name.trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        comment: comment.trim(),
        isApproved: true,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Yorum başarıyla eklendi.",
    });
  } catch (error: any) {
    console.error("Admin reviews POST error:", error);
    return NextResponse.json(
      { error: "Yorum eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

