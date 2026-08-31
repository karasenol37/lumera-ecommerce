import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/services/settingsService";

export default async function PrivacyKvkkPage() {
  const settings = await getSiteSettings();

  const email = settings.contactEmail || "lumeratasarim@gmail.com";

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-5xl px-6 py-20 w-full">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            VERİ GÜVENLİĞİ
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
            Gizlilik Politikası ve KVKK Metni
          </h1>
          <p className="mt-3 text-zinc-400 text-sm font-light">
            6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca aydınlatma metnimizdir.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 sm:p-12 backdrop-blur-md shadow-2xl space-y-8 text-sm text-zinc-300 leading-relaxed font-light">
          {/* VERİ SORUMLUSU */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. VERİ SORUMLUSU KİMLİĞİ</h2>
            <p>
              LUMERA Luxury Outdoor & Tasarım San. Tic. A.Ş. olarak kişisel verilerinizin güvenliğine ve gizliliğine büyük önem veriyoruz. İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla hazırlanmıştır.
            </p>
          </section>

          {/* İŞLENEN KİŞİSEL VERİLER */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. İŞLENEN KİŞİSEL VERİLER VE İŞLEME AMACI</h2>
            <p>Sitemiz üzerinden alışveriş yaparken işlenen kişisel verileriniz şunlardır:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad.</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, teslimat ve fatura adresi.</li>
              <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, oturum bilgileri.</li>
            </ul>
            <p className="mt-3">
              Bu veriler; siparişlerin işlenmesi, ürünlerin tarafınıza teslim edilmesi, faturalandırma yapılması ve müşteri destek hizmetlerinin yürütülmesi amaçlarıyla işlenmektedir.
            </p>
          </section>

          {/* ÖDEME GÜVENLİĞİ */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. ÖDEME GÜVENLİĞİ VE KREDİ KARTI BİLGİLERİ</h2>
            <p>
              Sitemiz üzerinden yapılan tüm kredi kartı ödemeleri 256-bit SSL korumalı altyapı üzerinden <strong>İyzico Ödeme Hizmetleri A.Ş.</strong> aracılığıyla gerçekleşmektedir. Kredi kartı numaranız, CVV kodunuz ve son kullanma tarihiniz kesinlikle sunucularımızda saklanmaz veya kaydedilmez.
            </p>
          </section>

          {/* ÇEREZ POLİTİKASI */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. ÇEREZ (COOKIE) POLİTİKASI</h2>
            <p>
              Kullanıcı deneyiminizi iyileştirmek, sepetinizdeki ürünleri hatırda tutmak ve site performansını analiz etmek amacıyla zorunlu ve analitik çerezler kullanılmaktadır. Dilediğiniz zaman tarayıcı ayarlarınızdan çerez tercihlerinizi değiştirebilirsiniz.
            </p>
          </section>

          {/* KVKK HAKLARI */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. KVKK KAPSAMINDAKİ HAKLARINIZ</h2>
            <p>
              KVKK'nın 11. maddesi uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, verilerinizin düzeltilmesini veya silinmesini isteme hakkına sahipsiniz. Taleplerinizi <strong>{email}</strong> adresimize iletebilirsiniz.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
