const items = [
  {
    icon: "🌲",
    title: "Doğal Masif Ahşap",
    text: "Özenle seçilmiş, fırınlanmış ve dış hava şartlarına dayanıklı masif ahşap malzemeler.",
  },
  {
    icon: "✨",
    title: "Usta El İşçiliği",
    text: "Her bir detayında geleneksel zanaat ve modern mühendisliğin kusursuz birleşimi.",
  },
  {
    icon: "⏳",
    title: "Uzun Ömür & Garanti",
    text: "UV ışınlarına, neme ve zorlu mevsim koşullarına karşı uzun yıllar tam dayanıklılık.",
  },
];

export default function QualitySection() {
  return (
    <section className="bg-[#090a0f] px-4 sm:px-6 py-14 sm:py-24 text-white border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA FARKI
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold">
            Neden LUMERA?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-light">
            Sıradanlıktan uzak, yaşam alanlarınıza değer katan benzersiz kalite standartlarımız.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-[#121420]/70 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-[#c8a165]/50 hover:-translate-y-1"
            >
              <span className="text-2xl sm:text-3xl block mb-4">{item.icon}</span>
              <h3 className="text-base sm:text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-light">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}