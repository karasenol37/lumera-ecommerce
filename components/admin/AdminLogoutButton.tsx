"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/session";

interface AdminLogoutButtonProps {
  variant?: "outline" | "solid" | "subtle";
  className?: string;
}

export default function AdminLogoutButton({
  variant = "outline",
  className = "",
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await logout();
      await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }

  let baseStyle =
    "inline-flex items-center gap-2 rounded-full font-medium transition-all text-xs md:text-sm px-4 py-2.5 disabled:opacity-50 cursor-pointer select-none";

  if (variant === "outline") {
    baseStyle +=
      " border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300";
  } else if (variant === "solid") {
    baseStyle +=
      " bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/30 hover:shadow-red-900/50";
  } else {
    baseStyle += " text-zinc-400 hover:text-red-400 hover:bg-white/5";
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${baseStyle} ${className}`}
      title="Admin Panelinden Çıkış Yap"
      type="button"
    >
      <svg
        className="w-4 h-4 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>{loading ? "Çıkış Yapılıyor..." : "Çıkış Yap"}</span>
    </button>
  );
}
