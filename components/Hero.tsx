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
      <div className="relative z-20 mx-auto max-w-7xl px-6 py-24 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a165]/30 bg-[#c8a165]/10 px-4 py-2 text-xs font-semibold tracking-[0.25em] text-[#e5c184] backdrop-blur-md shadow-lg shadow-[#c8a165]/5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8a165] animate-ping" />
            {heroBadge}
          </div>

          {/* Main Title */}
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl leading-none">
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-300 font-light">
            {heroSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}