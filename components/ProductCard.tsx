import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getProductImageUrl } from "@/lib/utils/productImage";
import FavoriteButton from "./FavoriteButton";

type ProductCardProps = {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  stock: number;
  image: string;
  freeShipping?: boolean;
  shippingFee?: number;
};

export default function ProductCard({
  id,
  name,
  price,
  oldPrice,
  stock,
  image,
  freeShipping = true,
  shippingFee = 0,
}: ProductCardProps) {
  const isFree = freeShipping === true && shippingFee === 0;
  const productImageUrl = getProductImageUrl(image, name, 1);

  const discount =
    oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1e242d]/90 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[#c8a165]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[#c8a165]/10">
      {/* Küçültülmüş Zarif Rozetler (İndirim, Stok, Ücretsiz Kargo) */}
      <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1 pointer-events-none">
        {discount > 0 && (
          <span className="w-fit rounded-full bg-gradient-to-r from-[#e5c184] to-[#c8a165] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold leading-none text-black shadow-sm">
            -%{discount}
          </span>
        )}

        <span
          className={`w-fit rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9px] font-medium leading-none backdrop-blur-md border ${
            stock > 0
              ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
              : "bg-rose-500/20 text-rose-200 border-rose-500/30"
          }`}
        >
          {stock > 0 ? `Stok: ${stock}` : "Tükendi"}
        </span>

        {isFree && (
          <span className="w-fit rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-1.5 py-0.5 text-[7px] sm:text-[8px] font-semibold uppercase tracking-wide leading-none backdrop-blur-md shadow-sm">
            Ücretsiz Kargo
          </span>
        )}
      </div>

      {/* Favorite Button Overlay */}
      <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10">
        <FavoriteButton
          id={id}
          name={name}
          price={price}
          image={productImageUrl}
        />
      </div>

      {/* Image Container - Resim çerçeveye tam doldurulur */}
      <Link href={`/product/${id}`} className="block overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#151920]">
          <img
            src={productImageUrl}
            alt={name}
            title={name}
            className="h-full w-full object-fill transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#1e242d]/40 to-transparent pointer-events-none" />

          {/* Quick View Button (Desktop only hover) */}
          <div className="hidden sm:flex absolute inset-0 items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
            <span className="translate-y-4 rounded-full border border-[#c8a165] bg-[#151920]/90 px-5 py-2 text-xs font-semibold text-[#e5c184] shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-[#c8a165] hover:text-black">
              Ürünü İncele →
            </span>
          </div>
        </div>
      </Link>

      {/* Content Info */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-5">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="line-clamp-2 text-xs sm:text-base font-bold text-white transition-colors duration-200 group-hover:text-[#c8a165] leading-snug min-h-[2rem] sm:min-h-[2.75rem]">
              {name}
            </h3>
          </Link>

          <div className="mt-1 sm:mt-1.5 flex items-center gap-1 text-[10px] sm:text-xs text-amber-400">
            <span>★★★★★</span>
            <span className="text-zinc-400 ml-0.5 text-[9px] sm:text-xs">
              (5.0)
            </span>
          </div>
        </div>

        <div className="mt-2.5 sm:mt-4 border-t border-white/10 pt-2.5 sm:pt-3.5">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
            <span className="text-sm sm:text-xl font-extrabold gold-gradient-text">
              {formatPrice(price)}
            </span>
            {oldPrice > price && (
              <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-zinc-400 text-[9px] sm:text-xs truncate">
              Premium Seri
            </span>
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
