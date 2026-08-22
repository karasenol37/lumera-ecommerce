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
    <section className="relative bg-[#090a0f] py-24 border-t border-b border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA DEDICATION
          </span>
          <h2 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
            Ayrıcalıklı Alışveriş Deneyimi
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto font-light">
            Birinci sınıf doğal malzemeler, üst düzey ustalık ve sorunsuz müşteri desteği ile tanışın.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-white/10 bg-[#121420]/60 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#c8a165]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c8a165]/30 bg-[#090a0f] text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:border-[#c8a165]">
                {item.icon}
              </div>

              <h3 className="mt-6 text-lg font-bold text-white text-center">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400 text-center font-light">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}