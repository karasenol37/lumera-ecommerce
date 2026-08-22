import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      {
        message: "Yetkisiz",
      },
      {
        status: 403,
      }
    );
  }

  const { id } = await context.params;
  const body = await request.json();

  const order = await prisma.order.update({
    where: {
      id: Number(id),
    },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json({
    success: true,
    order,
  });
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      {
        message: "Yetkisiz erişim",
      },
      {
        status: 403,
      }
    );
  }

  const { id } = await context.params;
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return NextResponse.json(
      { message: "Geçersiz sipariş ID" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json(
      { message: "Sipariş bulunamadı" },
      { status: 404 }
    );
  }

  const allowedStatuses = ["Teslim Edildi", "İptal"];
  if (!allowedStatuses.includes(order.status)) {
    return NextResponse.json(
      {
        success: false,
        message: `"${order.status}" durumundaki siparişler silinemez. Yalnızca "Teslim Edildi" veya "İptal" durumundaki siparişler silinebilir.`,
      },
      { status: 400 }
    );
  }

  await prisma.order.delete({
    where: { id: orderId },
  });

  return NextResponse.json({
    success: true,
    message: "Sipariş veritabanından başarıyla silindi.",
  });
}