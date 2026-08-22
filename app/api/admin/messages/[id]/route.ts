import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { id } = await params;
    const messageId = Number(id);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: "Geçersiz mesaj ID" },
        { status: 400 }
      );
    }

    const contactModel = (prisma as any).contactMessage;
    if (!contactModel) {
      return NextResponse.json(
        { error: "Mesaj modeli bulunamadı" },
        { status: 500 }
      );
    }

    await contactModel.delete({
      where: { id: messageId },
    });

    return NextResponse.json({
      success: true,
      message: "Mesaj başarıyla silindi.",
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { error: "Mesaj silinirken bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
