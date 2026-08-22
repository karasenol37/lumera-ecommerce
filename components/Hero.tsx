import { getSiteSettings } from "@/lib/services/settingsService";

export default async function Hero() {
  const settings = await getSiteSettings();

  const heroBadge = settings.heroBadge || "LUMERA PREMIUM OUTDOOR 2026";
  const heroTitle = settings.heroTitle || "Gölgede Zarafet & Konfor";
  const heroSubtitle =
    settings.heroSubtitle ||
    "Bahçenizi sıradan bir alandan çıkarıp, doğal masif ahşap ve üst düzey el işçiliğiyle üretilmiş ultra-lüks bir dinlenme vahasına dönüştürün.";

  return (
    <section className="relative min-h-[90vh] overflow-hidden flex items-center justify-center bg-[#090a0f]">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8a165]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#a67c3b]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Background Image with Dark Vignette */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/hero-luxury.jpg"
          alt="LUMERA Luxury Outdoor"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-[10000ms] hover:scale-110 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f] via-[#090a0f]/40 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a165]/30 bg-[#c8a165]/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#e5c184] backdrop-blur-md shadow-lg shadow-[#c8a165]/5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8a165] animate-ping" />
            {heroBadge}
          </div>

          {/* Main Title */}
          <h1 className="mt-5 sm:mt-8 text-3.5xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight sm:leading-none">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-8 max-w-2xl text-sm sm:text-lg md:text-xl leading-relaxed text-zinc-300 font-light">
            {heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#urunler"
              className="rounded-full gold-gradient-btn px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold text-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span>Koleksiyonu Keşfet</span>
              <span>→</span>
            </a>

            <a
              href="https://wa.me/905358746909?text=Merhaba,%20sipari%C5%9F%20vermek%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-5 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#25D366] hover:bg-[#25D366] hover:text-black transition backdrop-blur-md flex items-center gap-2 shadow-lg hover:scale-105"
            >
              <span>💬</span>
              <span>WhatsApp Sipariş</span>
            </a>

            <a
              href="#kategoriler"
              className="rounded-full bg-white/5 border border-white/15 px-5 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/10 hover:border-[#c8a165]/50 transition backdrop-blur-md"
            >
              Kategoriler
            </a>
          </div>

          {/* Quick Contact Micro Info on Hero */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-400 font-light">
            <a
              href="https://wa.me/905358746909"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#25D366] transition"
            >
              <span className="text-[#25D366]">📱</span>
              <span>0535 874 69 09</span>
            </a>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <a
              href="mailto:lumeratasarim@gmail.com"
              className="flex items-center gap-1.5 hover:text-[#c8a165] transition"
            >
              <span className="text-[#c8a165]">✉️</span>
              <span>lumeratasarim@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}