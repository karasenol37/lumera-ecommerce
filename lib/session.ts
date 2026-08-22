import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("lumera-user")?.value;

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    console.error("Error getting session user:", error);
    return null;
  }
}
