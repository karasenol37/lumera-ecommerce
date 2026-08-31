export default function BrandStory() {
  return (
    <section className="relative bg-[#090a0f] px-4 sm:px-6 py-14 sm:py-28 text-white border-t border-white/5 overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-16 md:grid-cols-2 items-center">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA BRAND STORY
          </span>

          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Doğadan İlham Alan <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Zamansız Tasarımlar</span>
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-zinc-300 font-light">
            LUMERA, masif doğal ahşabın sıcaklığını ve dayanıklılığını modern mimari tasarım anlayışıyla buluşturur.
          </p>

          <p className="mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed text-zinc-400 font-light">
            Açık hava yaşam alanları, geniş teraslar ve havuz başı mekanlar için dış koşullara dirençli, estetik ve maksimum konfor sağlayan ultra-lüks dinlenme ürünleri üretiyoruz.
          </p>

          <div className="mt-6 sm:mt-8 flex items-center gap-6 sm:gap-8 border-t border-white/10 pt-6 sm:pt-8">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold gold-gradient-text block">%100</span>
              <span className="text-[11px] sm:text-xs text-zinc-400">Doğal Ahşap</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold gold-gradient-text block">Köklü Tecrübe</span>
              <span className="text-[11px] sm:text-xs text-zinc-400">Usta El İşçiliği</span>
            </div>
          </div>
        </div>

        <div className="relative h-64 sm:h-[450px] overflow-hidden rounded-3xl border border-white/10 bg-[#121420]/80 backdrop-blur-md shadow-2xl group">
          <img
            src="/images/hero-luxury.jpg"
            alt="LUMERA Brand Story"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </section>
  );
}