"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useFavorite } from "@/context/FavoriteContext";

export default function FavoritesView() {
  const { favorites } = useFavorite();

  return (
    <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 w-full">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
          LUMERA KOLEKSİYONU
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold text-white">
          Favori Ürünlerim
        </h1>
        <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm sm:text-base font-light">
          Beğendiğiniz ve daha sonra incelemek üzere kaydettiğiniz özel tasarım outdoor ve bahçe ürünleriniz.
        </p>
      </div>

      {favorites.length === 0 ? (
        /* Empty Favorites State */
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#121420]/80 p-10 sm:p-12 text-center backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-3xl mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            ♥
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Henüz Favori Ürününüz Yok
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-8 font-light leading-relaxed">
            Koleksiyonumuzu keşfederek beğendiğiniz ürünleri üzerlerindeki kalp ikonuna tıklayıp favorilerinize ekleyebilirsiniz.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full gold-gradient-btn px-8 py-3.5 text-xs font-extrabold text-black shadow-xl hover:scale-105 transition-transform"
          >
            Koleksiyonları Keşfet →
          </Link>
        </div>
      ) : (
        /* Favorites Grid */
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs text-zinc-400 font-medium">
              Toplam <strong className="text-[#e5c184]">{favorites.length}</strong> ürün kaydedildi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={`product-${product.id}`}
                name={product.name}
                price={product.price}
                oldPrice={product.price * 1.2}
                stock={10}
                image={product.image}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
