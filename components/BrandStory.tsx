export default function BrandStory() {
  return (
    <section className="relative bg-[#090a0f] px-6 py-28 text-white border-t border-white/5 overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 items-center">
        <div>
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA BRAND STORY
          </span>

          <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl leading-tight">
            Doğadan İlham Alan <br />
            <span className="gold-gradient-text">Zamansız Tasarımlar</span>
          </h2>

          <p className="mt-6 text-base leading-relaxed text-zinc-300 font-light">
            LUMERA, masif doğal ahşabın sıcaklığını ve dayanıklılığını modern mimari tasarım anlayışıyla buluşturur.
          </p>

          <p className="mt-4 text-base leading-relaxed text-zinc-400 font-light">
            Bahçeler, geniş teraslar ve havuz başı yaşam alanları için dış mekan koşullarına dirençli, estetik ve maksimum konfor sağlayan ultra-lüks dinlenme ürünleri üretiyoruz.
          </p>

          <div className="mt-8 flex items-center gap-8 border-t border-white/10 pt-8">
            <div>
              <span className="text-3xl font-extrabold gold-gradient-text block">%100</span>
              <span className="text-xs text-zinc-400">Doğal Ahşap İşçiliği</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-3xl font-extrabold gold-gradient-text block">10+ Yıl</span>
              <span className="text-xs text-zinc-400">Malzeme Ömrü</span>
            </div>
          </div>
        </div>

        <div className="relative h-[450px] overflow-hidden rounded-3xl border border-white/10 bg-[#121420]/80 backdrop-blur-md shadow-2xl group">
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