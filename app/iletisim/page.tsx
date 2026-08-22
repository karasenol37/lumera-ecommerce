import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/services/settingsService";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const phone = settings.contactPhone || "0535 874 69 09";
  const email = settings.contactEmail || "lumeratasarim@gmail.com";
  const address = settings.contactAddress || "İstanbul / Türkiye";

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 w-full pb-24 md:pb-20">
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            BİZE ULAŞIN
          </span>
          <h1 className="mt-2 sm:mt-3 text-3xl sm:text-5xl font-extrabold text-white">
            İletişim & WhatsApp Sipariş Hattı
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-light">
            Sorularınız, ürün detayları veya doğrudan WhatsApp üzerinden sipariş vermek için dilediğiniz zaman bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* İletişim Bilgileri Kartları */}
          <div className="space-y-4 sm:space-y-6">
            {/* WhatsApp Card (High Priority) */}
            <div className="rounded-2xl border border-[#25D366]/40 bg-[#121420]/90 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#25D366] hover:shadow-[0_10px_30px_rgba(37,211,102,0.2)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#25D366] text-2xl mb-4">
                💬
              </div>
              <h3 className="text-lg font-bold text-white">WhatsApp Sipariş & Destek</h3>
              <p className="text-xs text-zinc-400 mt-1">Anında mesajlaşarak siparişinizi oluşturun veya soru sorun.</p>
              <p className="text-base font-bold text-[#25D366] mt-3">
                {phone}
              </p>
              <a
                href="https://wa.me/905358746909?text=Merhaba,%20ürünler%20ve%20sipariş%20hakkında%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] text-black font-extrabold text-xs shadow-md hover:bg-[#20bd5a] transition"
              >
                <span>WhatsApp ile Hemen Yazın →</span>
              </a>
            </div>

            {/* Telefon & Müşteri Hizmetleri */}
            <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a165]/20 text-[#e5c184] text-2xl mb-4">
                📞
              </div>
              <h3 className="text-lg font-bold text-white">Telefon İletişim</h3>
              <p className="text-xs text-zinc-400 mt-1">Haftanın her günü 09:00 - 21:00 saatleri arasında aktif.</p>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-block text-sm font-semibold text-[#e5c184] mt-3 hover:underline"
              >
                ☎ {phone}
              </a>
            </div>

            {/* E-posta & Destek */}
            <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a165]/20 text-[#e5c184] text-2xl mb-4">
                ✉️
              </div>
              <h3 className="text-lg font-bold text-white">E-posta & Destek</h3>
              <p className="text-xs text-zinc-400 mt-1">Tüm kurumsal soru ve talepleriniz için.</p>
              <a
                href={`mailto:${email}`}
                className="inline-block text-sm font-semibold text-[#e5c184] mt-3 hover:underline"
              >
                ✉ {email}
              </a>
            </div>

            {/* Adres */}
            <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a165]/20 text-[#e5c184] text-2xl mb-4">
                🏢
              </div>
              <h3 className="text-lg font-bold text-white">Adres & Üretim</h3>
              <p className="text-xs text-zinc-400 mt-1">LUMERA Outdoor & Bahçe Mobilyaları</p>
              <p className="text-sm text-zinc-300 mt-3 flex items-start gap-2">
                <span>📍</span>
                <span>{address}</span>
              </p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#121420]/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Bize Mesaj Gönderin
            </h2>
            <p className="text-xs text-zinc-400 mb-6 sm:mb-8 font-light">
              Formu doldurarak soru ve taleplerinizi iletebilirsiniz. Ekibimiz kısa süre içerisinde size dönüş yapacaktır.
            </p>

            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
