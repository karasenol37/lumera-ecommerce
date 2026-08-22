export default function CollectionBanner() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-32 text-white border-t border-b border-white/5">
      <div className="absolute inset-0 bg-[url('/images/banner.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f] via-[#090a0f]/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[10px] sm:text-xs font-semibold text-[#c8a165] tracking-[0.3em] sm:tracking-[0.4em] uppercase">
          YENİ KOLEKSİYON
        </p>

        <h2 className="mt-3 sm:mt-5 text-3xl sm:text-6xl font-black">
          Outdoor <br className="hidden sm:inline" />
          <span className="gold-gradient-text">Luxury Living</span>
        </h2>

        <a
          href="#urunler"
          className="mt-6 sm:mt-8 inline-block rounded-full gold-gradient-btn px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-extrabold text-black shadow-2xl hover:scale-105 transition-transform"
        >
          Koleksiyonu İncele →
        </a>
      </div>
    </section>
  );
}