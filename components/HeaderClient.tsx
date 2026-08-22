"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { logout } from "@/lib/actions/session";
import { useRouter, usePathname } from "next/navigation";

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

const navCategories = [
  { name: "Hamak Serisi", slug: "Hamak", icon: "🌴" },
  { name: "Lüks Şezlonglar", slug: "Şezlong", icon: "☀️" },
  { name: "Güneş Şemsiyeleri", slug: "Şemsiye", icon: "⛱️" },
  { name: "Ateş Çukurları", slug: "Ateş Çukuru", icon: "🔥" },
  { name: "Bahçe Mobilyaları", slug: "Bahçe Mobilyaları", icon: "🪵" },
];

export default function HeaderClient({
  user,
  settings,
  unreadMessageCount = 0,
}: HeaderProps) {
  const { cart } = useCart();
  const { favorites } = useFavorite();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favorites.length;

  async function handleLogout() {
    await logout();
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const topBannerText =
    settings?.topBannerText || "✨ 750 TL ve üzeri siparişlerde Ücretsiz Kargo";
  const announcementBadge =
    settings?.announcementBadge || "LUMERA LUXURY COLLECTION";
  const contactPhone = settings?.contactPhone || "0535 874 69 09";
  const brandTagline =
    settings?.brandTagline || "Gölgede Zarafet, Dinlenmede Ayrıcalık";

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#090a0f]/90 border-b border-white/10 shadow-2xl transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-[#0a0b10] via-[#151724] to-[#0a0b10] border-b border-white/5 py-1.5 sm:py-2 px-3 sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] sm:text-xs font-medium tracking-wider text-zinc-400">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#c8a165] animate-pulse shrink-0"></span>
              <span className="text-zinc-300 font-light truncate">{topBannerText}</span>
            </div>
            <div className="hidden md:flex items-center gap-6 shrink-0">
              <span className="text-[#c8a165] tracking-[0.2em] font-semibold text-[11px] uppercase">
                {announcementBadge}
              </span>
              <span className="text-zinc-700">|</span>
              <a
                href="https://wa.me/905358746909"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-[#25D366] transition flex items-center gap-1.5 text-xs font-medium"
              >
                <span className="text-[#25D366]">💬 WhatsApp Sipariş:</span>
                <strong className="text-white font-bold">{contactPhone}</strong>
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-[#c8a165]/50 transition shadow-sm active:scale-95"
              aria-label="Menüyü Aç"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="LUMERA"
                  className="h-9 sm:h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden lg:block border-l border-white/10 pl-4 py-1">
                <p className="text-[11px] tracking-widest text-[#c8a165] uppercase font-semibold">
                  {brandTagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              title="Ana Sayfa"
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all shadow-sm ${
                pathname === "/"
                  ? "bg-[#c8a165]/15 border-[#c8a165] text-[#e5c184]"
                  : "bg-white/5 border-white/10 hover:border-[#c8a165]/50 hover:bg-[#c8a165]/10 text-zinc-300 hover:text-[#e5c184]"
              }`}
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
              <span>Ana Sayfa</span>
            </Link>

            <Link
              href="/hakkimizda"
              title="Hakkımızda"
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all shadow-sm ${
                pathname === "/hakkimizda"
                  ? "bg-[#c8a165]/15 border-[#c8a165] text-[#e5c184]"
                  : "bg-white/5 border-white/10 hover:border-[#c8a165]/50 hover:bg-[#c8a165]/10 text-zinc-300 hover:text-[#e5c184]"
              }`}
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
              <span>Hakkımızda</span>
            </Link>

            <Link
              href="/iletisim"
              title="İletişim"
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all shadow-sm ${
                pathname === "/iletisim"
                  ? "bg-[#c8a165]/15 border-[#c8a165] text-[#e5c184]"
                  : "bg-white/5 border-white/10 hover:border-[#c8a165]/50 hover:bg-[#c8a165]/10 text-zinc-300 hover:text-[#e5c184]"
              }`}
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
              <span>İletişim</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Favorites Icon Button with Counter Badge */}
            <Link
              href="/account/favorites"
              title="Favorilerim"
              className="relative p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-white/10 text-zinc-300 hover:text-rose-400 transition shadow-sm"
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
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-[9px] sm:text-[11px] font-bold text-white shadow-md animate-bounce">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
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
                  className="hidden sm:flex p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-white/10 text-zinc-300 hover:text-[#c8a165] transition shadow-sm"
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
                      className="relative hidden sm:flex p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c8a165]/50 hover:bg-white/10 text-zinc-300 hover:text-[#e5c184] transition shadow-sm"
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
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[9px] sm:text-[11px] font-extrabold text-black shadow-md animate-pulse">
                          {unreadMessageCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      href="/admin"
                      className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-[#c8a165]/20 border border-[#c8a165]/40 text-xs font-semibold text-[#e5c184] hover:bg-[#c8a165]/30 transition shadow-sm"
                    >
                      Admin
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  title="Çıkış Yap"
                  className="hidden sm:block p-2 text-xs text-zinc-400 hover:text-red-400 transition"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
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
              className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-200 transition hover:border-[#c8a165] hover:bg-white/10 hover:shadow-[0_0_15px_rgba(200,161,101,0.3)] shadow-sm"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#e5c184] to-[#c8a165] text-[9px] sm:text-[11px] font-bold text-black shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-[82%] max-w-[340px] bg-[#0c0e17] border-r border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-50">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/logo.png" alt="LUMERA" className="h-10 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* User Greeting if logged in */}
              {user && (
                <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#c8a165]/10 to-white/5 border border-[#c8a165]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase tracking-wider">
                      Giriş Yapıldı
                    </span>
                    <span className="text-sm font-bold gold-gradient-text">
                      {user.name}
                    </span>
                  </div>
                  {user.role === "ADMIN" && (
                    <span className="text-[10px] font-bold uppercase bg-[#c8a165] text-black px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              )}

              {/* Category Links */}
              <div className="mt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c8a165]">
                  ÖZEL KOLEKSİYONLAR
                </span>
                <nav className="mt-3 space-y-1.5">
                  {navCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/kategori/${encodeURIComponent(cat.slug)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#c8a165]/15 border border-white/5 hover:border-[#c8a165]/40 text-zinc-200 hover:text-[#e5c184] transition"
                    >
                      <span className="flex items-center gap-3 text-sm font-medium">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-zinc-500 text-xs">→</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Corporate Links */}
              <div className="mt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                  KURUMSAL & DESTEK
                </span>
                <nav className="mt-3 space-y-1">
                  <Link
                    href="/hakkimizda"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-300 hover:text-[#c8a165] transition"
                  >
                    Hakkımızda & Hikayemiz
                  </Link>
                  <Link
                    href="/iletisim"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-300 hover:text-[#c8a165] transition"
                  >
                    İletişim & Konum
                  </Link>
                  <Link
                    href="/sozlesmeler/mesafeli-satis"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-white transition text-xs"
                  >
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  <Link
                    href="/sozlesmeler/iptal-iade"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-white transition text-xs"
                  >
                    İade ve İptal Şartları
                  </Link>
                </nav>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-white hover:bg-white/15 transition"
                  >
                    Hesabımı Yönet →
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#c8a165]/20 border border-[#c8a165]/50 text-xs font-bold text-[#e5c184] transition"
                    >
                      🛠️ Yönetim Paneli
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-xs text-rose-400 hover:text-rose-300 text-center transition"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 rounded-full border border-white/20 bg-white/5 text-center text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 rounded-full gold-gradient-btn text-center text-xs font-extrabold text-black shadow-md"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}

              <div className="pt-3 space-y-2">
                <a
                  href="https://wa.me/905358746909?text=Merhaba,%20sipari%C5%9F%20vermek%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] text-black font-extrabold text-xs shadow-lg hover:bg-[#20bd5a] transition"
                >
                  <span>💬</span>
                  <span>WhatsApp ile Sipariş Ver</span>
                </a>

                <div className="text-center text-[11px] text-zinc-400 space-y-0.5">
                  <p>
                    <span>Müşteri Desteği: </span>
                    <strong className="text-[#e5c184]">{contactPhone}</strong>
                  </p>
                  <p>
                    <a href="mailto:lumeratasarim@gmail.com" className="text-zinc-400 hover:text-[#c8a165]">
                      lumeratasarim@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#090a0f]/95 backdrop-blur-2xl border-t border-white/10 safe-bottom shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-5 items-center justify-around py-2 px-1 text-center">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 transition ${
              pathname === "/" ? "text-[#c8a165]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium tracking-tight">Ana Sayfa</span>
          </Link>

          {/* Categories Button (opens drawer) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-[#c8a165] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium tracking-tight">Koleksiyon</span>
          </button>

          {/* Favorites */}
          <Link
            href="/account/favorites"
            className={`relative flex flex-col items-center gap-1 transition ${
              pathname.includes("/favorites") ? "text-rose-400" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="relative">
              <svg
                className={`w-5 h-5 ${favoriteCount > 0 ? "fill-rose-500 text-rose-500" : "fill-none stroke-current"}`}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white">
                  {favoriteCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Favoriler</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className={`relative flex flex-col items-center gap-1 transition ${
              pathname === "/cart" ? "text-[#c8a165]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c8a165] text-[9px] font-extrabold text-black">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Sepetim</span>
          </Link>

          {/* Account */}
          <Link
            href={user ? "/account" : "/login"}
            className={`flex flex-col items-center gap-1 transition ${
              pathname.includes("/account") || pathname === "/login" ? "text-[#c8a165]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium tracking-tight">
              {user ? "Hesabım" : "Giriş"}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}