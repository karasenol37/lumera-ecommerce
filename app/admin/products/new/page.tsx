"use client";

import { useState } from "react";
import { createProduct } from "@/lib/actions/product";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Hamak",
    price: "",
    oldPrice: "",
    description: "",
    material: "",
    dimensions: "",
    stock: "10",
    freeShipping: true,
    shippingFee: "0",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

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
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!mainImage) {
      alert("Lütfen bir ana görsel seçin.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("oldPrice", form.oldPrice);
      formData.append("description", form.description);
      formData.append("material", form.material);
      formData.append("dimensions", form.dimensions);
      formData.append("stock", form.stock);
      formData.append("freeShipping", String(form.freeShipping));
      formData.append("shippingFee", form.freeShipping ? "0" : form.shippingFee);

      formData.append("mainImage", mainImage);

      galleryImages.forEach((image) => {
        formData.append("images", image);
      });

      await createProduct(formData);
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Ürün eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090a0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <AdminHeader
          title="Yeni Ürün Ekle"
          subtitle="Kataloğunuza yeni ürün ekleyin, kategori, kargo ve görsellerini tanımlayın"
        />

        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#c8a165] hover:underline"
          >
            ← Ürün Listesine Dön
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl"
        >
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Ürün Adı *
              </label>
              <input
                name="name"
                placeholder="Örn: Masif Ahşap Lüks Hamak"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              >
                <option value="Hamak">Hamak</option>
                <option value="Lüks Şezlong">Lüks Şezlong</option>
                <option value="Şemsiye Modelleri">Şemsiye Modelleri</option>
                <option value="Ateş Çukurları">Ateş Çukurları</option>
              </select>
            </div>
          </div>

          {/* Fiyatlar ve Stok */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Satış Fiyatı (TL) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="2499.00"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Eski Fiyat (TL)
              </label>
              <input
                name="oldPrice"
                type="number"
                step="0.01"
                placeholder="3299.00"
                value={form.oldPrice}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Stok Adedi *
              </label>
              <input
                name="stock"
                type="number"
                placeholder="10"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>
          </div>

          {/* Kargo Seçenekleri */}
          <div className="rounded-xl border border-white/10 bg-[#090a0f] p-5 space-y-4">
            <h4 className="text-sm font-bold text-[#e5c184] uppercase tracking-wider flex items-center gap-2">
              <span>🚚</span> Kargo Ayarları
            </h4>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingType"
                    checked={form.freeShipping}
                    onChange={() => setForm((prev) => ({ ...prev, freeShipping: true, shippingFee: "0" }))}
                    className="w-4 h-4 text-[#c8a165] focus:ring-[#c8a165]"
                  />
                  <span className="text-sm font-medium text-emerald-400">
                    ✓ Ücretsiz Kargo
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingType"
                    checked={!form.freeShipping}
                    onChange={() => setForm((prev) => ({ ...prev, freeShipping: false }))}
                    className="w-4 h-4 text-[#c8a165] focus:ring-[#c8a165]"
                  />
                  <span className="text-sm font-medium text-zinc-300">
                    Ücretli Kargo
                  </span>
                </label>
              </div>

              {!form.freeShipping && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-zinc-400">
                    Kargo Ücreti (TL):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="shippingFee"
                    value={form.shippingFee}
                    onChange={handleChange}
                    placeholder="150"
                    className="w-32 rounded-lg border border-white/10 bg-[#121420] p-2.5 text-sm text-white focus:border-[#c8a165] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Malzeme & Ölçüler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Malzeme / Materyal
              </label>
              <input
                name="material"
                placeholder="Örn: %100 Fırınlanmış Teak Ağacı"
                value={form.material}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Ölçüler / Boyutlar
              </label>
              <input
                name="dimensions"
                placeholder="Örn: 200cm x 140cm x 110cm"
                value={form.dimensions}
                onChange={handleChange}
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
              placeholder="Ürünün özelliklerini detaylı bir şekilde açıklayın..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              className="w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 text-sm text-white focus:border-[#c8a165] focus:outline-none"
            />
          </div>

          {/* Ana Görsel */}
          <div className="rounded-xl border border-white/10 bg-[#090a0f] p-5 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Ana Görsel *
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files) {
                  setMainImage(e.target.files[0]);
                }
              }}
              className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#c8a165] file:text-black hover:file:bg-[#b58f54] cursor-pointer"
            />
          </div>

          {/* Galeri Görselleri */}
          <div className="rounded-xl border border-white/10 bg-[#090a0f] p-5 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Galeri Görselleri (Çoklu Seçim)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryChange}
              className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-[#c8a165] py-4 text-sm font-extrabold text-black hover:bg-[#b58f54] transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Ürün Kaydediliyor...</span>
                </>
              ) : (
                <span>Ürünü Kaydet</span>
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