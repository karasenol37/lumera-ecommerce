"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type CategoryItem = {
  name: string;
  image: string;
  desc: string;
};

export default function CategoriesSlider({
  categories,
}: {
  categories: CategoryItem[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="relative">
      {/* Scroll Navigation Controls (Desktop & Tablet) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#121420]/80 text-white backdrop-blur-md transition-all hover:border-[#c8a165] hover:text-[#e5c184] hover:bg-black/60 shadow-lg cursor-pointer"
          title="Sola Kaydır"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#121420]/80 text-white backdrop-blur-md transition-all hover:border-[#c8a165] hover:text-[#e5c184] hover:bg-black/60 shadow-lg cursor-pointer"
          title="Sağa Kaydır"
        >
          →
        </button>
      </div>

      {/* Horizontal Scrollable Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#c8a165]/40 scrollbar-track-white/5"
        style={{ scrollbarWidth: "thin" }}
      >
        {categories.map((category) => (
          <div
            key={category.name}
            className="w-[280px] xs:w-[320px] sm:w-[340px] md:w-[360px] flex-shrink-0 snap-start"
          >
            <Link
              href={`/kategori/${encodeURIComponent(category.name)}`}
              className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-white/10 bg-[#121420]/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#c8a165]/60 hover:shadow-[0_15px_35px_rgba(200,161,101,0.2)]"
            >
              {/* Görsel Konteyneri: Kenarlar kapanmasın diye geniş aspect ratio ve temiz çerçeve */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#090a0f]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 280px, 360px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* İnce hafif gölge geçişi (görseli karartmadan kenarların tamamı net görünür) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 right-3 rounded-full bg-[#090a0f]/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-wider text-[#e5c184] border border-[#c8a165]/40 shadow-md">
                  KOLEKSİYON
                </div>
              </div>

              {/* İçerik */}
              <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white transition-colors duration-200 group-hover:text-[#c8a165]">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">
                    {category.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#c8a165]">
                  <span>Modelleri İncele</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5 text-sm">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 mt-2">
        <span>↔</span>
        <span>Modelleri görmek için yana doğru kaydırın</span>
      </div>
    </div>
  );
}
