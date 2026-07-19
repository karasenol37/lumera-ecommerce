import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[88vh] overflow-hidden">
      {/* Arka plan görseli */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-luxury.jpg"
          alt="LUMERA"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Karartma katmanı */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Altın degrade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* İçerik */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-2xl">
          <p className="text-sm tracking-[0.45em] text-[#c8a165]">
            LUMERA COLLECTION
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Gölgede
            <span className="block text-[#c8a165]">zarafet</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-200 md:text-xl">
            El işçiliğiyle üretilen ahşap hamaklar, şezlonglar ve dış mekan
            koleksiyonlarıyla bahçenizi bir yaşam alanına dönüştürün.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#urunler"
              className="rounded-full bg-[#c8a165] px-8 py-4 text-center font-semibold text-black transition hover:bg-[#d6b47c]"
            >
              Koleksiyonu Keşfet
            </Link>

            <Link
              href="/kategori/Hamak"
              className="rounded-full border border-white/30 bg-white/5 px-8 py-4 text-center font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Hamakları İncele
            </Link>
          </div>

          {/* Marka metrikleri */}
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-3xl font-bold text-[#c8a165]">100+</p>
              <p className="mt-1 text-sm text-gray-300">Premium ürün</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-[#c8a165]">%100</p>
              <p className="mt-1 text-sm text-gray-300">Doğal ahşap</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-[#c8a165]">24h</p>
              <p className="mt-1 text-sm text-gray-300">Hızlı kargo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs tracking-[0.3em]">SCROLL</span>
          <div className="h-10 w-px bg-gradient-to-b from-[#c8a165] to-transparent" />
        </div>
      </div>
    </section>
  );
}