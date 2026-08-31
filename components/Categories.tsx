import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Hamak",
    image: "/images/categories/hamak.jpg",
    desc: "Masif Ahşap Standlı & Lüks Pamuklu Hamaklar",
  },
  {
    name: "Lüks Şezlong",
    image: "/images/categories/sezlong.jpg",
    desc: "Ergonomik Tasarımlı Teak Ağacı Havuz & Teras Şezlongları",
  },
  {
    name: "Şemsiye Modelleri",
    image: "/images/categories/semsiye.jpg",
    desc: "Güneş Korumalı Premium Dış Mekan Şemsiyeleri",
  },
  {
    name: "Ateş Çukurları",
    image: "/images/categories/ates-cukuru.jpg",
    desc: "Akşam Keyfi İçin Özel Tasarım Çelik Ateş Çukurları",
  },
];

export default function Categories() {
  return (
    <section id="kategoriler" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            ÖZEL KOLEKSİYONLAR
          </span>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Kategorileri Keşfedin
          </h2>
        </div>
        <p className="mt-2 sm:mt-4 md:mt-0 text-zinc-400 max-w-md text-xs sm:text-sm font-light">
          Açık hava yaşam alanlarınız için en ince detayına kadar düşünülmüş gerçek premium koleksiyonlar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/kategori/${encodeURIComponent(category.name)}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121420]/70 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#c8a165]/60 hover:shadow-[0_15px_35px_rgba(200,161,101,0.2)]"
          >
            {/* Görsel Konteyneri */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-[#090a0f]/80 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#c8a165] border border-[#c8a165]/30">
                KOLEKSİYON
              </div>
            </div>

            {/* İçerik */}
            <div className="p-3 sm:p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-sm sm:text-xl font-bold text-white transition-colors duration-200 group-hover:text-[#c8a165] truncate sm:whitespace-normal">
                  {category.name}
                </h3>
                <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-zinc-400 font-light leading-snug line-clamp-2">
                  {category.desc}
                </p>
              </div>

              <div className="mt-3 sm:mt-6 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#c8a165]">
                <span>İncele</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}