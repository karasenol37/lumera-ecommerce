"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { formatProductDescription } from "@/lib/utils/formatDescription";

type ProductImage = {
  id: number;
  url: string;
};

type ReviewItem = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
};

type Product = {
  id: number;
  name: string;
  price: number;
  rating?: number;
  likes?: number;
  image: string;
  description: string;
  material: string;
  dimensions: string;
  stock: number;
  category?: string;
  freeShipping?: boolean;
  shippingFee?: number;
  images: ProductImage[];
  reviews?: ReviewItem[];
};

export default function ProductDetailView({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorite();

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping" | "reviews">("desc");

  // Likes state
  const [likes, setLikes] = useState<number>(product.likes || 12);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(product.reviews || []);
  const [reviewName, setReviewName] = useState<string>("");
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<string>("");
  const [reviewError, setReviewError] = useState<string>("");

  useEffect(() => {
    // Check if user already liked this product in this session
    const likedInStorage = localStorage.getItem(`lumera_like_${product.id}`);
    if (likedInStorage) {
      setHasLiked(true);
    }

    // Fetch latest reviews if not preloaded
    if (!product.reviews || product.reviews.length === 0) {
      fetch(`/api/reviews?productId=${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          }
        })
        .catch(() => {});
    }
  }, [product.id, product.reviews]);

  const favorited = isFavorite(product.id);
  const isFreeShipping =
    product.freeShipping !== false &&
    (!product.shippingFee || product.shippingFee === 0);
  const shippingFee = product.shippingFee || 0;

  // Malzeme türüne göre üzerindeki yazı dinamik olarak değişir:
  // Ahşap, çam, gürgen, ladin, kestane vb. -> MASİF AHŞAP EL İŞÇİLİĞİ
  // Çelik, metal, demir, alüminyum -> HASSAS METAL İŞÇİLİĞİ
  const matLower = (product.material || "").toLowerCase();
  const isWood = Boolean(
    matLower.includes("ahşap") ||
    matLower.includes("çam") ||
    matLower.includes("gürgen") ||
    matLower.includes("ladin") ||
    matLower.includes("kestane") ||
    matLower.includes("masif") ||
    matLower.includes("kayın") ||
    matLower.includes("teak") ||
    matLower.includes("iroko")
  );

  const isMetal = !isWood && Boolean(
    matLower.includes("çelik") ||
    matLower.includes("metal") ||
    matLower.includes("alüminyum") ||
    matLower.includes("demir") ||
    product.name?.toLowerCase().includes("ateş") ||
    product.category?.toLowerCase().includes("ateş") ||
    product.name?.toLowerCase().includes("metal")
  );

  const craftsmanshipBadge = isWood
    ? "MASİF AHŞAP EL İŞÇİLİĞİ"
    : isMetal
    ? "HASSAS METAL İŞÇİLİĞİ"
    : product.material
    ? `${product.material.toUpperCase()} İŞÇİLİĞİ`
    : "MASİF AHŞAP EL İŞÇİLİĞİ";

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
        freeShipping: isFreeShipping,
        shippingFee: shippingFee,
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

  async function handleLike() {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    localStorage.setItem(`lumera_like_${product.id}`, "1");

    try {
      await fetch(`/api/products/${product.id}/like`, { method: "POST" });
    } catch {
      // optimistic update
    }
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError("Lütfen adınızı ve yorumunuzu giriniz.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setReviewSuccess("Yorumunuz başarıyla eklendi! Teşekkür ederiz.");
        setReviewName("");
        setReviewComment("");
        setReviewRating(5);
      } else {
        setReviewError(data.error || "Yorum kaydedilemedi.");
      }
    } catch {
      setReviewError("Bir hata oluştu, lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  const oldPrice = Math.round(product.price * 1.25);
  const whatsappUrl = `https://wa.me/905358746909?text=${encodeURIComponent(
    `Merhaba LUMERA, ${product.name} ürünü hakkında (${quantity} adet) WhatsApp ile sipariş vermek ve bilgi almak istiyorum.`
  )}`;

  // Average review calculation
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

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
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#0a0b10]">
              <img
                src={activeImage || "/images/no-image.jpg"}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="rounded-full bg-black/75 border border-[#c8a165]/40 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-[#e5c184] uppercase backdrop-blur-md shadow-lg">
                {craftsmanshipBadge}
              </span>
              <span className="rounded-full bg-[#c8a165] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-black uppercase shadow-lg">
                %20 İNDİRİM
              </span>
            </div>

            {/* Top Right Action Buttons: Favorite & Like */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              {/* Like Button */}
              <button
                type="button"
                onClick={handleLike}
                className={`flex h-11 px-3 items-center gap-1.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl ${
                  hasLiked
                    ? "bg-rose-500/25 text-rose-300 border-rose-500/50 scale-105"
                    : "bg-black/60 text-zinc-300 border-white/15 hover:bg-black/80 hover:text-white"
                }`}
                title={hasLiked ? "Beğendiniz" : "Ürünü Beğen"}
              >
                <span className="text-sm">{hasLiked ? "❤️" : "🤍"}</span>
                <span className="text-xs font-bold">{likes}</span>
              </button>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={() =>
                  toggleFavorite({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    freeShipping: isFreeShipping,
                    shippingFee: shippingFee,
                  })
                }
                className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md border border-white/15 transition-all duration-300 shadow-xl ${
                  favorited
                    ? "bg-rose-500/20 text-rose-500 border-rose-500/50 scale-110"
                    : "bg-black/60 text-white hover:bg-black/80 hover:scale-105"
                }`}
                title={favorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <svg
                  className={`w-6 h-6 transition-transform ${
                    favorited
                      ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                      : "fill-none stroke-current"
                  }`}
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
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
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="flex items-center gap-1 text-amber-400 font-bold hover:underline cursor-pointer"
              >
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="ml-1 text-zinc-300 font-normal">
                  {averageRating} ({reviews.length} Değerlendirme)
                </span>
              </button>
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

            <div
              className={`rounded-2xl px-4 py-2.5 text-right border ${
                isFreeShipping
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              <span
                className={`block text-[11px] font-extrabold uppercase tracking-wider ${
                  isFreeShipping ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {isFreeShipping ? "ÜCRETSİZ KARGO" : "KARGO ALICIYA AİTTİR"}
              </span>
              <span className="text-xs font-semibold">
                {isFreeShipping
                  ? "Sigortalı Teslimat"
                  : `₺${shippingFee} Kargo Bedeli`}
              </span>
            </div>
          </div>

          {/* Tab Navigation: Description / Specifications / Shipping / Reviews */}
          <div className="rounded-3xl border border-white/10 bg-[#121420]/80 p-6 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex border-b border-white/10 pb-3 gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("desc")}
                className={`pb-2 transition shrink-0 relative ${
                  activeTab === "desc"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Açıklama
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-2 transition shrink-0 relative ${
                  activeTab === "specs"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Ürün Özellikleri
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-2 transition shrink-0 relative ${
                  activeTab === "shipping"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Teslimat & Kargo
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-2 transition shrink-0 relative ${
                  activeTab === "reviews"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Yorumlar ({reviews.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-light">
              {activeTab === "desc" && (
                <div
                  className="product-description-content text-xs sm:text-sm leading-relaxed text-zinc-300 font-light"
                  dangerouslySetInnerHTML={{
                    __html: formatProductDescription(
                      product.description ||
                        (isWood
                          ? "Bu özel tasarım ürün, dış mekan koşullarına yüksek dayanıklılık gösteren fırınlanmış masif ahşaptan üretilmiştir. Dinlenme alanlarınıza şıklık katmak üzere tasarlanmıştır."
                          : isMetal
                          ? "Bu özel tasarım ürün, dış mekan koşullarına ve yüksek ısıya dayanıklı hassas işlenmiş çelikten üretilmiştir. Dinlenme alanlarınıza şıklık katmak üzere tasarlanmıştır."
                          : "Bu seçkin ürün, dış mekan koşullarına yüksek dayanıklılık gösteren üst düzey zanaatle üretilmiştir.")
                    ),
                  }}
                />
              )}

              {activeTab === "specs" && (
                <dl className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#090a0f] p-3 border border-white/5">
                    <dt className="text-[10px] text-zinc-500 uppercase font-bold">Materyal</dt>
                    <dd className="mt-1 font-semibold text-white">
                      {product.material || (isWood ? "Fırınlanmış 1. Sınıf Ahşap" : isMetal ? "Hassas İşlenmiş Çelik" : "Lüks Malzeme")}
                    </dd>
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
                    <dd className="mt-1 font-semibold text-white">{craftsmanshipBadge}</dd>
                  </div>
                </dl>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-3">
                  <p>
                    • Türkiye geneli <strong>Özel Korumalı Sandık</strong> ambalajı ile{" "}
                    {isFreeShipping ? (
                      <span className="text-emerald-400 font-bold">ücretsiz teslim edilir.</span>
                    ) : (
                      <span className="text-amber-400 font-bold">
                        kargo alıcıya aittir (₺{shippingFee} kargo bedeli ile gönderilir).
                      </span>
                    )}
                  </p>
                  <p>
                    • <strong>Çoklu Ürün Kargo Avantajı:</strong> Birden fazla ürün alımında en yüksek kargo ücreti üzerine diğer ürünlerin kargo bedelinin yalnızca %40&apos;ı eklenir (%60 kargo indirimi uygulanır).
                  </p>
                  <p>• Ürünlerimiz <strong>2 Yıl Lumera Üretici Garantisi</strong> kapsamındadır.</p>
                  <p>• 14 gün içinde koşulsuz iade ve değişim güvencesi sunulmaktadır.</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-base">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span className="ml-1 text-white text-sm">
                          {averageRating} / 5.0
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {reviews.length} müşteri değerlendirmesi
                      </p>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                    {reviews.length === 0 ? (
                      <p className="text-zinc-500 italic text-xs">
                        Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yazın!
                      </p>
                    ) : (
                      reviews.map((r, i) => (
                        <div
                          key={r.id || i}
                          className="rounded-2xl border border-white/5 bg-[#090a0f] p-4 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">
                              {r.name}
                            </span>
                            <div className="flex text-amber-400 text-xs">
                              {"★".repeat(r.rating || 5)}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-300 font-light leading-relaxed">
                            {r.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form
                    onSubmit={handleReviewSubmit}
                    className="border-t border-white/10 pt-4 space-y-3"
                  >
                    <h4 className="text-xs font-bold text-white">Yorum Yazın</h4>

                    {reviewSuccess && (
                      <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
                        {reviewSuccess}
                      </div>
                    )}
                    {reviewError && (
                      <div className="rounded-xl bg-rose-500/20 border border-rose-500/30 p-2.5 text-xs text-rose-300">
                        {reviewError}
                      </div>
                    )}

                    {/* Star Rating Select */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">Puanınız:</span>
                      <div className="flex gap-1 text-amber-400 text-lg cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`transition hover:scale-125 ${
                              star <= reviewRating ? "text-amber-400" : "text-zinc-600"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
                    />

                    <textarea
                      placeholder="Ürün hakkındaki deneyiminiz ve yorumunuz..."
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
                    />

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="rounded-full bg-[#c8a165] px-5 py-2 text-xs font-bold text-black hover:bg-[#e5c184] transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingReview ? "Gönderiliyor..." : "Yorumu Gönder"}
                    </button>
                  </form>
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

            {/* WhatsApp Quick Order Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full bg-[#25D366] text-black font-black text-sm sm:text-base shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-white/20 overflow-hidden"
            >
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
                {isFreeShipping ? "Ücretsiz Kargo" : "Kargo Alıcıya Ait"}
              </h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-500 hidden xs:block">
                {isFreeShipping ? "Tüm Türkiye" : `₺${shippingFee} Bedelle`}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121420]/40 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">🛡️</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">2 Yıl Garanti</h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-500 hidden xs:block">{isWood ? "Masif Ahşap" : isMetal ? "Paslanmaz Metal" : "Lüks Malzeme"}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121420]/40 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">💳</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">Güvenli Ödeme</h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-500 hidden xs:block">256-bit SSL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Dual Action Bar */}
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
