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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
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
        setMessage({ type: "success", text: "Site ayarları ve yazıları başarıyla güncellendi!" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "Ayarlar güncellenirken bir hata oluştu." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Sunucu ile bağlantı kurulamadı." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border backdrop-blur-md ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? "✓ " : "✕ "}
          {message.text}
        </div>
      )}

      {/* 1. ÜST DUYURU VE HEADER METİNLERİ */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-bold text-[#e5c184] mb-2 flex items-center gap-2">
          <span>📢</span> Üst Duyuru Çubuğu & Header Bilgileri
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Sitenin en üst kısmında yer alan kargo teklifi ve kampanya yazılarını buradan değiştirebilirsiniz.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Sol Üst Duyuru Metni (Örn: Ücretsiz Kargo Mesajı)
            </label>
            <input
              name="topBannerText"
              value={settings.topBannerText || ""}
              onChange={handleChange}
              placeholder="✨ 750 TL ve üzeri siparişlerde Ücretsiz Kargo"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>

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

      {/* 2. İLETİŞİM BİLGİLERİ */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-bold text-[#e5c184] mb-2 flex items-center gap-2">
          <span>📞</span> İletişim Bilgileri
        </h2>
        <p className="text-xs text-zinc-400 mb-6 font-light">
          Header ve Footer alanlarında gösterilen telefon numarası ve destek adreslerini düzenleyin.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Müşteri Hizmetleri Telefon Numarası
            </label>
            <input
              name="contactPhone"
              value={settings.contactPhone || ""}
              onChange={handleChange}
              placeholder="0850 XXX XX XX"
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
              placeholder="destek@lumera.com"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. ANA SAYFA HERO (KARŞILAMA) ALANI YAZILARI */}
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
              placeholder="Bahçenizi sıradan bir alandan çıkarıp..."
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`gold-gradient-btn px-10 py-4 rounded-full font-extrabold text-black shadow-2xl transition-all ${
            loading ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {loading ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
        </button>
      </div>
    </form>
  );
}
