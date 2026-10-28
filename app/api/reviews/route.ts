import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getFallbackReviewsForProduct,
  syncDefaultReviewsToDatabase,
} from "@/lib/data/defaultReviews";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productIdStr = searchParams.get("productId");

    if (!productIdStr) {
      return NextResponse.json(
        { error: "productId parametresi gereklidir" },
        { status: 400 }
      );
    }

    const productId = Number(productIdStr);
    await syncDefaultReviewsToDatabase(productId);

    let reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (reviews.length === 0) {
      reviews = getFallbackReviewsForProduct(productId);
    }

    const count = reviews.length;
    const averageRating =
      count > 0
        ? Number(
            (
              reviews.reduce((acc, r) => acc + r.rating, 0) / count
            ).toFixed(1)
          )
        : 5.0;

    return NextResponse.json({
      reviews,
      count,
      averageRating,
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get("productId") || 0);
    const fallback = getFallbackReviewsForProduct(productId);
    return NextResponse.json({
      reviews: fallback,
      count: fallback.length,
      averageRating: 5.0,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, name, rating, comment } = body;

    if (!productId || !name?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: "Lütfen adınızı ve yorumunuzu giriniz." },
        { status: 400 }
      );
    }

    const pId = Number(productId);
    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = await prisma.review.create({
      data: {
        productId: pId,
        name: name.trim().slice(0, 80),
        rating: numRating,
        comment: comment.trim().slice(0, 1000),
        isApproved: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Yorumunuz başarıyla eklendi.",
      review: newReview,
    });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json(
      { error: "Yorum kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
