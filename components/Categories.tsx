import { getSiteSettings } from "@/lib/services/settingsService";
import CategoriesSlider from "./CategoriesSlider";

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
      image: settings.category_image_ates_cukuru || "/images/categories/ates-cukuru.jpg",
      desc: "Akşam Keyfi İçin Özel Tasarım Çelik Ateş Çukurları",
    },
    {
      name: "Tamamlayıcı Ürünler",
      image: settings.category_image_tamamlayici || "/images/categories/tamamlayici-urunler.jpg",
      desc: "Şemsiye Ayağı & Şemsiye Altlığı, Hamak & Şezlong Parçaları, Minderler",
    },
  ];

  return (
    <section id="kategoriler" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            ÖZEL KOLEKSİYONLAR
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Modeller & Koleksiyonlar
          </h2>
        </div>
        <p className="mt-2 sm:mt-4 md:mt-0 text-zinc-400 max-w-md text-xs sm:text-sm font-light">
          Açık hava yaşam alanlarınız için en ince detayına kadar düşünülmüş gerçek premium koleksiyonlar.
        </p>
      </div>

      <CategoriesSlider categories={categories} />
    </section>
  );
}