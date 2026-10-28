"use client";

import { useState, useEffect } from "react";
import { TURKEY_PROVINCES } from "@/lib/data/turkeyLocations";

type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

interface WholesaleQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct: CatalogProduct;
}

export default function WholesaleQuoteModal({
  isOpen,
  onClose,
  initialProduct,
}: WholesaleQuoteModalProps) {
  const [catalog, setCatalog] = useState<CatalogProduct[]>([initialProduct]);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<number, number>
  >({
    [initialProduct.id]: 5,
  });

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    taxOffice: "",
    taxNumber: "",
    city: "",
    address: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState<{
    quoteNumber: string;
    whatsappUrl: string;
    mailtoUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedQuantities((prev) => ({
      ...prev,
      [initialProduct.id]: prev[initialProduct.id] || 5,
    }));

    fetch("/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          const list: CatalogProduct[] = data.products;
          const exists = list.some((p) => p.id === initialProduct.id);
          setCatalog(exists ? list : [initialProduct, ...list]);
        }
      })
      .catch(() => {});
  }, [isOpen, initialProduct]);

  if (!isOpen) return null;

  function toggleProductSelection(productId: number) {
    setSelectedQuantities((prev) => {
      const next = { ...prev };
      if (next[productId] && next[productId] > 0) {
        delete next[productId];
      } else {
        next[productId] = 5;
      }
      return next;
    });
  }

  function updateQuantity(productId: number, qty: number) {
    const clean = Math.max(0, Math.min(9999, qty));
    setSelectedQuantities((prev) => {
      const next = { ...prev };
      if (clean <= 0) {
        delete next[productId];
      } else {
        next[productId] = clean;
      }
      return next;
    });
  }

  const selectedList = catalog
    .filter((p) => (selectedQuantities[p.id] || 0) > 0)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      image: p.image,
      category: p.category,
      unitPrice: p.price,
      quantity: selectedQuantities[p.id],
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !form.companyName.trim() ||
      !form.contactPerson.trim() ||
      !form.phone.trim() ||
      !form.email.trim()
    ) {
      setError(
        "Lütfen Firma Ünvanı, Yetkili Adı Soyadı, Telefon ve E-posta alanlarını doldurunuz."
      );
      return;
    }

    if (selectedList.length === 0) {
      setError("Lütfen teklif almak istediğiniz en az 1 ürünü listeden seçiniz.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: selectedList,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Teklif talebi gönderilemedi.");
        setSubmitting(false);
        return;
      }

      setResultData({
        quoteNumber: data.quoteNumber,
        whatsappUrl: data.whatsappUrl,
        mailtoUrl: data.mailtoUrl,
      });

      // Otomatik olarak WhatsApp penceresini aç
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setError("Sunucu bağlantı hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#c8a165]/40 bg-[#181d25] p-5 sm:p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white transition cursor-pointer"
          title="Kapat"
        >
          ✕
        </button>

        {/* Başlık */}
        <div className="mb-6 pr-8">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#c8a165] uppercase">
            LUMERA KURUMSAL & PROJE ÇÖZÜMLERİ
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-white">
            Projeleriniz İçin Toptan Fiyat Teklifi Alın
          </h2>
          <p className="mt-1 text-xs text-zinc-300 font-light">
            Otel, restoran, plaj, havuz başı ve mimari projeleriniz için şirket bilgilerinizi girip ürünleri seçerek anında özel fiyat teklifi isteyebilirsiniz.
          </p>
        </div>

        {resultData ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Teklif Talebiniz Sisteme Kaydedildi!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-200 max-w-lg mx-auto">
              Talep Numaranız:{" "}
              <strong className="text-[#e5c184]">{resultData.quoteNumber}</strong>.
              Talebiniz hem yönetim paneline kaydedildi hem de{" "}
              <strong className="text-white">lumeratasarim@gmail.com</strong> hesabına iletildi.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={resultData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-black shadow-lg hover:bg-[#20bd5a] transition"
              >
                <span>💬</span>
                <span>WhatsApp ile Teklifi İlet</span>
              </a>

              <a
                href={resultData.mailtoUrl}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-[#c8a165] bg-[#c8a165]/15 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#e5c184] hover:bg-[#c8a165] hover:text-black transition"
              >
                <span>✉️</span>
                <span>lumeratasarim@gmail.com E-posta Gönder</span>
              </a>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setResultData(null);
                  onClose();
                }}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 p-3.5 text-xs text-rose-200 font-medium">
                {error}
              </div>
            )}

            {/* 1. Şirket / Kurum Bilgileri */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#e5c184] border-b border-white/10 pb-2">
                1. Şirket & İletişim Bilgileri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Firma / Şirket Ünvanı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Akdeniz Turizm Otelcilik A.Ş."
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Yetkili Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Sinan Kasap"
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm({ ...form, contactPerson: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Telefon Numarası *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Kurumsal E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="satin-alma@sirketiniz.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Vergi Dairesi (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="Vergi Dairesi"
                    value={form.taxOffice}
                    onChange={(e) =>
                      setForm({ ...form, taxOffice: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Vergi Numarası (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    placeholder="Vergi No / TCKN"
                    value={form.taxNumber}
                    onChange={(e) =>
                      setForm({ ...form, taxNumber: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Proje İli
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[#c8a165] outline-none"
                  >
                    <option value="">İl Seçiniz</option>
                    {TURKEY_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    Teslimat / Proje Adresi
                  </label>
                  <input
                    type="text"
                    placeholder="İlçe / Mahalle / Şantiye veya Otel Adı"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#11151b] border border-white/15 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Proje Detayları / Özel Talepleriniz
                </label>
                <textarea
                  rows={2}
                  placeholder="Özel ölçü, minder rengi, teslimat tarihi vb. notlarınızı yazabilirsiniz..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl bg-[#11151b] border border-white/15 p-3 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
                />
              </div>
            </div>

            {/* 2. Ürün Seçimi ve Adet Belirleme */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e5c184]">
                  2. Teklif İstenen Ürünleri Seçin ({selectedList.length} Ürün Seçili)
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Ürünleri işaretleyip adet giriniz
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {catalog.map((item) => {
                  const qty = selectedQuantities[item.id] || 0;
                  const isChecked = qty > 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleProductSelection(item.id)}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 transition cursor-pointer ${
                        isChecked
                          ? "border-[#c8a165] bg-[#c8a165]/10"
                          : "border-white/10 bg-[#11151b]/70 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 accent-[#c8a165] rounded cursor-pointer shrink-0"
                        />
                        <img
                          src={item.image || "/images/no-image.jpg"}
                          alt={item.name}
                          className="h-11 w-14 rounded-lg object-fill border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#e5c184]">
                            Liste Fiyatı: ₺{item.price.toLocaleString("tr-TR")}
                          </p>
                        </div>
                      </div>

                      {isChecked && (
                        <div
                          className="flex items-center gap-1.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[11px] text-zinc-300">Adet:</span>
                          <input
                            type="number"
                            min={1}
                            max={9999}
                            value={qty}
                            onChange={(e) =>
                              updateQuantity(item.id, Number(e.target.value))
                            }
                            className="w-16 rounded-lg border border-[#c8a165]/50 bg-[#0d1015] px-2 py-1 text-center text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gönder Butonu */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-full border border-white/15 px-5 py-3 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition cursor-pointer"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto rounded-full gold-gradient-btn px-7 py-3.5 text-xs sm:text-sm font-extrabold text-black shadow-xl hover:scale-[1.02] transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>
                  {submitting
                    ? "Teklif Talebi Gönderiliyor..."
                    : "Teklif İste (E-posta & WhatsApp ile İlet)"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

