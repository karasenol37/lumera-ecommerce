import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Hakkımızda | LUMERA Luxury Outdoor",
  description:
    "Doğal masif ahşap, üst düzey zanaat ve modern estetiğin buluştuğu LUMERA Outdoor hikayesini keşfedin.",
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 w-full space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8a165]/30 bg-[#c8a165]/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#c8a165] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#e5c184] uppercase">
              LUMERA MİSYONU & HİKAYESİ
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Gölgede Zarafet, <br />
            <span className="gold-gradient-text">Doğada Lüksün Dokunuşu</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            LUMERA, açık hava yaşam alanlarını doğallığın ve masif ahşabın zamansız estetiğiyle birleştirerek ultra-lüks dinlenme vahalarına dönüştürmek amacıyla kurulmuştur.
          </p>
        </section>

        {/* Story & Vision Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Highlight */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121420]/80 backdrop-blur-2xl shadow-2xl group">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
                  alt="LUMERA Ahşap Zanaatı"
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-widest text-[#c8a165] uppercase">
                  ZAMANSIZ DİZAYN
                </span>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Kişiye Özel Doğal Ahşap İşçiliği
                </h3>
                <p className="mt-1 text-xs text-zinc-400 font-light">
                  Her bir parça doğadan ilham alınarak sürdürülebilir Orman Yönetimi standartlarına uygun üretilir.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Copywriting Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-[0.2em] text-[#c8a165] uppercase">
              BİZ KİMİZ?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Açık Havada Konforun ve Mimarinin Zirvesi
            </h2>

            <div className="space-y-4 text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
              <p>
                Açık havada vakit geçirmek sadece bir dinlenme anı değil, doğayla kurulan derin bir bağdır. LUMERA olarak biz, bahçenizde veya terasınızda geçirdiğiniz her saniyenin eşsiz bir deneyime dönüşmesini hedefliyoruz.
              </p>
              <p>
                Fırınlanmış birinci sınıf Teak ve masif ahşap malzemeleri, usta marangozlarımızın el işçiliğiyle biçimlendiriyoruz. Güneş ışınlarına, neme ve tüm mevsim şartlarına dayanıklı kılan özel doğal yağ cilalarımız sayesinde koleksiyonlarımız yıllar boyu estetiğini korur.
              </p>
              <p>
                Hamaklardan lüks şezlonglara, bahçe oturma gruplarından güneş şemsiyelerine kadar tasarladığımız her üründe konfor, dayanıklılık ve mimari zarafet ön plandadır.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Pillars / Values Grid */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#c8a165] uppercase">
              TEMEL DEĞERLERİMİZ
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Neden LUMERA Ayrıcalığı?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-2xl shadow-xl hover:border-[#c8a165]/50 transition-all group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8a165]/10 border border-[#c8a165]/30 text-2xl text-[#c8a165] mb-6 group-hover:scale-110 transition-transform">
                🌲
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                %100 Doğal Ahşap
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Yalnızca sürdürülebilir fırınlanmış masif ahşap kullanılarak üretilen doğa dostu tasarımlar.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-2xl shadow-xl hover:border-[#c8a165]/50 transition-all group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8a165]/10 border border-[#c8a165]/30 text-2xl text-[#c8a165] mb-6 group-hover:scale-110 transition-transform">
                🛠️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Geleneksel El İşçiliği
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Seri üretim yerine usta ellerden çıkan ince detaylar ve özenli birleşme noktaları.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-2xl shadow-xl hover:border-[#c8a165]/50 transition-all group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8a165]/10 border border-[#c8a165]/30 text-2xl text-[#c8a165] mb-6 group-hover:scale-110 transition-transform">
                ☀️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Dış Mekan Mukavemeti
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                UV ışınlarına, nem ve dış etkenlere dayanıklı özel organik koruyucu katmanlar.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-2xl shadow-xl hover:border-[#c8a165]/50 transition-all group">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8a165]/10 border border-[#c8a165]/30 text-2xl text-[#c8a165] mb-6 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                2 Yıl Garanti
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Tüm ürünlerimizde üretim ve malzeme hatalarına karşı %100 LUMERA güvencesi.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#121420]/90 via-[#181b2e]/80 to-[#121420]/90 p-10 sm:p-14 backdrop-blur-2xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black gold-gradient-text">
                5.000+
              </div>
              <div className="text-xs text-zinc-400 font-light uppercase tracking-wider">
                Mutlu Müşteri
              </div>
            </div>

            <div className="space-y-1 pt-6 sm:pt-0">
              <div className="text-3xl sm:text-5xl font-black gold-gradient-text">
                %100
              </div>
              <div className="text-xs text-zinc-400 font-light uppercase tracking-wider">
                Doğal Masif Ahşap
              </div>
            </div>

            <div className="space-y-1 pt-6 sm:pt-0">
              <div className="text-3xl sm:text-5xl font-black gold-gradient-text">
                15+
              </div>
              <div className="text-xs text-zinc-400 font-light uppercase tracking-wider">
                Yıllık Zanaat Tecrübesi
              </div>
            </div>

            <div className="space-y-1 pt-6 sm:pt-0">
              <div className="text-3xl sm:text-5xl font-black gold-gradient-text">
                2 Yıl
              </div>
              <div className="text-xs text-zinc-400 font-light uppercase tracking-wider">
                Lumera Garantisi
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="rounded-3xl border border-[#c8a165]/30 bg-[#121420]/90 p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-[#c8a165]/10 blur-3xl" />
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#c8a165] uppercase">
              YAŞAM ALANINIZI YENİDEN KEFŞEDİN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Bahçenize Lüks Bir Vaha Dokunuşu Katın
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Özel tasarım koleksiyonlarımızı keşfetmek veya projenize özel danışmanlık almak için hemen inceleyin.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto rounded-full gold-gradient-btn px-8 py-4 text-xs font-extrabold text-black shadow-xl hover:scale-105 transition-transform"
              >
                Koleksiyonları İncele →
              </Link>
              <Link
                href="/iletisim"
                className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold text-white hover:bg-white/10 hover:border-[#c8a165]/50 transition"
              >
                Bizimle İletişime Geçin
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
