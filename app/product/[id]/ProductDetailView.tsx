"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";

type ProductImage = {
  id: number;
  url: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  rating?: number;
  image: string;
  description: string;
  material: string;
  dimensions: string;
  stock: number;
  category?: string;
  freeShipping?: boolean;
  shippingFee?: number;
  images: ProductImage[];
};

export default function ProductDetailView({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorite();

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">("desc");

  const favorited = isFavorite(product.id);
  const isFreeShipping = product.freeShipping !== false;
  const shippingFee = product.shippingFee || 0;

  // Gallery array
  const allImages = [
    { id: 0, url: product.image },
    ...(product.images || []),
  ];

  function handleAddToCart() {
    if (product.stock <= 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      });
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2500);
  }

  function handleQuantityChange(delta: number) {
    const nextVal = quantity + delta;
    if (nextVal >= 1 && nextVal <= Math.max(1, product.stock)) {
      setQuantity(nextVal);
    }
  }

  const oldPrice = Math.round(product.price * 1.25);
  const whatsappUrl = `https://wa.me/905358746909?text=${encodeURIComponent(
    `Merhaba LUMERA, ${product.name} ürünü hakkında (${quantity} adet) WhatsApp ile sipariş vermek ve bilgi almak istiyorum.`
  )}`;

  return (
    <div className="w-full">
      {/* Top Breadcrumbs */}
      <nav className="mb-8 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#c8a165] transition">
            Ana Sayfa
          </Link>
          <span>/</span>
          {product.category ? (
            <Link
              href={`/kategori/${encodeURIComponent(product.category)}`}
              className="hover:text-[#c8a165] transition font-medium text-zinc-300"
            >
              {product.category}
            </Link>
          ) : (
            <Link href="/" className="hover:text-[#c8a165] transition">
              Koleksiyonlar
            </Link>
          )}
          <span>/</span>
          <span className="text-white font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 font-semibold text-[#c8a165] hover:text-[#e5c184] transition"
        >
          ← Tüm Ürünlere Dön
        </Link>
      </nav>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Large Main Display */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121420]/80 backdrop-blur-2xl shadow-2xl group">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={activeImage || "/images/no-image.jpg"}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="rounded-full bg-black/60 border border-white/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-[#c8a165] uppercase backdrop-blur-md">
                MASİF AHŞAP EL İŞÇİLİĞİ
              </span>
              <span className="rounded-full bg-[#c8a165] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-black uppercase shadow-lg">
                %20 İNDİRİM
              </span>
            </div>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() =>
                toggleFavorite({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md border border-white/15 transition-all duration-300 shadow-xl ${
                favorited
                  ? "bg-rose-500/20 text-rose-500 border-rose-500/50 scale-110"
                  : "bg-black/50 text-white hover:bg-black/80 hover:scale-105"
              }`}
              title={favorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <svg
                className={`w-6 h-6 transition-transform ${
                  favorited ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "fill-none stroke-current"
                }`}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border transition-all ${
                    activeImage === img.url
                      ? "border-[#c8a165] ring-2 ring-[#c8a165]/30 scale-105"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Tagline */}
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#c8a165] uppercase">
              LUMERA OUTDOOR COLLECTION
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="mt-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="ml-1 text-zinc-300 font-normal">4.9 (24 İnceleme)</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div>
                {product.stock > 10 ? (
                  <span className="font-semibold text-emerald-400">✓ Stokta Var</span>
                ) : product.stock > 0 ? (
                  <span className="font-semibold text-amber-400">
                    ⚠ Son {product.stock} adet stokta
                  </span>
                ) : (
                  <span className="font-semibold text-rose-400">✕ Tükendi</span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-6 backdrop-blur-2xl shadow-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 font-light">Özel Koleksiyon Fiyatı</div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black gold-gradient-text">
                  ₺{product.price.toLocaleString("tr-TR")}
                </span>
                <span className="text-base text-zinc-500 line-through font-light">
                  ₺{oldPrice.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>

            <div className={`rounded-2xl px-3.5 py-2 text-right border ${
              isFreeShipping
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}>
              <span className={`block text-[10px] font-bold uppercase tracking-wider ${
                isFreeShipping ? "text-emerald-400" : "text-amber-400"
              }`}>
                {isFreeShipping ? "ÜCRETSİZ" : `₺${shippingFee}`}
              </span>
              <span className="text-xs font-semibold">
                {isFreeShipping ? "Sigortalı Kargo" : "Kargo Ücreti"}
              </span>
            </div>
          </div>

          {/* Tab Navigation: Description / Specifications */}
          <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-6 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex border-b border-white/10 pb-3 gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("desc")}
                className={`pb-2 transition relative ${
                  activeTab === "desc"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Açıklama
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-2 transition relative ${
                  activeTab === "specs"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Ürün Özellikleri
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-2 transition relative ${
                  activeTab === "shipping"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Teslimat & Garanti
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-light">
              {activeTab === "desc" && (
                <p>{product.description || "Bu özel tasarım ürün, dış mekan koşullarına yüksek dayanıklılık gösteren fırınlanmış masif ahşaptan üretilmiştir. Dinlenme alanlarınıza şıklık katmak üzere tasarlanmıştır."}</p>
              )}

              {activeTab === "specs" && (
                <dl className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#090a0f] p-3 border border-white/5">
                    <dt className="text-[10px] text-zinc-500 uppercase font-bold">Materyal</dt>
                    <dd className="mt-1 font-semibold text-white">{product.material || "Fırınlanmış Teak Ahşap"}</dd>
                  </div>
                  <div className="rounded-xl bg-[#090a0f] p-3 border border-white/5">
                    <dt className="text-[10px] text-zinc-500 uppercase font-bold">Ölçüler</dt>
                    <dd className="mt-1 font-semibold text-white">{product.dimensions || "Standart Lüks Ölçü"}</dd>
                  </div>
                  <div className="rounded-xl bg-[#090a0f] p-3 border border-white/5">
                    <dt className="text-[10px] text-zinc-500 uppercase font-bold">Stok Adedi</dt>
                    <dd className="mt-1 font-semibold text-white">{product.stock} Adet</dd>
                  </div>
                  <div className="rounded-xl bg-[#090a0f] p-3 border border-white/5">
                    <dt className="text-[10px] text-zinc-500 uppercase font-bold">Üretim Türü</dt>
                    <dd className="mt-1 font-semibold text-white">El İşçiliği</dd>
                  </div>
                </dl>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p>
                    • Türkiye geneli <strong>Özel Korumalı Ahşap Sandık</strong> ambalajı ile {isFreeShipping ? "ücretsiz teslim edilir." : `₺${shippingFee} kargo bedeli ile gönderilir.`}
                  </p>
                  <p>• Ürünlerimiz <strong>2 Yıl Lumera Üretici Garantisi</strong> kapsamındadır.</p>
                  <p>• 14 gün içinde koşulsuz iade imkanı sunulmaktadır.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center rounded-full border border-white/10 bg-[#121420] p-1 shadow-lg shrink-0">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white hover:bg-white/10 disabled:opacity-30 transition cursor-pointer"
                >
                  −
                </button>
                <span className="w-9 sm:w-10 text-center font-bold text-white text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white hover:bg-white/10 disabled:opacity-30 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 rounded-full py-4 px-6 text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 cursor-pointer ${
                  product.stock === 0
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                    : added
                    ? "bg-emerald-500 text-black scale-[1.02] shadow-emerald-500/20"
                    : "gold-gradient-btn text-black hover:scale-[1.02]"
                }`}
              >
                {product.stock === 0 ? (
                  "Stokta Yok"
                ) : added ? (
                  <>
                    <span className="text-base">✓</span>
                    <span>Sepete Eklendi!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Sepete Ekle ({quantity} Adet)</span>
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp Quick Order Button - Highly prominent, eye-catching & bold */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full bg-[#25D366] text-black font-black text-sm sm:text-base shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-white/20 overflow-hidden"
            >
              {/* Shine effect */}
              <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white text-base font-normal shrink-0 shadow-md">
                💬
              </span>
              <span className="tracking-wide">
                WhatsApp ile Sipariş Ver & Bilgi Al
              </span>
              <span className="text-sm font-extrabold transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Privilege Badges Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-white/10 pt-6">
            <div className="rounded-2xl border border-white/5 bg-[#121420]/40 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">🚚</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                {isFreeShipping ? "Ücretsiz Kargo" : `₺${shippingFee} Kargo`}
              </h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-500 hidden xs:block">
                {isFreeShipping ? "Tüm Türkiye" : "Hızlı Gönderim"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121420]/40 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">🛡️</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">2 Yıl Garanti</h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-500 hidden xs:block">Masif Ahşap</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121420]/40 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">💳</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">Güvenli Ödeme</h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-500 hidden xs:block">256-bit SSL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Dual Action Bar (Visible only on mobile devices) */}
      <div className="md:hidden fixed bottom-[57px] left-0 right-0 z-30 bg-[#090a0f]/95 backdrop-blur-xl border-t border-white/10 p-2.5 px-3 shadow-[0_-8px_25px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-2">
          {/* Mobile WhatsApp Quick Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-[#25D366] text-black font-extrabold text-xs shadow-[0_4px_15px_rgba(37,211,102,0.4)] active:scale-95 transition"
          >
            <span className="text-sm">💬</span>
            <span className="truncate">WhatsApp Sipariş</span>
          </a>

          {/* Mobile Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 rounded-full py-3 px-3 text-xs font-extrabold transition-all shadow-xl flex items-center justify-center gap-1.5 cursor-pointer ${
              product.stock === 0
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : added
                ? "bg-emerald-500 text-black scale-[1.02]"
                : "gold-gradient-btn text-black active:scale-95"
            }`}
          >
            {product.stock === 0 ? (
              "Tükendi"
            ) : added ? (
              <>
                <span>✓</span>
                <span>Eklendi</span>
              </>
            ) : (
              <>
                <span>🛍️</span>
                <span>Sepete Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

