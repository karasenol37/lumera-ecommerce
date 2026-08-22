"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";

interface GalleryImage {
  id: number;
  url: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "Hamak",
    price: "",
    oldPrice: "",
    stock: "",
    description: "",
    material: "",
    dimensions: "",
    isActive: true,
  });

  const [currentMainImage, setCurrentMainImage] = useState<string | null>(null);
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [existingGallery, setExistingGallery] = useState<GalleryImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();

        if (!res.ok || !data.product) {
          setError(data.message || "Ürün verileri alınamadı.");
          return;
        }

        const p = data.product;

        setForm({
          name: p.name || "",
          slug: p.slug || "",
          category: p.category || "Hamak",
          price: p.price !== undefined ? String(p.price) : "",
          oldPrice: p.oldPrice !== undefined ? String(p.oldPrice) : "",
          stock: p.stock !== undefined ? String(p.stock) : "0",
          description: p.description || "",
          material: p.material || "",
          dimensions: p.dimensions || "",
          isActive: p.isActive ?? true,
        });

        setCurrentMainImage(p.image || null);
        setExistingGallery(p.images || []);
      } catch (err) {
        console.error("Ürün yüklenirken hata oluştu:", err);
        setError("Sunucu ile iletişim kurulurken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [value ? name : name]: value }));
    }
  }

  function generateSlug() {
    const slugified = form.name
      .toLowerCase()
      .trim()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((prev) => ({ ...prev, slug: slugified }));
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewGalleryFiles((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setNewGalleryPreviews((prev) => [...prev, ...previews]);
    }
  }

  function removeExistingGalleryImage(imageId: number) {
    setExistingGallery((prev) => prev.filter((img) => img.id !== imageId));
    setDeletedImageIds((prev) => [...prev, imageId]);
  }

  function removeNewGalleryFile(index: number) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("oldPrice", form.oldPrice);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("material", form.material);
      formData.append("dimensions", form.dimensions);
      formData.append("isActive", String(form.isActive));

      if (newMainImage) {
        formData.append("mainImage", newMainImage);
      }

      if (deletedImageIds.length > 0) {
        formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
      }

      newGalleryFiles.forEach((file) => {
        formData.append("gallery", file);
      });

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Güncelleme başarısız oldu.");
      }

      setSuccess("Ürün bilgileri veritabanında başarıyla güncellendi.");
      if (data.product) {
        setCurrentMainImage(data.product.image);
        setExistingGallery(data.product.images || []);
        setNewMainImage(null);
        setMainImagePreview(null);
        setNewGalleryFiles([]);
        setNewGalleryPreviews([]);
        setDeletedImageIds([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ürün güncellenirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090a0f] p-10 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#c8a165] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 font-medium">Ürün bilgileri yükleniyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090a0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <AdminHeader
          title={`Ürün Düzenle: ${form.name || `#${id}`}`}
          subtitle="Veritabanındaki tüm ürün bilgilerini inceleyin ve güncelleyin"
        />

        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#c8a165] hover:underline"
          >
            ← Ürün Listesine Dön
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              className="text-xs underline text-red-300"
            >
              Kapat
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400 flex items-center justify-between">
            <span>✅ {success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="text-xs underline text-emerald-300"
            >
              Kapat
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl"
        >
          {/* Yayın Durumu Switch */}
          <div className="flex items-center justify-between rounded-xl bg-[#090a0f] p-4 border border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white">Yayın Durumu</h4>
              <p className="text-xs text-zinc-400">
                Ürünün mağazada listelenip listelenmeyeceğini belirler.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c8a165]"></div>
              <span className="ml-3 text-xs font-semibold text-zinc-300">
                {form.isActive ? "Aktif (Yayında)" : "Pasif (Gizli)"}
              </span>
            </label>
          </div>

          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Örn: Masif Ahşap Lüks Hamak"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-[11px] font-semibold text-[#c8a165] hover:underline"
                >
                  Adından Üret
                </button>
              </div>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="masif-ahsap-luks-hamak"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>
          </div>

          {/* Kategori ve Fiyatlar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              >
                <option value="Hamak">Hamak</option>
                <option value="Şemsiye">Şemsiye</option>
                <option value="Şezlong">Şezlong</option>
                <option value="Ateş Çukuru">Ateş Çukuru</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Satış Fiyatı (TL) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="2499.00"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Eski Fiyat (TL)
              </label>
              <input
                type="number"
                step="0.01"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="3299.00"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Stok Adedi *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="15"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Ürün Açıklaması *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Ürünün özelliklerini detaylı bir şekilde açıklayın..."
              className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
            />
          </div>

          {/* Malzeme & Ölçüler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Malzeme / Materyal
              </label>
              <input
                type="text"
                name="material"
                value={form.material}
                onChange={handleChange}
                placeholder="Örn: %100 Fırınlanmış Teak Ağacı & Su Geçirmez Kumaş"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Ölçüler / Boyutlar
              </label>
              <input
                type="text"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                placeholder="Örn: 200cm x 140cm x 110cm"
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>
          </div>

          {/* Ana Görsel Yönetimi */}
          <div className="rounded-xl border border-white/10 bg-[#090a0f] p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Ana Görsel
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {(mainImagePreview || currentMainImage) && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/20 bg-black/40">
                  <Image
                    src={mainImagePreview || currentMainImage!}
                    alt="Ana Ürün Görseli"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {mainImagePreview && (
                    <span className="absolute bottom-1 right-1 rounded bg-[#c8a165] text-black text-[10px] font-bold px-1.5 py-0.5">
                      Yeni
                    </span>
                  )}
                </div>
              )}

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#c8a165] file:text-black hover:file:bg-[#b58f54] cursor-pointer"
                />
                <p className="text-[11px] text-zinc-500">
                  Seçilen yeni dosya mevcut ana görselin yerini alacaktır.
                </p>
              </div>
            </div>
          </div>

          {/* Galeri Görselleri Yönetimi */}
          <div className="rounded-xl border border-white/10 bg-[#090a0f] p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Galeri Görselleri
            </h4>

            {/* Mevcut Galeri */}
            {existingGallery.length > 0 && (
              <div>
                <p className="text-xs text-zinc-400 mb-3 font-medium">
                  Mevcut Galeri Görselleri ({existingGallery.length}):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {existingGallery.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40"
                    >
                      <Image
                        src={img.url}
                        alt="Galeri Görseli"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(img.id)}
                        className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 text-xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        title="Görseli Sil"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yeni Yüklenen Galeri Önizlemeleri */}
            {newGalleryPreviews.length > 0 && (
              <div>
                <p className="text-xs text-amber-400 mb-3 font-medium">
                  Yüklenecek Yeni Görseller ({newGalleryPreviews.length}):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {newGalleryPreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-[#c8a165]/40 bg-black/40"
                    >
                      <Image
                        src={url}
                        alt="Yeni Görsel"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryFile(idx)}
                        className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full p-1 text-xs"
                        title="İptal Et"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                Yeni Galeri Görselleri Ekle:
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryChange}
                className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-[#c8a165] py-4 text-sm font-extrabold text-black hover:bg-[#b58f54] transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Güncelleniyor...</span>
                </>
              ) : (
                <span>Değişiklikleri Veritabanına Kaydet</span>
              )}
            </button>

            <Link
              href="/admin/products"
              className="rounded-full border border-zinc-700 bg-zinc-900/80 px-6 py-4 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}