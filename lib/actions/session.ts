"use server";

import { cookies } from "next/headers";
import { getSessionUser as getSessionUserHelper } from "@/lib/session";

export async function createSession(userId: number) {
  const cookieStore = await cookies();

  cookieStore.set("lumera-user", String(userId), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSessionUser() {
  return await getSessionUserHelper();
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("lumera-user");
  cookieStore.delete("admin-session");
}