import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
  cookieStore.delete("lumera-user");

  return NextResponse.json({
    success: true,
    message: "Çıkış yapıldı",
  });
}
