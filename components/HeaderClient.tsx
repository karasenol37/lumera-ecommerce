"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { logout } from "@/lib/actions/session";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type HeaderProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  settings?: Record<string, string>;
  unreadMessageCount?: number;
};

export default function HeaderClient({
  user,
  settings,
  unreadMessageCount = 0,
}: HeaderProps) {
  const { cart } = useCart();
  const { favorites } = useFavorite();
  const router = useRouter();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favorites.length;

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  const topBannerText =
    settings?.topBannerText || "✨ 750 TL ve üzeri siparişlerde Ücretsiz Kargo";
  const announcementBadge =
    settings?.announcementBadge || "LUMERA LUXURY COLLECTION";
  const contactPhone = settings?.contactPhone || "0850 XXX XX XX";
  const brandTagline =
    settings?.brandTagline || "Gölgede Zarafet, Dinlenmede Ayrıcalık";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#090a0f]/90 border-b border-white/10 shadow-2xl transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0a0b10] via-[#151724] to-[#0a0b10] border-b border-white/5 py-2 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-medium tracking-wider text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#c8a165] animate-pulse"></span>
            <span className="text-zinc-300 font-light">{topBannerText}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[#c8a165] tracking-[0.2em] font-semibold text-[11px] uppercase">
              {announcementBadge}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400 text-xs">
              Müşteri Destek:{" "}
              <strong className="text-[#e5c184] font-medium">
                {contactPhone}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <img
              src="/logo.png"
              alt="LUMERA"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="hidden lg:block border-l border-white/10 pl-4 py-1">
            <p className="text-[11px] tracking-widest text-[#c8a165] uppercase font-semibold">
              {brandTagline}
            </p>
          </div>
        </Link>

        {/* Icon-Based Navigation */}
        <nav className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            title="Ana Sayfa"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-[#c8a165]/10 text-zinc-300 hover:text-[#e5c184] transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4 text-[#c8a165] group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">
              Ana Sayfa
            </span>
          </Link>

          <Link
            href="/hakkimizda"
            title="Hakkımızda"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-[#c8a165]/10 text-zinc-300 hover:text-[#e5c184] transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4 text-[#c8a165] group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">
              Hakkımızda
            </span>
          </Link>

          <Link
            href="/iletisim"
            title="İletişim"
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-[#c8a165]/10 text-zinc-300 hover:text-[#e5c184] transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4 text-[#c8a165] group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">
              İletişim
            </span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Favorites Icon Button with Counter Badge */}
          <Link
            href="/account/favorites"
            title="Favorilerim"
            className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-white/10 text-zinc-300 hover:text-rose-400 transition shadow-sm"
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                favoriteCount > 0 ? "fill-rose-500 text-rose-500" : "fill-none stroke-current"
              }`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {favoriteCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-[10px] sm:text-[11px] font-bold text-white shadow-md animate-bounce">
                {favoriteCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden xl:block text-right">
                <span className="text-[10px] text-zinc-400 block uppercase tracking-wider">
                  Hoş geldiniz
                </span>
                <span className="text-xs font-bold gold-gradient-text">
                  {user.name}
                </span>
              </div>

              <Link
                href="/account"
                title="Hesabım"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-white/10 text-zinc-300 hover:text-[#c8a165] transition shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              {user.role === "ADMIN" && (
                <>
                  <Link
                    href="/admin/messages"
                    title={`Gelen İletişim Mesajları ${unreadMessageCount > 0 ? `(${unreadMessageCount} Okunmamış)` : ""}`}
                    className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-white/10 text-zinc-300 hover:text-[#e5c184] transition shadow-sm"
                  >
                    <svg
                      className="w-4 h-4 text-[#c8a165]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {unreadMessageCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[10px] sm:text-[11px] font-extrabold text-black shadow-md animate-pulse">
                        {unreadMessageCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-full bg-[#c8a165]/20 border border-[#c8a165]/40 text-xs font-semibold text-[#e5c184] hover:bg-[#c8a165]/30 transition shadow-sm"
                  >
                    Admin
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="p-2 text-xs text-zinc-400 hover:text-red-400 transition"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-300 hover:text-[#c8a165] transition px-3 py-2"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="rounded-full gold-gradient-btn px-4 py-2 text-xs font-extrabold text-black shadow-md hover:scale-105 transition-transform"
              >
                Kayıt Ol
              </Link>
            </div>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            title="Sepetim"
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-200 transition hover:border-[#c8a165] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(200,161,101,0.3)] shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#e5c184] to-[#c8a165] text-[11px] font-bold text-black shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}