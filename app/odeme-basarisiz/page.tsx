import Link from "next/link";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

export default function OdemeBasarisizPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="rounded-3xl border border-white/10 bg-[#121420]/90 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-rose-500/20 border-2 border-rose-500/40 text-rose-400 text-4xl sm:text-5xl shadow-[0_0_40px_rgba(244,63,94,0.3)] mb-6">
            ✕
          </div>

          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-rose-400 uppercase">
            ÖDEME TAMAMLANAMADI
          </span>

          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Ödeme İşlemi Başarısız Oldu
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto leading-relaxed">
            Banka onay vermemiş veya 3D Secure işlemi zaman aşımına uğramış olabilir. Kart bilgilerinizi ve limitinizi kontrol ederek tekrar deneyebilirsiniz.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/cart"
              className="w-full sm:w-auto rounded-full gold-gradient-btn px-8 py-3.5 text-xs sm:text-sm font-extrabold text-black shadow-xl"
            >
              Sepete Dön & Tekrar Dene →
            </Link>

            <a
              href="https://wa.me/905358746909?text=Merhaba,%20ödemede%20sorun%20yaşadım,%20yardımcı%20olur%20musunuz?"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-full bg-[#25D366]/20 border border-[#25D366]/40 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#25D366] hover:bg-[#25D366] hover:text-black transition flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp Destek</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
