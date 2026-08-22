import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Hamak",
    image: "/images/categories/hamak.jpg",
    desc: "Masif Ahşap Standlı & Lüks Pamuklu Hamaklar",
  },
  {
    name: "Şemsiye",
    image: "/images/categories/semsiye.jpg",
    desc: "Güneş Korumalı Premium Cantilever Bahçe Şemsiyeleri",
  },
  {
    name: "Şezlong",
    image: "/images/categories/sezlong.jpg",
    desc: "Ergonomik Tasarımlı Teak Ağacı Havuz & Bahçe Şezlongları",
  },
  {
    name: "Ateş Çukuru",
    image: "/images/categories/ates-cukuru.jpg",
    desc: "Akşam Keyfi İçin Özel Tasarım Çelik Ateş Çukurları",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            ÖZEL KOLEKSİYONLAR
          </span>
          <h2 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
            Kategorileri Keşfedin
          </h2>
        </div>
        <p className="mt-4 md:mt-0 text-zinc-400 max-w-md font-light">
          Açık hava yaşam alanlarınız için en ince detayına kadar düşünülmüş gerçek premium koleksiyonlar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-3 right-3 rounded-full bg-[#090a0f]/80 backdrop-blur-md px-3 py-1 text-[10px] font-semibold tracking-wider text-[#c8a165] border border-[#c8a165]/30">
                KOLEKSİYON
              </div>
            </div>

            {/* İçerik */}
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-xl font-bold text-white transition-colors duration-200 group-hover:text-[#c8a165]">
                  {category.name}
                </h3>
                <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
                  {category.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#c8a165]">
                <span>Koleksiyonu İncele</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}