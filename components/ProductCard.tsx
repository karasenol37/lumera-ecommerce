import Link from "next/link";
import { formatPrice } from "@/lib/format";
import FavoriteButton from "./FavoriteButton";

type ProductCardProps = {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  stock: number;
  image: string;
};

export default function ProductCard({
  id,
  name,
  price,
  oldPrice,
  stock,
  image,
}: ProductCardProps) {
  const discount =
    oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11131c]/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#c8a165]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[#c8a165]/10">
      {/* Badges */}
      <div className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4 z-10 flex flex-col gap-1 sm:gap-2">
        {discount > 0 && (
          <span className="rounded-full bg-gradient-to-r from-[#e5c184] to-[#c8a165] px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-bold text-black shadow-md">
            -%{discount}
          </span>
        )}

        <span
          className={`rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-semibold backdrop-blur-md border ${
            stock > 0
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              : "bg-rose-500/20 text-rose-300 border-rose-500/30"
          }`}
        >
          {stock > 0 ? (
            <span>
              <span className="hidden sm:inline">Stok: </span>{stock}
            </span>
          ) : (
            "Tükendi"
          )}
        </span>
      </div>

      {/* Favorite Button Overlay */}
      <div className="absolute right-2.5 top-2.5 sm:right-4 sm:top-4 z-10">
        <FavoriteButton id={id} name={name} price={price} image={image} />
      </div>

      {/* Image Container */}
      <Link href={`/product/${id}`} className="block overflow-hidden">
        <div className="relative h-44 xs:h-52 sm:h-72 w-full overflow-hidden bg-[#0a0b10]">
          <img
            src={image || "/images/no-image.jpg"}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-transparent opacity-80" />

          {/* Quick View Button (Desktop only hover) */}
          <div className="hidden sm:flex absolute inset-0 items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
            <span className="translate-y-4 rounded-full border border-[#c8a165] bg-[#090a0f]/90 px-6 py-2.5 text-xs font-semibold text-[#e5c184] shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-[#c8a165] hover:text-black">
              Ürünü İncele →
            </span>
          </div>
        </div>
      </Link>

      {/* Content Info */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-6">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="line-clamp-2 text-xs sm:text-lg font-bold text-white transition-colors duration-200 group-hover:text-[#c8a165] leading-snug min-h-[2rem] sm:min-h-[3rem]">
              {name}
            </h3>
          </Link>

          <div className="mt-1 sm:mt-2 flex items-center gap-1 text-[10px] sm:text-xs text-amber-400">
            <span>★★★★★</span>
            <span className="text-zinc-500 ml-0.5 text-[9px] sm:text-xs">(5.0)</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-6 border-t border-white/5 pt-2.5 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
            <span className="text-sm sm:text-2xl font-extrabold gold-gradient-text">
              {formatPrice(price)}
            </span>
            {oldPrice > price && (
              <span className="text-[10px] sm:text-xs text-zinc-500 line-through">
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-2 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-zinc-500 text-[9px] sm:text-xs truncate">Premium Seri</span>
            <Link
              href={`/product/${id}`}
              className="font-semibold text-[#c8a165] hover:underline shrink-0"
            >
              İncele →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}