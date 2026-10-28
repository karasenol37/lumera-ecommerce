"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorite } from "@/context/FavoriteContext";
import { formatProductDescription } from "@/lib/utils/formatDescription";
import { getProductImageUrl } from "@/lib/utils/productImage";
import WholesaleQuoteModal from "@/components/WholesaleQuoteModal";

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

  // Gallery array (ürün ismi ile adlandırılmış görsel URL'leri)
  const rawImages = [
    { id: 0, url: product.image },
    ...(product.images || []),
  ].filter((img) => Boolean(img?.url));

  const allImages = rawImages.map((img, idx) => ({
    ...img,
    url: getProductImageUrl(img.url, product.name, idx + 1),
  }));

  const mainProductImageUrl = getProductImageUrl(
    product.image,
    product.name,
    1
  );

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const activeImage = allImages[activeImageIndex]?.url || mainProductImageUrl;
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  function nextImage() {
    if (allImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  }

  function prevImage() {
    if (allImages.length <= 1) return;
    setActiveImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent) {
    setTouchEndX(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45 && allImages.length > 1) {
      nextImage();
    } else if (distance < -45 && allImages.length > 1) {
      prevImage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  }

  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "desc" | "specs" | "shipping" | "reviews"
  >("desc");

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
    const likedInStorage = localStorage.getItem(`lumera_like_${product.id}`);
    if (likedInStorage) {
      setHasLiked(true);
    }

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

  const isVarnishOrPaint = Boolean(
    product.name?.toLowerCase().includes("vernik") ||
      product.name?.toLowerCase().includes("boya") ||
      product.category?.toLowerCase().includes("boya") ||
      (product.material || "").toLowerCase().includes("boya")
  );

  const materialChoices = isVarnishOrPaint
    ? [product.material || "Su Bazlı Boya"]
    : ["Masif Ahşap", "Metal", "Metal + Ahşap"];

  const defaultMaterialChoice = (() => {
    if (isVarnishOrPaint) return product.material || "Su Bazlı Boya";
    const raw = (product.material || "").toLowerCase();
    if (
      raw.includes("metal") &&
      (raw.includes("ahşap") || raw.includes("ağac"))
    )
      return "Metal + Ahşap";
    if (
      raw.includes("metal") ||
      raw.includes("çelik") ||
      raw.includes("alüminyum") ||
      product.name?.toLowerCase().includes("metal") ||
      product.category?.toLowerCase().includes("ateş")
    ) {
      return "Metal";
    }
    return "Masif Ahşap";
  })();

  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    defaultMaterialChoice
  );

  const activeIsWood =
    selectedMaterial.includes("Ahşap") && !selectedMaterial.includes("Metal");
  const activeIsMetal =
    selectedMaterial.includes("Metal") && !selectedMaterial.includes("Ahşap");
  const activeIsBoth =
    selectedMaterial.includes("Metal") && selectedMaterial.includes("Ahşap");

  const craftsmanshipBadge = isVarnishOrPaint
    ? "DOĞAL KORUYUCU BOYA"
    : activeIsBoth
    ? "METAL & MASİF AHŞAP"
    : activeIsMetal
    ? "HASSAS METAL İŞÇİLİĞİ"
    : activeIsWood
    ? "MASİF AHŞAP EL İŞÇİLİĞİ"
    : `${selectedMaterial.toUpperCase()} İŞÇİLİĞİ`;

  function handleAddToCart() {
    if (product.stock <= 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainProductImageUrl,
        stock: product.stock,
        freeShipping: isFreeShipping,
        shippingFee: shippingFee,
        selectedMaterial: selectedMaterial,
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
    `Merhaba LUMERA, ${product.name} ürünü hakkında (${quantity} adet, Materyal Tercihi: ${selectedMaterial}) WhatsApp ile sipariş vermek ve bilgi almak istiyorum.`
  )}`;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="w-full">
      {/* Top Breadcrumbs */}
      <nav className="mb-8 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#c8a165] transition">
            Ana Sayfa
          </Link>
          <span>/</span>
          {product.category ? (
            <Link
              href={`/kategori/${encodeURIComponent(product.category)}`}
              className="hover:text-[#c8a165] transition font-medium text-zinc-200"
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
        <div className="lg:col-span-7 space-y-4">
          {/* Large Main Display - Resim çerçeveye tam doldurulur */}
          <div
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#1e242d]/90 backdrop-blur-2xl shadow-2xl group select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#151920] cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
              title="Büyük boyutta incelemek için tıklayın"
            >
              <img
                src={activeImage || "/images/no-image.jpg"}
                alt={product.name}
                title={product.name}
                className="h-full w-full object-fill transition-all duration-500 ease-out"
              />
            </div>

            {/* Küçültülmüş Zarif Rozetler */}
            <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10 pointer-events-none">
              <span className="w-fit rounded-full bg-black/70 border border-[#c8a165]/40 px-2 py-0.5 text-[8px] sm:text-[9px] font-bold tracking-wider text-[#e5c184] uppercase backdrop-blur-md shadow">
                {craftsmanshipBadge}
              </span>
              <span className="w-fit rounded-full bg-[#c8a165] px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold tracking-wide text-black uppercase shadow">
                -%20 İNDİRİM
              </span>
              {isFreeShipping && (
                <span className="w-fit rounded-full bg-emerald-500/25 border border-emerald-500/40 px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold text-emerald-200 uppercase backdrop-blur-md shadow">
                  ÜCRETSİZ KARGO
                </span>
              )}
            </div>

            {/* Top Right Action Buttons: Favorite, Like & Zoom */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md border border-white/15 bg-black/60 text-white hover:bg-black/80 hover:text-[#e5c184] hover:border-[#c8a165] transition-all shadow-xl cursor-pointer"
                title="Büyük Görseli Aç"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleLike}
                className={`flex h-10 px-2.5 items-center gap-1 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
                  hasLiked
                    ? "bg-rose-500/25 text-rose-300 border-rose-500/50 scale-105"
                    : "bg-black/60 text-zinc-200 border-white/15 hover:bg-black/80 hover:text-white"
                }`}
                title={hasLiked ? "Beğendiniz" : "Ürünü Beğen"}
              >
                <span className="text-xs">{hasLiked ? "❤️" : "🤍"}</span>
                <span className="text-xs font-bold">{likes}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleFavorite({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: mainProductImageUrl,
                    freeShipping: isFreeShipping,
                    shippingFee: shippingFee,
                  })
                }
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md border border-white/15 transition-all duration-300 shadow-xl cursor-pointer ${
                  favorited
                    ? "bg-rose-500/20 text-rose-500 border-rose-500/50 scale-110"
                    : "bg-black/60 text-white hover:bg-black/80 hover:scale-105"
                }`}
                title={favorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <svg
                  className={`w-5 h-5 transition-transform ${
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

            {/* Kaydırma Navigasyon Okları (Çoklu Görselde) */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md border border-white/20 hover:bg-[#c8a165] hover:text-black hover:border-[#c8a165] transition-all shadow-xl cursor-pointer"
                  title="Önceki Görsel"
                >
                  <span className="text-xl sm:text-2xl font-bold leading-none select-none">
                    ‹
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md border border-white/20 hover:bg-[#c8a165] hover:text-black hover:border-[#c8a165] transition-all shadow-xl cursor-pointer"
                  title="Sonraki Görsel"
                >
                  <span className="text-xl sm:text-2xl font-bold leading-none select-none">
                    ›
                  </span>
                </button>

                {/* Alt Kaydırma Noktaları (Dots) */}
                <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? "w-6 bg-[#c8a165]"
                            : "w-2 bg-white/40 hover:bg-white/80"
                        }`}
                        title={`Görsel ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Görsel Sayacı */}
                <div className="absolute bottom-3 right-4 z-10 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/15">
                  {activeImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {/* Küçük Resimler (Thumbnails) - Resim çerçeveye tam doldurulur */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 sm:gap-3.5 overflow-x-auto py-2 px-1 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border bg-[#151920] transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-[#c8a165] ring-2 ring-[#c8a165]/50 shadow-lg"
                      : "border-white/15 opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={
                      idx === 0 ? product.name : `${product.name} - ${idx + 1}`
                    }
                    title={product.name}
                    className="h-full w-full object-fill"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Header & Tagline */}
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#c8a165] uppercase">
              LUMERA OUTDOOR COLLECTION
            </span>
            <h1 className="mt-1.5 text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="mt-2.5 flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="flex items-center gap-1 text-amber-400 font-bold hover:underline cursor-pointer"
              >
                <span>★★★★★</span>
                <span className="ml-1 text-zinc-200 font-normal">
                  {averageRating} ({reviews.length} Değerlendirme)
                </span>
              </button>
              <span className="text-zinc-500">•</span>
              <div>
                {product.stock > 10 ? (
                  <span className="font-semibold text-emerald-400">
                    ✓ Stokta Var ({product.stock})
                  </span>
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
          <div className="rounded-3xl border border-white/15 bg-[#1e242d]/90 p-5 backdrop-blur-2xl shadow-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-300 font-light">
                Özel Koleksiyon Fiyatı
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black gold-gradient-text">
                  ₺{product.price.toLocaleString("tr-TR")}
                </span>
                <span className="text-sm sm:text-base text-zinc-400 line-through font-light">
                  ₺{oldPrice.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>

            <div
              className={`rounded-2xl px-3.5 py-2 text-right border ${
                isFreeShipping
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-200"
              }`}
            >
              <span
                className={`block text-[10px] font-extrabold uppercase tracking-wider ${
                  isFreeShipping ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {isFreeShipping ? "ÜCRETSİZ KARGO" : "KARGO ALICIYA AİTTİR"}
              </span>
              <span className="text-[11px] font-semibold">
                {isFreeShipping
                  ? "Sigortalı Teslimat"
                  : `₺${shippingFee} Kargo Bedeli`}
              </span>
            </div>
          </div>

          {/* FİYATIN HEMEN ALTINDA: Sepete Ekle, WhatsApp & Toptan Teklif Butonları */}
          <div className="space-y-3 rounded-3xl border border-[#c8a165]/30 bg-[#1e242d]/90 p-5 backdrop-blur-2xl shadow-xl">
            {/* Materyal Tercihi */}
            <div className="space-y-2 pb-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🪵</span>
                  <span>Materyal Tercihi</span>
                </span>
                <span className="text-[11px] font-extrabold text-[#e5c184] bg-[#c8a165]/15 border border-[#c8a165]/30 rounded-full px-2.5 py-0.5">
                  {selectedMaterial}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {materialChoices.map((mat) => {
                  const isSelected = selectedMaterial === mat;
                  const icon =
                    mat === "Masif Ahşap"
                      ? "🌲"
                      : mat === "Metal"
                      ? "⚙️"
                      : mat === "Metal + Ahşap"
                      ? "✨"
                      : "🎨";
                  return (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`relative flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#c8a165]/20 border-[#c8a165] text-[#e5c184] shadow-md"
                          : "bg-[#151920] border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                      }`}
                    >
                      <span className="text-sm">{icon}</span>
                      <span className="text-[11px] font-bold leading-tight">
                        {mat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Adet Seçimi & Sepete Ekle Butonu */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center rounded-full border border-white/15 bg-[#151920] p-1 shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white hover:bg-white/10 disabled:opacity-30 transition cursor-pointer"
                >
                  −
                </button>
                <span className="w-8 sm:w-9 text-center font-bold text-white text-sm sm:text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white hover:bg-white/10 disabled:opacity-30 transition cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 rounded-full py-3.5 px-5 text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  product.stock === 0
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed border border-white/5"
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Sepete Ekle ({quantity} Adet)</span>
                  </>
                )}
              </button>
            </div>

            {/* Projeleriniz İçin Toptan Fiyat Teklifi Alın Butonu */}
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-full border-2 border-[#c8a165] bg-[#c8a165]/15 text-[#e5c184] hover:bg-[#c8a165] hover:text-black font-extrabold text-xs sm:text-sm shadow-lg transition-all duration-300 cursor-pointer"
            >
              <span className="text-base">🏢</span>
              <span>Projeleriniz İçin Toptan Fiyat Teklifi Alın</span>
              <span className="text-xs font-black">→</span>
            </button>

            {/* WhatsApp Hızlı Sipariş Butonu */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-full bg-[#25D366] text-black font-black text-xs sm:text-sm shadow-[0_6px_20px_rgba(37,211,102,0.35)] hover:bg-[#20bd5a] hover:scale-[1.01] active:scale-95 transition-all duration-300 border border-white/20 overflow-hidden"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-xs font-normal shrink-0">
                💬
              </span>
              <span>WhatsApp ile Sipariş Ver & Bilgi Al</span>
              <span className="text-xs font-extrabold transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Tab Navigation: Description / Specifications / Shipping / Reviews */}
          <div className="rounded-3xl border border-white/15 bg-[#1e242d]/90 p-5 sm:p-6 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex border-b border-white/10 pb-3 gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("desc")}
                className={`pb-2 transition shrink-0 relative cursor-pointer ${
                  activeTab === "desc"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Açıklama
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-2 transition shrink-0 relative cursor-pointer ${
                  activeTab === "specs"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Ürün Özellikleri
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-2 transition shrink-0 relative cursor-pointer ${
                  activeTab === "shipping"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Teslimat & Kargo
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-2 transition shrink-0 relative cursor-pointer ${
                  activeTab === "reviews"
                    ? "text-[#c8a165] border-b-2 border-[#c8a165]"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Yorumlar ({reviews.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="text-xs sm:text-sm leading-relaxed text-zinc-200 font-light">
              {activeTab === "desc" && (
                <div
                  className="product-description-content text-xs sm:text-sm leading-relaxed text-zinc-200 font-light"
                  dangerouslySetInnerHTML={{
                    __html: formatProductDescription(
                      product.description ||
                        (activeIsWood
                          ? "Bu özel tasarım ürün, dış mekan koşullarına yüksek dayanıklılık gösteren fırınlanmış masif ahşaptan üretilmiştir. Dinlenme alanlarınıza şıklık katmak üzere tasarlanmıştır."
                          : activeIsMetal
                          ? "Bu özel tasarım ürün, dış mekan koşullarına ve yüksek ısıya dayanıklı hassas işlenmiş çelikten üretilmiştir. Dinlenme alanlarınıza şıklık katmak üzere tasarlanmıştır."
                          : "Bu seçkin ürün, dış mekan koşullarına yüksek dayanıklılık gösteren üst düzey zanaatle üretilmiştir.")
                    ),
                  }}
                />
              )}

              {activeTab === "specs" && (
                <dl className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#151920] p-3 border border-white/10">
                    <dt className="text-[10px] text-zinc-400 uppercase font-bold">
                      Tercih Edilen Materyal
                    </dt>
                    <dd className="mt-1 font-semibold text-[#e5c184]">
                      {selectedMaterial}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[#151920] p-3 border border-white/10">
                    <dt className="text-[10px] text-zinc-400 uppercase font-bold">
                      Ölçüler
                    </dt>
                    <dd className="mt-1 font-semibold text-white">
                      {product.dimensions || "Standart Lüks Ölçü"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[#151920] p-3 border border-white/10">
                    <dt className="text-[10px] text-zinc-400 uppercase font-bold">
                      Stok Adedi
                    </dt>
                    <dd className="mt-1 font-semibold text-white">
                      {product.stock} Adet
                    </dd>
                  </div>
                  <div className="rounded-xl bg-[#151920] p-3 border border-white/10">
                    <dt className="text-[10px] text-zinc-400 uppercase font-bold">
                      Üretim Türü
                    </dt>
                    <dd className="mt-1 font-semibold text-white">
                      {craftsmanshipBadge}
                    </dd>
                  </div>
                </dl>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-3">
                  <p>
                    • Türkiye geneli <strong>Özel Korumalı Sandık</strong>{" "}
                    ambalajı ile{" "}
                    {isFreeShipping ? (
                      <span className="text-emerald-300 font-bold">
                        ücretsiz teslim edilir.
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold">
                        kargo alıcıya aittir (₺{shippingFee} kargo bedeli ile
                        gönderilir).
                      </span>
                    )}
                  </p>
                  <p>
                    • <strong>Çoklu Ürün Kargo Avantajı:</strong> Birden fazla
                    ürün alımında en yüksek kargo ücreti üzerine diğer ürünlerin
                    kargo bedelinin yalnızca %40&apos;ı eklenir (%60 kargo
                    indirimi uygulanır).
                  </p>
                  <p>
                    • Ürünlerimiz{" "}
                    <strong>2 Yıl Lumera Üretici Garantisi</strong>{" "}
                    kapsamındadır.
                  </p>
                  <p>
                    • 14 gün içinde koşulsuz iade ve değişim güvencesi
                    sunulmaktadır.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews Summary */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-base">
                        <span>★★★★★</span>
                        <span className="ml-1 text-white text-sm">
                          {averageRating} / 5.0
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-0.5">
                        {reviews.length} müşteri değerlendirmesi
                      </p>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {reviews.length === 0 ? (
                      <p className="text-zinc-400 italic text-xs">
                        Bu ürün için henüz yorum yapılmamış. İlk yorumu siz
                        yazın!
                      </p>
                    ) : (
                      reviews.map((r, i) => (
                        <div
                          key={r.id || i}
                          className="rounded-2xl border border-white/10 bg-[#151920] p-4 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">
                              {r.name}
                            </span>
                            <div className="flex text-amber-400 text-xs">
                              {"★".repeat(r.rating || 5)}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-200 font-light leading-relaxed">
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
                    <h4 className="text-xs font-bold text-white">
                      Yorum Yazın
                    </h4>

                    {reviewSuccess && (
                      <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-xs text-emerald-200">
                        {reviewSuccess}
                      </div>
                    )}
                    {reviewError && (
                      <div className="rounded-xl bg-rose-500/20 border border-rose-500/30 p-2.5 text-xs text-rose-200">
                        {reviewError}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-300">
                        Puanınız:
                      </span>
                      <div className="flex gap-1 text-amber-400 text-lg cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`transition hover:scale-125 ${
                              star <= reviewRating
                                ? "text-amber-400"
                                : "text-zinc-600"
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
                      className="w-full rounded-xl bg-[#151920] border border-white/15 p-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                    />

                    <textarea
                      placeholder="Ürün hakkındaki deneyiminiz ve yorumunuz..."
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full rounded-xl bg-[#151920] border border-white/15 p-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                    />

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="rounded-full bg-[#c8a165] px-5 py-2 text-xs font-bold text-black hover:bg-[#e5c184] transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingReview
                        ? "Gönderiliyor..."
                        : "Yorumu Gönder"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Privilege Badges Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-white/10 pt-4">
            <div className="rounded-2xl border border-white/10 bg-[#1e242d]/60 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">🚚</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                {isFreeShipping ? "Ücretsiz Kargo" : "Kargo Alıcıya Ait"}
              </h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-400 hidden xs:block">
                {isFreeShipping ? "Tüm Türkiye" : `₺${shippingFee} Bedelle`}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e242d]/60 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">🛡️</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                2 Yıl Garanti
              </h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-400 hidden xs:block">
                {activeIsWood
                  ? "Masif Ahşap"
                  : activeIsMetal
                  ? "Paslanmaz Metal"
                  : "Lüks Malzeme"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1e242d]/60 p-2.5 sm:p-3 text-center">
              <span className="text-lg sm:text-xl">💳</span>
              <h4 className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight">
                Güvenli Ödeme
              </h4>
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-zinc-400 hidden xs:block">
                256-bit SSL
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobil Alt Sabit Bar: Sepete Ekle Tam Görünür (z-40) */}
      <div className="md:hidden fixed bottom-[57px] left-0 right-0 z-40 bg-[#181d25]/95 backdrop-blur-xl border-t border-white/15 p-2.5 px-3 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(true)}
            className="flex items-center justify-center gap-1 py-3 px-3 rounded-full border border-[#c8a165] bg-[#c8a165]/15 text-[#e5c184] font-bold text-[11px] shrink-0 active:scale-95 transition"
          >
            <span>🏢</span>
            <span>Toptan Teklif</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 rounded-full py-3 px-4 text-xs font-extrabold transition-all shadow-xl flex items-center justify-center gap-1.5 cursor-pointer ${
              product.stock === 0
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
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
                <span>Sepete Eklendi</span>
              </>
            ) : (
              <>
                <span>🛍️</span>
                <span>Sepete Ekle (₺{product.price.toLocaleString("tr-TR")})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toptan Fiyat Teklifi Modal */}
      <WholesaleQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialProduct={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: mainProductImageUrl,
          category: product.category,
        }}
      />

      {/* Lightbox / Fullscreen Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-lg font-bold cursor-pointer"
            title="Kapat"
          >
            ✕
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative max-h-[75vh] w-full flex items-center justify-center">
              <img
                src={activeImage || "/images/no-image.jpg"}
                alt={product.name}
                title={product.name}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-[#c8a165] hover:text-black transition text-2xl font-bold cursor-pointer backdrop-blur-md"
                  title="Önceki"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-[#c8a165] hover:text-black transition text-2xl font-bold cursor-pointer backdrop-blur-md"
                  title="Sonraki"
                >
                  ›
                </button>
              </>
            )}

            {allImages.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto p-2 scrollbar-none max-w-full">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#c8a165] ring-2 ring-[#c8a165]"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={
                        idx === 0 ? product.name : `${product.name} - ${idx + 1}`
                      }
                      title={product.name}
                      className="h-full w-full object-fill"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
