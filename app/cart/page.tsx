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
    <main className="min-h-screen bg-[#111111] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-5xl font-bold">
            Sepetim
          </h1>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="rounded-full border border-red-500 px-6 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              Sepeti Temizle
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl bg-[#181818] p-16 text-center">
            <h2 className="text-3xl font-bold">
              Sepetiniz boş
            </h2>

            <p className="mt-3 text-gray-400">
              Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayabilirsiniz.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-[#c8a165] px-8 py-4 font-bold text-black"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Ürünler */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#2b2b2b] bg-[#181818] p-6"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-36 rounded-xl object-cover"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {item.name}
                        </h2>

                        <p className="mt-2 text-[#c8a165]">
                          ₺{item.price.toLocaleString("tr-TR")}
                        </p>

                        <p className="mt-3 text-gray-400">
                          Toplam:
                          <span className="ml-2 font-bold text-white">
                            ₺
                            {(item.price * item.quantity).toLocaleString(
                              "tr-TR"
                            )}
                          </span>
                        </p>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-10 w-10 rounded-full bg-[#222] text-xl hover:bg-[#333]"
                        >
                          −
                        </button>

                        <span className="w-8 text-center text-lg font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="h-10 w-10 rounded-full bg-[#222] text-xl hover:bg-[#333]"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto rounded-full bg-red-600 px-5 py-2 transition hover:bg-red-700"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/"
                className="inline-block rounded-full border border-[#c8a165] px-8 py-4 text-[#c8a165] transition hover:bg-[#c8a165] hover:text-black"
              >
                ← Alışverişe Devam Et
              </Link>
            </div>

            {/* Sipariş Özeti */}
            <div className="h-fit rounded-2xl bg-[#181818] p-8">
              <h2 className="text-3xl font-bold">
                Sipariş Özeti
              </h2>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Ürün Adedi</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Ara Toplam</span>
                  <span>
                    ₺{total.toLocaleString("tr-TR")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Kargo</span>

                  {cargo === 0 ? (
                    <span className="text-green-400">
                      Ücretsiz
                    </span>
                  ) : (
                    <span>
                      ₺{cargo.toLocaleString("tr-TR")}
                    </span>
                  )}
                </div>

                <hr className="border-[#333]" />

                <div className="flex justify-between text-2xl font-bold">
                  <span>Genel Toplam</span>

                  <span className="text-[#c8a165]">
                    ₺{grandTotal.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>

             <Link
  href="/checkout"
  className="
    mt-8
    block
    w-full
    rounded-full
    bg-[#c8a165]
    py-4
    text-center
    text-lg
    font-bold
    text-black
    transition
    hover:opacity-90
  "
>
  Ödemeye Geç
</Link>

              <p className="mt-5 text-center text-sm text-gray-500">
                SSL ile güvenli ödeme
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}