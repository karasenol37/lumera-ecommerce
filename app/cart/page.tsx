"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cargo = total >= 750 ? 0 : 150;
  const grandTotal = total + cargo;

  return (
    <main className="min-h-screen bg-[#090a0f] px-3.5 sm:px-6 py-10 sm:py-16 pb-28 md:pb-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Alışveriş Sepeti
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-light">
              Sepetinizdeki ürünleri inceleyin ve siparişinizi tamamlayın.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white"
            >
              Sepeti Temizle
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-8 sm:p-16 text-center backdrop-blur-md shadow-2xl">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/5 text-3xl sm:text-4xl mb-4">
              🛒
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              Sepetinizde Henüz Ürün Bulunmuyor
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light">
              Lüks bahçe mobilyaları ve konforlu hamak koleksiyonumuzu keşfederek alışverişe başlayabilirsiniz.
            </p>

            <Link
              href="/"
              className="mt-6 sm:mt-8 inline-block rounded-full gold-gradient-btn px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold text-black shadow-xl"
            >
              Koleksiyonu Keşfet →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-10 lg:grid-cols-3">
            {/* Ürünler Listesi */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-white/10 bg-[#121420]/80 p-4 sm:p-6 backdrop-blur-md shadow-xl transition-all hover:border-[#c8a165]/40"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 sm:h-32 sm:w-32 rounded-xl object-cover border border-white/10 shrink-0"
                    />

                    <div className="flex flex-1 flex-col justify-between w-full min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-sm sm:text-xl font-bold text-white group-hover:text-[#c8a165] transition line-clamp-2">
                            {item.name}
                          </h2>

                          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold gold-gradient-text">
                            ₺{item.price.toLocaleString("tr-TR")}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 sm:p-2 text-[11px] sm:text-xs font-semibold text-rose-400 hover:text-rose-300 transition shrink-0"
                          title="Ürünü Sil"
                        >
                          ✕ Sil
                        </button>
                      </div>

                      <div className="mt-3 sm:mt-6 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 bg-[#090a0f] rounded-full border border-white/10 px-2 sm:px-3 py-1 sm:py-1.5">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/10 text-white font-bold hover:bg-[#c8a165] hover:text-black transition text-xs sm:text-sm"
                          >
                            −
                          </button>

                          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-white">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/10 text-white font-bold hover:bg-[#c8a165] hover:text-black transition text-xs sm:text-sm"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] sm:text-xs text-zinc-400 block">Toplam</span>
                          <span className="text-sm sm:text-lg font-extrabold text-white">
                            ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-semibold text-zinc-300 transition hover:border-[#c8a165] hover:bg-white/10"
              >
                ← Alışverişe Devam Et
              </Link>
            </div>

            {/* Sipariş Özeti */}
            <div className="h-fit rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
                Sipariş Özeti
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Toplam Ürün Adedi</span>
                  <span className="font-semibold text-white">{totalQuantity} adet</span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Ara Toplam</span>
                  <span className="font-semibold text-white">
                    ₺{total.toLocaleString("tr-TR")}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Kargo Ücreti</span>
                  {cargo === 0 ? (
                    <span className="text-emerald-400 font-bold">Ücretsiz</span>
                  ) : (
                    <span className="font-semibold text-white">
                      ₺{cargo.toLocaleString("tr-TR")}
                    </span>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-extrabold">
                  <span>Genel Toplam</span>
                  <span className="gold-gradient-text">
                    ₺{grandTotal.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-8 block w-full rounded-full gold-gradient-btn py-4 text-center text-sm font-extrabold text-black shadow-xl"
              >
                Ödeme Adımına Geç →
              </Link>

              <p className="mt-4 text-center text-xs text-zinc-500">
                🔒 256-Bit SSL Koruma ile Güvenli Alışveriş
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}