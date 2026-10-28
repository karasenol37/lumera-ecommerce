"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

type ProductOption = {
  id: number;
  name: string;
};

type AdminReview = {
  id: number;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  product?: {
    id: number;
    name: string;
    image?: string;
  };
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [filterProductId, setFilterProductId] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setProducts(data.products || []);
        if (data.products?.length > 0 && !selectedProductId) {
          setSelectedProductId(String(data.products[0].id));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!selectedProductId || !customerName.trim() || !comment.trim()) {
      setFeedback({
        type: "error",
        text: "Lütfen ürün seçiniz, müşteri adını ve yorum metnini doldurunuz.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(selectedProductId),
          name: customerName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setCustomerName("");
        setComment("");
        setRating(5);
        setFeedback({
          type: "success",
          text: "Yeni müşteri yorumu başarıyla eklendi.",
        });
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Yorum eklenemedi.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Sunucu hatası oluştu.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteReview(id: number) {
    if (!confirm("Bu yorumu kalıcı olarak silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setFeedback({
          type: "success",
          text: "Yorum başarıyla silindi.",
        });
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Yorum silinemedi.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Yorum silinirken hata oluştu.",
      });
    }
  }

  const filteredReviews =
    filterProductId === "ALL"
      ? reviews
      : reviews.filter((r) => String(r.productId) === filterProductId);

  return (
    <main className="min-h-screen bg-[#151921] px-4 md:px-8 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Ürün Yorumları Yönetimi"
          subtitle="Ürünlere yeni müşteri yorumları ekleyin veya mevcut yorumları silin."
        />

        {feedback && (
          <div
            className={`mb-6 rounded-2xl border p-4 text-sm font-medium ${
              feedback.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Sütun: Yeni Yorum Ekleme Formu */}
          <div className="lg:col-span-4 rounded-2xl border border-[#c8a165]/30 bg-[#1d222c] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#e5c184] mb-1">
              + Yeni Yorum Ekle
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              İstediğiniz ürüne yeni müşteri değerlendirmesi ekleyebilirsiniz.
            </p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Ürün Seçin *
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-xl bg-[#13171e] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#c8a165] outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Müşteri Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Selim K."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl bg-[#13171e] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Yıldız Puanı
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition hover:scale-110 cursor-pointer ${
                        star <= rating ? "text-amber-400" : "text-zinc-600"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-zinc-400">
                    ({rating} / 5 Yıldız)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Yorum Metni *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ürün kalitesi, kargolama ve memnuniyet hakkındaki yorum..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl bg-[#13171e] border border-white/15 p-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full gold-gradient-btn py-3 text-xs sm:text-sm font-extrabold text-black shadow-lg hover:scale-[1.02] transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Ekleniyor..." : "+ Yorumu Kaydet ve Yayınla"}
              </button>
            </form>
          </div>

          {/* Sağ Sütun: Mevcut Yorumlar Listesi & Silme */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1d222c] p-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Kayıtlı Yorumlar ({filteredReviews.length})
                </h3>
                <p className="text-xs text-zinc-400">
                  Ürüne göre filtreleyebilir veya istemediğiniz yorumları silebilirsiniz.
                </p>
              </div>

              <select
                value={filterProductId}
                onChange={(e) => setFilterProductId(e.target.value)}
                className="rounded-xl bg-[#13171e] border border-white/15 px-3 py-2 text-xs text-white focus:border-[#c8a165] outline-none"
              >
                <option value="ALL">Tüm Ürünler ({reviews.length})</option>
                {products.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-[#1d222c] p-12 text-center text-zinc-400 text-sm">
                Yorumlar yükleniyor...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#1d222c] p-12 text-center text-zinc-400 text-sm">
                Bu kriterde kayıtlı yorum bulunamadı.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-white/10 bg-[#1d222c] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-[#c8a165]/40 transition"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-[#c8a165]/15 border border-[#c8a165]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#e5c184]">
                          {rev.product?.name || `Ürün #${rev.productId}`}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {rev.name}
                        </span>
                        <span className="text-amber-400 text-xs">
                          {"★".repeat(rev.rating || 5)}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(rev.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="shrink-0 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                    >
                      🗑️ Yorumu Sil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

