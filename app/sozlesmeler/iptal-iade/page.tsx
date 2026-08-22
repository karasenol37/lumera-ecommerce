import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/services/settingsService";

export default async function ReturnPolicyPage() {
  const settings = await getSiteSettings();

  const phone = settings.contactPhone || "0535 874 69 09";
  const email = settings.contactEmail || "lumeratasarim@gmail.com";

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-5xl px-6 py-20 w-full">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            MÜŞTERİ MEMNUNİYETİ
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
            İptal ve İade Koşulları
          </h1>
          <p className="mt-3 text-zinc-400 text-sm font-light">
            LUMERA'dan verdiğiniz siparişlerin iade ve değişim süreçlerine dair bilgilendirme.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 sm:p-12 backdrop-blur-md shadow-2xl space-y-8 text-sm text-zinc-300 leading-relaxed font-light">
          {/* İADE SÜRECİ */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>↩️</span> 14 Gün İade Hakkı
            </h2>
            <p>
              LUMERA'dan satın aldığınız tüm standart ürünleri, teslim aldığınız tarihten itibaren <strong>14 (on dört) gün</strong> içerisinde herhangi bir gerekçe göstermeksizin iade edebilir veya değiştirebilirsiniz.
            </p>
          </section>

          {/* İADE ŞARTLARI */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>📦</span> İade Şartları ve Dikkat Edilmesi Gerekenler
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>İade edilecek ürünün koruyucu ambalajı, kutusu ve varsa standart aksesuarları ile birlikte hasarsız ve eksiksiz olarak tarafımıza ulaştırılması gerekmektedir.</li>
              <li>Ürünün kurulumu yapılmış, açık hava koşullarında yıpranmış veya lekelenmiş ürünlerde iade kabul edilememektedir.</li>
              <li>Müşterinin özel istekleri veya kişisel ihtiyaçları doğrultusunda özel ölçü ve renkte üretilen kişiselleştirilmiş mobilyalarda iade hakkı geçerli değildir.</li>
            </ul>
          </section>

          {/* İADE ADIMLARI */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>📋</span> İade İşlemini Nasıl Başlatabilirsiniz?
            </h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Destek Ekibiyle İletişim:</strong> İade talebinizi <strong>{email}</strong> e-posta adresimize sipariş numaranız ile iletin veya <strong>{phone}</strong> hattımızı arayın.
              </li>
              <li>
                <strong>Kargo Gönderim Kodu:</strong> Müşteri temsilcimiz tarafınıza anlaşmalı kargo firmamızın iade gönderim kodunu tanımlayacaktır.
              </li>
              <li>
                <strong>Ürün Kontrolü & Geri Ödeme:</strong> İade edilen ürün depomuza ulaştıktan sonra teknik inceleme yapılır. Kontrolü onaylanan ürünlerin ücreti <strong>3 ile 7 iş günü</strong> içerisinde kartınıza iade edilir (İyzico altyapısı üzerinden otomatik ödenir).
              </li>
            </ol>
          </section>

          {/* SİPARİŞ İPTALİ */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>🚫</span> Sipariş İptali
            </h2>
            <p>
              Henüz kargoya verilmemiş siparişlerinizi aynı gün içerisinde müşteri hizmetlerimiz ile iletişime geçerek anında ücretsiz olarak iptal edebilirsiniz. Kargoya verilmiş siparişlerde ise iade süreci geçerli olmaktadır.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
