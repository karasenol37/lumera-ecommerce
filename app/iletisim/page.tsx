import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/services/settingsService";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const phone = settings.contactPhone || "0850 XXX XX XX";
  const email = settings.contactEmail || "destek@lumera.com";
  const address = settings.contactAddress || "İstanbul / Türkiye";

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            BİZE ULAŞIN
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
            İletişim & Müşteri Desteği
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto font-light">
            Sorularınız, özel üretim siparişleriniz veya önerileriniz için dilediğiniz zaman bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* İletişim Bilgileri Kartları */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a165]/20 text-[#e5c184] text-2xl mb-4">
                🏢
              </div>
              <h3 className="text-lg font-bold text-white">Şirket Unvanı & Adres</h3>
              <p className="text-xs text-zinc-400 mt-1">LUMERA Outdoor & Bahçe Mobilyaları San. Tic. A.Ş.</p>
              <p className="text-sm text-zinc-300 mt-3 flex items-start gap-2">
                <span>📍</span>
                <span>{address}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a165]/20 text-[#e5c184] text-2xl mb-4">
                📞
              </div>
              <h3 className="text-lg font-bold text-white">Telefon & Müşteri Hizmetleri</h3>
              <p className="text-xs text-zinc-400 mt-1">Hafta içi 09:00 - 18:00 saatleri arasında aktif.</p>
              <p className="text-sm font-semibold text-[#e5c184] mt-3">
                ☎ {phone}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a165]/20 text-[#e5c184] text-2xl mb-4">
                ✉️
              </div>
              <h3 className="text-lg font-bold text-white">E-posta & Destek</h3>
              <p className="text-xs text-zinc-400 mt-1">Tüm e-postalarınıza 24 saat içinde yanıt verilir.</p>
              <p className="text-sm font-semibold text-[#e5c184] mt-3">
                ✉ {email}
              </p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Bize Mesaj Gönderin
            </h2>
            <p className="text-xs text-zinc-400 mb-8 font-light">
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
