"use client";

import { useEffect, useState } from "react";
import {
  addFavorite as addFavAction,
  removeFavorite as removeFavAction,
  checkFavorite as checkFavAction,
} from "@/lib/actions/favorite";
import { useFavorite } from "@/context/FavoriteContext";

type Props = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function FavoriteButton({ id, name, price, image }: Props) {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorite();
  const [loading, setLoading] = useState(false);

  const favInContext = isFavorite(id);

  useEffect(() => {
    async function loadFavorite() {
      try {
        const serverFav = await checkFavAction(id);
        if (serverFav && !favInContext) {
          addFavorite({ id, name, price, image });
        }
      } catch {
        // Giriş yapılmamışsa localStorage çalışır
      }
    }
    loadFavorite();
  }, [id]);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      if (favInContext) {
        removeFavorite(id);
        try {
          await removeFavAction(id);
        } catch {}
      } else {
        addFavorite({ id, name, price, image });
        try {
          await addFavAction(id);
        } catch {}
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      title={favInContext ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-xl ${
        favInContext
          ? "bg-red-500/20 border border-red-500/60 text-red-500 hover:bg-red-500/30 hover:scale-110 shadow-red-500/20"
          : "bg-black/60 border border-white/15 text-zinc-400 hover:border-red-500/50 hover:text-red-400 hover:scale-110"
      }`}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${
          favInContext
            ? "fill-red-500 text-red-500 scale-110 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            : "fill-none stroke-current"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}