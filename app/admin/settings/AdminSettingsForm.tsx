"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  }

  async function handleFileUpload(key: string, file: File) {
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setSettings((prev) => ({
          ...prev,
          [key]: data.url,
        }));
        setMessage({
          type: "success",
          text: "Görsel başarıyla yüklendi! Kaydet butonuna tıklayarak yayınlayın.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Görsel yüklenemedi.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Görsel yüklenirken bir hata oluştu." });
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Site ayarları, adres ve görseller başarıyla güncellendi!",
        });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Ayarlar güncellenirken bir hata oluştu.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Sunucu ile bağlantı kurulamadı." });
    } finally {
      setLoading(false);
    }
  }

  const categoryItems = [
    {
      name: "Hamak Modelleri",
      key: "category_image_hamak",
      defaultImg: "/images/categories/hamak.jpg",
      desc: "Masif Ahşap Standlı & Lüks Pamuklu Hamaklar",
    },
    {
      name: "Lüks Şezlong",
      key: "category_image_sezlong",
      defaultImg: "/images/categories/sezlong.jpg",
      desc: "Ergonomik Tasarımlı Teak Ağacı Havuz & Teras Şezlongları",
    },
    {
      name: "Şemsiye Modelleri",
      key: "category_image_semsiye",
      defaultImg: "/images/categories/semsiye.jpg",
      desc: "Yandan Gövdeli & Güneş Korumalı Dış Mekan Şemsiyeleri",
    },
    {
      name: "Ateş Çukurları",
      key: "category_image_ates_cukuru",
      defaultImg: "/images/categories/ates-cukuru.jpg",
      desc: "Akşam Keyfi İçin Özel Tasarım Çelik Ateş Çukurları",
    },
    {
      name: "Tamamlayıcı Ürünler",
      key: "category_image_tamamlayici",
      defaultImg: "/images/categories/tamamlayici-urunler.jpg",
      desc: "Şemsiye Ayağı & Şemsiye Altlığı, Parçalar ve Aksesuarlar",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs hover:underline cursor-pointer"
          >
            ✕ Kapat
          </button>
        </div>
      )}

      {/* 1. DUYURU & ÜST BANNER */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-bold text-[#e5c184] mb-2 flex items-center gap-2">
          <span>📢</span> En Üst Duyuru Bandı & Başlıklar
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Sitenin en tepesindeki duyuru şeridi ve genel marka sloganı metinleri.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Üst Kayan / Sabit Duyuru Metni
            </label>
            <input
              name="topBannerText"
              value={settings.topBannerText || ""}
              onChange={handleChange}
              placeholder="✨ Doğal Masif Ahşap & El İşçiliği Özel Tasarım Koleksiyonlar"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Sağ Üst Rozet / Kampanya Yazısı
              </label>
              <input
                name="announcementBadge"
                value={settings.announcementBadge || ""}
                onChange={handleChange}
                placeholder="LUMERA LUXURY COLLECTION"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Logo Yanı Slogan / Alt Yazı
              </label>
              <input
                name="brandTagline"
                value={settings.brandTagline || ""}
                onChange={handleChange}
                placeholder="Gölgede zarafet, dinlenmede ayrıcalık."
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. İLETİŞİM BİLGİLERİ & AÇIK ADRES */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-bold text-[#e5c184] mb-2 flex items-center gap-2">
          <span>🏢</span> İletişim & Açık Adres Bilgileri
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Sitede footer ve iletişim sayfasında yer alan telefon, e-posta ve fabrikanın tam açık adresini buradan güncelleyin.
        </p>

        <div className="space-y-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                WhatsApp / Telefon Numarası
              </label>
              <input
                name="contactPhone"
                value={settings.contactPhone || ""}
                onChange={handleChange}
                placeholder="0535 874 69 09"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Destek E-posta Adresi
              </label>
              <input
                name="contactEmail"
                value={settings.contactEmail || ""}
                onChange={handleChange}
                placeholder="lumeratasarim@gmail.com"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Şehir / İlçe Kısa Konum
            </label>
            <input
              name="contactAddress"
              value={settings.contactAddress || ""}
              onChange={handleChange}
              placeholder="Kastamonu / Tosya"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Açık Adres (Fabrika / Atölye / Showroom Tam Adres) *
            </label>
            <textarea
              name="companyFullAddress"
              rows={3}
              value={
                settings.companyFullAddress ||
                "Organize Sanayi Bölgesi, Marangozlar & Metal Sanayi Sitesi No: 14, Tosya / Kastamonu"
              }
              onChange={handleChange}
              placeholder="Örn: Tosya Organize Sanayi Bölgesi, 3. Cadde No: 12 Tosya / Kastamonu"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all leading-relaxed"
            />
            <p className="mt-1.5 text-[11px] text-zinc-400">
              Bu açık adres sitedeki İletişim sayfası, Footer ve Mesafeli Satış Sözleşmesi alanlarında ziyaretçilere açıkça gösterilir.
            </p>
          </div>
        </div>
      </div>

      {/* 3. KATEGORİ / MODEL KLASÖR GÖRSELLERİ YÖNETİMİ */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-bold text-[#e5c184] mb-2 flex items-center gap-2">
          <span>📁</span> Model & Kategori Klasör Görselleri Yönetimi
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Ana sayfada yatay kaydırılan model kartlarının (Hamak, Şezlong, Şemsiye Modelleri vb.) kapak görsellerini buradan doğrudan değiştirebilir veya yeni görsel yükleyebilirsiniz.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryItems.map((cat) => {
            const currentImg = settings[cat.key] || cat.defaultImg;
            const isUploading = uploadingKey === cat.key;

            return (
              <div
                key={cat.key}
                className="rounded-2xl border border-white/10 bg-[#090a0f] p-5 space-y-4 hover:border-[#c8a165]/40 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                  <span className="text-[10px] bg-white/10 text-zinc-300 px-2.5 py-0.5 rounded-full">
                    Kapak Görseli
                  </span>
                </div>

                {/* Görsel Önizleme */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                  <img
                    src={currentImg}
                    alt={cat.name}
                    className="h-full w-full object-cover object-center"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs font-bold text-[#c8a165] animate-pulse">
                      Yükleniyor...
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 font-light leading-snug line-clamp-1">
                  {cat.desc}
                </p>

                {/* Dosya Yükle / URL Alanı */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="block text-[11px] font-semibold text-zinc-300">
                    Bilgisayardan Yeni Resim Yükle:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(cat.key, file);
                    }}
                    className="block w-full text-[11px] text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-[#c8a165] file:text-black hover:file:bg-[#e5c184] cursor-pointer"
                  />

                  <div className="pt-1">
                    <label className="block text-[10px] text-zinc-400 mb-1">
                      Veya Doğrudan Görsel URL&apos;si:
                    </label>
                    <input
                      name={cat.key}
                      value={settings[cat.key] || ""}
                      onChange={handleChange}
                      placeholder={cat.defaultImg}
                      className="w-full rounded-lg bg-[#121420] border border-white/10 p-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ANA SAYFA HERO (KARŞILAMA) ALANI YAZILARI */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-bold text-[#e5c184] mb-2 flex items-center gap-2">
          <span>👑</span> Ana Sayfa (Hero) Karşılama Alanı Yazıları
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Ana sayfaya ilk girildiğinde gözüken büyük manşet başlıkları ve açıklama paragrafını yönetin.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Hero Üst Rozet Metni
            </label>
            <input
              name="heroBadge"
              value={settings.heroBadge || ""}
              onChange={handleChange}
              placeholder="LUMERA PREMIUM OUTDOOR 2026"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Hero Ana Başlık
            </label>
            <input
              name="heroTitle"
              value={settings.heroTitle || ""}
              onChange={handleChange}
              placeholder="Gölgede Zarafet & Konfor"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Hero Açıklama Paragrafı
            </label>
            <textarea
              name="heroSubtitle"
              rows={3}
              value={settings.heroSubtitle || ""}
              onChange={handleChange}
              placeholder="Açık hava yaşam alanlarınızı..."
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end sticky bottom-6 z-20">
        <button
          type="submit"
          disabled={loading}
          className={`gold-gradient-btn px-10 py-4 rounded-full font-extrabold text-black shadow-2xl transition-all cursor-pointer ${
            loading ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {loading ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
