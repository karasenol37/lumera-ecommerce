import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/services/settingsService";

export default async function DistanceSellingAgreementPage() {
  const settings = await getSiteSettings();

  const phone = settings.contactPhone || "0850 XXX XX XX";
  const email = settings.contactEmail || "destek@lumera.com";
  const address = settings.contactAddress || "İstanbul / Türkiye";

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-5xl px-6 py-20 w-full">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            YASAL BİLGİLENDİRME
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="mt-3 text-zinc-400 text-sm font-light">
            6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca hazırlanan resmi sözleşmedir.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 sm:p-12 backdrop-blur-md shadow-2xl space-y-8 text-sm text-zinc-300 leading-relaxed font-light">
          {/* MADDE 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">MADDE 1 - TARAFLAR</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#090a0f] p-6 rounded-2xl border border-white/5">
              <div>
                <h3 className="font-bold text-[#e5c184] mb-2">SATICI BİLGİLERİ</h3>
                <p><strong>Unvan:</strong> LUMERA Outdoor & Bahçe Mobilyaları San. Tic. A.Ş.</p>
                <p><strong>Adres:</strong> {address}</p>
                <p><strong>Telefon:</strong> {phone}</p>
                <p><strong>E-posta:</strong> {email}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#e5c184] mb-2">ALICI BİLGİLERİ</h3>
                <p>Sözleşme; ALICI'nın internet sitesi üzerinden sipariş formu alanında beyan ettiği ad soyad, adres, e-posta ve telefon bilgileri esas alınarak kurulur.</p>
              </div>
            </div>
          </section>

          {/* MADDE 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">MADDE 2 - SÖZLEŞMENİN KONUSU</h2>
            <p>
              İşbu Sözleşme'nin konusu; ALICI'nın SATICI'ya ait <strong>lumera.com</strong> internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </section>

          {/* MADDE 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">MADDE 3 - ÜRÜN VEYA HİZMETİN NİTELİKLERİ VE FİYATI</h2>
            <p>
              Malın veya hizmetin türü, miktarı, marka/modeli, rengi, adedi, satış bedeli, ödeme şekli ve teslimat bilgileri siparişin sonlandığı andaki bilgilerden oluşmaktadır ve ALICI'nın e-posta adresine bilgilendirme olarak gönderilmektedir.
            </p>
          </section>

          {/* MADDE 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">MADDE 4 - GENEL HÜKÜMLER</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>ALICI, SATICI'ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</li>
              <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.</li>
              <li>SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzları ile teslim edilmesinden sorumludur.</li>
            </ul>
          </section>

          {/* MADDE 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">MADDE 5 - CAYMA HAKKI</h2>
            <p>
              ALICI; mal satışına ilişkin mesafeli sözleşmelerde, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren <strong>14 (on dört) gün</strong> içerisinde, SATICI'ya bildirmek şartıyla hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.
            </p>
            <p className="mt-2">
              Cayma hakkının kullanılması için 14 günlük süre içinde SATICI'ya e-posta veya telefon ile yazılı bildirimde bulunulması ve ürünün işbu sözleşmede düzenlenen Cayma Hakkı Kullanılamayacak Ürünler hükümleri çerçevesinde kullanılmamış olması şarttır.
            </p>
          </section>

          {/* MADDE 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">MADDE 6 - YETKİLİ MAHKEME</h2>
            <p>
              İşbu sözleşmenin uygulanmasında, Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
