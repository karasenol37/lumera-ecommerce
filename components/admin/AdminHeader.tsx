"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  userEmail?: string;
}

export default function AdminHeader({
  title = "Admin Paneli",
  subtitle,
  userEmail,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Ürünler" },
    { href: "/admin/orders", label: "Siparişler" },
    { href: "/admin/users", label: "Kullanıcılar" },
    { href: "/admin/settings", label: "Ayarlar" },
  ];

  return (
    <header className="mb-8 border-b border-white/10 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {title}
            </h1>
            {userEmail && (
              <span className="rounded-full bg-[#c8a165]/10 px-3 py-1 text-xs font-medium text-[#c8a165] border border-[#c8a165]/20">
                {userEmail}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs md:text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <span>🌐 Siteye Dön</span>
          </Link>
          <AdminLogoutButton variant="outline" />
        </div>
      </div>

      {/* Quick Nav bar */}
      <nav className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 text-sm font-medium text-zinc-400">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3.5 py-1.5 transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-[#c8a165] text-black font-semibold shadow-md shadow-[#c8a165]/20"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
