const advantages = [
  {
    icon: "🚚",
    title: "Hızlı & Ücretsiz Kargo",
    text: "750 TL ve üzeri siparişlerde Türkiye geneline güvenli ve sigortalı hızlı teslimat.",
  },
  {
    icon: "🛡️",
    title: "256-Bit SSL Güvencesi",
    text: "İyzico ve 256-bit SSL korumalı altyapı ile %100 güvenli ödeme imkanı.",
  },
  {
    icon: "↩️",
    title: "14 Gün İade Garantisi",
    text: "Memnun kalmadığınız ürünlerde 14 gün içerisinde kolay ve sorunsuz iade seçeneği.",
  },
  {
    icon: "💎",
    title: "Premium Müşteri Hizmeti",
    text: "Üretimden teslimata kadar her adımda kişiye özel özel müşteri danışmanlığı.",
  },
];

export default function Advantages() {
  return (
    <section className="relative bg-[#090a0f] py-12 sm:py-24 border-t border-b border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="mb-8 sm:mb-16 text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA DEDICATION
          </span>
          <h2 className="mt-1.5 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Ayrıcalıklı Alışveriş Deneyimi
          </h2>
          <p className="mt-2 sm:mt-4 text-xs sm:text-base text-zinc-400 max-w-2xl mx-auto font-light">
            Birinci sınıf doğal malzemeler, üst düzey ustalık ve sorunsuz müşteri desteği ile tanışın.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-white/10 bg-[#121420]/60 p-4 sm:p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#c8a165]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col items-center text-center justify-between"
            >
              <div className="flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl border border-[#c8a165]/30 bg-[#090a0f] text-xl sm:text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:border-[#c8a165]">
                {item.icon}
              </div>

              <h3 className="mt-3 sm:mt-6 text-xs sm:text-lg font-bold text-white leading-snug">
                {item.title}
              </h3>

              <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm leading-relaxed text-zinc-400 font-light line-clamp-3 sm:line-clamp-none">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}