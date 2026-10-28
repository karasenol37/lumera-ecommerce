import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/services/settingsService";

export default async function Categories() {
  const settings = await getSiteSettings();

  const categories = [
    {
      name: "Hamak",
      image: settings.category_image_hamak || "/images/categories/hamak.jpg",
      desc: "Masif Ahşap Standlı & Lüks Pamuklu Hamaklar",
    },
    {
      name: "Lüks Şezlong",
      image: settings.category_image_sezlong || "/images/categories/sezlong.jpg",
      desc: "Ergonomik Tasarımlı Teak Ağacı Havuz & Teras Şezlongları",
    },
    {
      name: "Şemsiye Modelleri",
      image: settings.category_image_semsiye || "/images/categories/semsiye.jpg",
      desc: "Yandan Gövdeli & Güneş Korumalı Dış Mekan Şemsiyeleri",
    },
    {
      name: "Ateş Çukurları",
      image:
        settings.category_image_ates_cukuru ||
        "/images/categories/ates-cukuru.jpg",
      desc: "Akşam Keyfi İçin Özel Tasarım Çelik Ateş Çukurları",
    },
    {
      name: "Tamamlayıcı Ürünler",
      image:
        settings.category_image_tamamlayici ||
        "/images/categories/tamamlayici-urunler.jpg",
      desc: "Şemsiye Ayağı & Şemsiye Altlığı, Hamak & Şezlong Parçaları, Minderler",
    },
  ];

  return (
    <section
      id="kategoriler"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            ÖZEL KOLEKSİYONLAR
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Modeller & Koleksiyonlar
          </h2>
        </div>
        <p className="mt-2 sm:mt-4 md:mt-0 text-zinc-300 max-w-md text-xs sm:text-sm font-light">
          Açık hava yaşam alanlarınız için en ince detayına kadar düşünülmüş gerçek premium koleksiyonlar.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/kategori/${encodeURIComponent(category.name)}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#1e242d]/90 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#c8a165]/60 hover:shadow-[0_15px_35px_rgba(200,161,101,0.2)]"
          >
            {/* Görsel Konteyneri: Çerçeveye tam doldurulan görsel */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#151920]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-fill transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e242d]/70 via-transparent to-transparent opacity-50" />

              <div className="absolute top-2 right-2 rounded-full bg-[#151920]/80 backdrop-blur-md px-2 py-0.5 text-[8px] font-semibold tracking-wider text-[#e5c184] border border-[#c8a165]/30 shadow-sm">
                KOLEKSİYON
              </div>
            </div>

            {/* İçerik */}
            <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white transition-colors duration-200 group-hover:text-[#c8a165] line-clamp-1">
                  {category.name}
                </h3>
                <p className="mt-1 text-[11px] sm:text-xs text-zinc-300 font-light leading-snug line-clamp-2">
                  {category.desc}
                </p>
              </div>

              <div className="mt-3 sm:mt-5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#c8a165]">
                <span>Modelleri İncele</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 text-sm">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
