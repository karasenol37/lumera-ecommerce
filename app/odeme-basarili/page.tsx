import Link from "next/link";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OdemeBasariliPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order;

  let order = null;
  if (orderNumber) {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="rounded-3xl border border-white/10 bg-[#121420]/90 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-2xl">
          {/* Animated Success Badge */}
          <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 text-4xl sm:text-5xl shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-6">
            ✓
          </div>

          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#c8a165] uppercase">
            ÖDEME ONAYLANDI
          </span>

          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Siparişiniz Başarıyla Alındı!
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto leading-relaxed">
            LUMERA'yı tercih ettiğiniz için teşekkür ederiz. Siparişiniz özenle hazırlanmak üzere atölyemize iletildi.
          </p>

          {order && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#090a0f]/80 p-6 text-left space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-zinc-400">Sipariş Numarası</span>
                <span className="font-bold text-[#e5c184] text-sm sm:text-base">
                  {order.orderNumber}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-zinc-400">Ödeme Durumu</span>
                <span className="font-semibold text-emerald-400">
                  ✓ {order.paymentStatus} ({order.paymentMethod})
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-zinc-400">Teslimat Alıcısı</span>
                <span className="font-medium text-white">{order.fullName}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-zinc-400">Toplam Tutar</span>
                <span className="text-lg sm:text-xl font-extrabold gold-gradient-text">
                  ₺{order.total.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto rounded-full gold-gradient-btn px-8 py-3.5 text-xs sm:text-sm font-extrabold text-black shadow-xl"
            >
              Ana Sayfaya Dön →
            </Link>

            <a
              href="https://wa.me/905358746909?text=Merhaba,%20siparişim%20hakkında%20bilgi%20almak%20istiyorum."
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
