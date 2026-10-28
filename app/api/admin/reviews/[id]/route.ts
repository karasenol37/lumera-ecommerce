import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSessionUser } from "@/lib/actions/session";

async function isAuthorizedAdmin() {
  const jwtSession = await getSession();
  if (jwtSession) return true;

  const user = await getSessionUser();
  if (user && user.role === "ADMIN") return true;

  return false;
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Geçersiz yorum ID" }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({
      success: true,
      message: "Yorum başarıyla silindi.",
    });
  } catch (error: any) {
    console.error("Admin review DELETE error:", error);
    return NextResponse.json(
      { error: "Yorum silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

