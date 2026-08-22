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
