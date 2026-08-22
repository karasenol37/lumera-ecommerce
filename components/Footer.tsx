import Link from "next/link";
import { getSiteSettings } from "@/lib/services/settingsService";

export default async function Footer() {
  const settings = await getSiteSettings();

  const brandTagline =
    settings.brandTagline || "Gölgede zarafet, dinlenmede ayrıcalık.";
  const contactPhone = settings.contactPhone || "0850 XXX XX XX";
  const contactEmail = settings.contactEmail || "destek@lumera.com";
  const contactAddress = settings.contactAddress || "İstanbul / Türkiye";

  return (
    <footer className="relative bg-[#06070a] border-t border-white/10 text-zinc-400 font-light pb-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Info */}
          <div className="space-y-3 sm:space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-wider gold-gradient-text">
                LUMERA
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 max-w-sm">
              {brandTagline} Doğal masif ahşap ve lüks dış mekan mobilya koleksiyonu.
            </p>
            <div className="pt-1 flex items-center gap-4 text-zinc-400 text-base sm:text-lg">
              <span className="hover:text-[#c8a165] cursor-pointer transition">📷</span>
              <span className="hover:text-[#c8a165] cursor-pointer transition">🌐</span>
              <span className="hover:text-[#c8a165] cursor-pointer transition">▶</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase mb-3 sm:mb-5">
              Koleksiyonlar
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/kategori/Hamak" className="hover:text-[#c8a165] transition">
                  Hamak Serisi
                </Link>
              </li>
              <li>
                <Link href="/kategori/Şezlong" className="hover:text-[#c8a165] transition">
                  Lüks Şezlonglar
                </Link>
              </li>
              <li>
                <Link href="/kategori/Bahçe Mobilyaları" className="hover:text-[#c8a165] transition">
                  Bahçe Mobilyaları
                </Link>
              </li>
              <li>
                <Link href="/kategori/Şemsiye" className="hover:text-[#c8a165] transition">
                  Güneş Şemsiyeleri
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Legal */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase mb-3 sm:mb-5">
              Kurumsal & Yasal
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/sozlesmeler/mesafeli-satis" className="hover:text-[#c8a165] transition">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/sozlesmeler/iptal-iade" className="hover:text-[#c8a165] transition">
                  İade ve İptal Koşulları
                </Link>
              </li>
              <li>
                <Link href="/sozlesmeler/gizlilik-kvkk" className="hover:text-[#c8a165] transition">
                  Gizlilik & KVKK Politikası
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#c8a165] transition">
                  Sipariş Takibi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase mb-3 sm:mb-5">
              İletişim
            </h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <span className="text-[#c8a165]">☎</span> {contactPhone}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#c8a165]">✉</span> {contactEmail}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#c8a165]">📍</span> {contactAddress}
              </p>
              <div className="pt-2">
                <Link
                  href="/iletisim"
                  className="inline-block text-xs font-semibold text-[#c8a165] border border-[#c8a165]/40 rounded-full px-4 py-2 hover:bg-[#c8a165] hover:text-black transition"
                >
                  İletişim Sayfası →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-16 border-t border-white/5 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-zinc-500">
          <p>© 2026 LUMERA Outdoor. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/sozlesmeler/gizlilik-kvkk" className="hover:text-zinc-300">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/sozlesmeler/gizlilik-kvkk" className="hover:text-zinc-300">
              Çerez Politikası
            </Link>
            <Link href="/sozlesmeler/mesafeli-satis" className="hover:text-zinc-300">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}