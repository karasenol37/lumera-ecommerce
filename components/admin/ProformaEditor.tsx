"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ProformaItem,
  KdvStatus,
  ProformaStatus,
  ProformaFormData,
} from "@/lib/proforma/types";
import {
  DEFAULT_BANK_INFO,
  DEFAULT_DELIVERY_TERMS,
  DEFAULT_PAYMENT_TERMS,
  DEFAULT_PROFORMA_NOTES,
  calculateProformaTotals,
  amountToTurkishWords,
  formatCurrencyValue,
} from "@/lib/proforma/utils";

interface CatalogProduct {
  id: number;
  name: string;
  category?: string;
  price: number;
  image?: string;
  material?: string;
  dimensions?: string;
}

interface ProformaEditorProps {
  initialData?: ProformaFormData & { id?: number };
  isEditMode?: boolean;
}

export default function ProformaEditor({
  initialData,
  isEditMode = false,
}: ProformaEditorProps) {
  const router = useRouter();

  // Form states
  const [proformaNumber, setProformaNumber] = useState(
    initialData?.proformaNumber || ""
  );
  const [customerTitle, setCustomerTitle] = useState(
    initialData?.customerTitle || ""
  );
  const [contactPerson, setContactPerson] = useState(
    initialData?.contactPerson || ""
  );
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [taxOffice, setTaxOffice] = useState(initialData?.taxOffice || "");
  const [taxNumber, setTaxNumber] = useState(initialData?.taxNumber || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [country, setCountry] = useState(initialData?.country || "Türkiye");

  const [currency, setCurrency] = useState<"TRY" | "USD" | "EUR">(
    initialData?.currency || "TRY"
  );
  const [currencySymbol, setCurrencySymbol] = useState(
    initialData?.currencySymbol || "₺"
  );
  const [exchangeRate, setExchangeRate] = useState<number>(
    initialData?.exchangeRate || 1.0
  );

  const [kdvRate, setKdvRate] = useState<number>(initialData?.kdvRate ?? 20.0);
  const [kdvStatus, setKdvStatus] = useState<KdvStatus>(
    initialData?.kdvStatus || "HARIC"
  );
  const [discountRate, setDiscountRate] = useState<number>(
    initialData?.discountRate || 0.0
  );

  const [validUntilDays, setValidUntilDays] = useState<number>(
    initialData?.validUntilDays || 15
  );
  const [deliveryTerms, setDeliveryTerms] = useState(
    initialData?.deliveryTerms ?? DEFAULT_DELIVERY_TERMS
  );
  const [paymentTerms, setPaymentTerms] = useState(
    initialData?.paymentTerms ?? DEFAULT_PAYMENT_TERMS
  );
  const [bankInfo, setBankInfo] = useState(
    initialData?.bankInfo ?? DEFAULT_BANK_INFO
  );
  const [notes, setNotes] = useState(
    initialData?.notes ?? DEFAULT_PROFORMA_NOTES
  );
  const [status, setStatus] = useState<ProformaStatus>(
    initialData?.status || "TEKLIF"
  );

  // Line items state
  const [items, setItems] = useState<ProformaItem[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [
          {
            id: `item-${Date.now()}-1`,
            productId: null,
            name: "Lüks Masif Ahşap Bahçe Şemsiyesi (300x300cm)",
            description:
              "1. Sınıf fırınlanmış gürgen iskelet, su ve güneş korumalı ithal akrilik kumaş",
            image: "/images/categories/semsiye.jpg",
            quantity: 2,
            unit: "Adet",
            unitPrice: 18500,
            discountRate: 0,
            lineTotal: 37000,
          },
        ]
  );

  // Catalog modal state
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch catalog products
  useEffect(() => {
    async function loadCatalog() {
      try {
        setCatalogLoading(true);
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (data.products) {
          setCatalogProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching catalog products:", err);
      } finally {
        setCatalogLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Update currency symbol on currency change
  function handleCurrencyChange(newCurr: "TRY" | "USD" | "EUR") {
    setCurrency(newCurr);
    if (newCurr === "TRY") {
      setCurrencySymbol("₺");
      setExchangeRate(1.0);
    } else if (newCurr === "USD") {
      setCurrencySymbol("$");
      if (exchangeRate === 1.0) setExchangeRate(38.5);
    } else if (newCurr === "EUR") {
      setCurrencySymbol("€");
      if (exchangeRate === 1.0) setExchangeRate(41.8);
    }
  }

  // Calculate totals
  const totals = useMemo(() => {
    return calculateProformaTotals(items, kdvRate, kdvStatus, discountRate);
  }, [items, kdvRate, kdvStatus, discountRate]);

  // Turkish words representation of grand total
  const wordsRepresentation = useMemo(() => {
    return amountToTurkishWords(totals.grandTotal, currency);
  }, [totals.grandTotal, currency]);

  // Handle line item update
  function updateItem(id: string, updates: Partial<ProformaItem>) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, ...updates };
        const qty = Number(updated.quantity) || 0;
        const price = Number(updated.unitPrice) || 0;
        const disc = Number(updated.discountRate) || 0;
        updated.lineTotal = Math.round(qty * price * (1 - disc / 100) * 100) / 100;
        return updated;
      })
    );
  }

  // Add empty custom item
  function addCustomItem() {
    const newItem: ProformaItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: null,
      name: "",
      description: "",
      image: "",
      quantity: 1,
      unit: "Adet",
      unitPrice: 0,
      discountRate: 0,
      lineTotal: 0,
    };
    setItems((prev) => [...prev, newItem]);
  }

  // Add item from catalog
  function addCatalogItem(product: CatalogProduct) {
    const newItem: ProformaItem = {
      id: `item-${Date.now()}-${product.id}`,
      productId: product.id,
      name: product.name,
      description: [
        product.dimensions ? `Ölçü: ${product.dimensions}` : null,
        product.material ? `Malzeme: ${product.material}` : null,
        product.category ? `Kategori: ${product.category}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      image: product.image || "",
      quantity: 1,
      unit: "Adet",
      unitPrice: Number(product.price) || 0,
      discountRate: 0,
      lineTotal: Number(product.price) || 0,
    };
    setItems((prev) => [...prev, newItem]);
    setCatalogOpen(false);
  }

  // Duplicate item
  function duplicateItem(item: ProformaItem) {
    const cloned: ProformaItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${item.name} (Kopya)`,
    };
    setItems((prev) => [...prev, cloned]);
  }

  // Remove item
  function removeItem(id: string) {
    if (items.length <= 1) {
      alert("Proformada en az bir kalem bulunmalıdır.");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  // Filtered catalog products for modal
  const filteredCatalog = useMemo(() => {
    if (!catalogSearch.trim()) return catalogProducts;
    const q = catalogSearch.toLowerCase();
    return catalogProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [catalogProducts, catalogSearch]);

  // Submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!customerTitle.trim()) {
      setErrorMsg("Lütfen müşteri / firma ünvanını giriniz.");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Lütfen en az bir ürün veya hizmet kalemi ekleyiniz.");
      return;
    }

    // Verify all items have names
    const emptyName = items.find((it) => !it.name.trim());
    if (emptyName) {
      setErrorMsg("Lütfen tüm kalemlerin ürün/hizmet adını doldurunuz.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        proformaNumber: proformaNumber.trim() || undefined,
        customerTitle,
        contactPerson,
        email,
        phone,
        taxOffice,
        taxNumber,
        address,
        city,
        country,
        currency,
        currencySymbol,
        exchangeRate: Number(exchangeRate) || 1.0,
        kdvRate: Number(kdvRate) || 20.0,
        kdvStatus,
        discountRate: Number(discountRate) || 0.0,
        validUntilDays: Number(validUntilDays) || 15,
        deliveryTerms,
        paymentTerms,
        bankInfo,
        notes,
        status,
        items,
      };

      const url = isEditMode
        ? `/api/admin/proforma/${initialData?.id}`
        : `/api/admin/proforma`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Proforma kaydedilemedi.");
      }

      setSuccessMsg(
        isEditMode
          ? "Proforma başarıyla güncellendi!"
          : "Proforma fatura başarıyla oluşturuldu!"
      );

      const targetId = data.proforma?.id || initialData?.id;
      setTimeout(() => {
        router.push(`/admin/proforma/${targetId}`);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Alert Banners */}
      {errorMsg && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-medium text-rose-400 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs hover:underline cursor-pointer"
          >
            Kapat
          </button>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{successMsg} Yönlendiriliyorsunuz...</span>
          </div>
        </div>
      )}

      {/* 1. ÜST BAŞLIK VE GENEL BİLGİLER */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <span className="inline-block rounded-full bg-[#c8a165]/10 px-3 py-1 text-xs font-semibold text-[#c8a165] border border-[#c8a165]/20 mb-2">
              {isEditMode ? "PROFORMA DÜZENLEME" : "YENİ KURUMSAL TEKLİF"}
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              {isEditMode ? `Proforma #${proformaNumber}` : "Proforma Fatura Hazırla"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Kurumsal müşteriler ve toptan siparişler için resmi A4 logolu proforma fatura & teklif belgesi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/proforma"
              className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              ← Vazgeç & Listeye Dön
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="gold-gradient-btn rounded-full px-6 py-2.5 text-xs md:text-sm font-extrabold text-black shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : isEditMode ? "Değişiklikleri Kaydet" : "Proformayı Oluştur →"}
            </button>
          </div>
        </div>

        {/* Belge Parametreleri Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Proforma / Teklif No
            </label>
            <input
              type="text"
              value={proformaNumber}
              onChange={(e) => setProformaNumber(e.target.value)}
              placeholder="Boş bırakılırsa oto üretilir (LMR-PF-2026-XXXX)"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Örn: LMR-PF-2026-0012 (Özelleştirilebilir)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Teklif Durumu
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProformaStatus)}
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white focus:border-[#c8a165] outline-none cursor-pointer"
            >
              <option value="TEKLIF">📄 Teklif Aşamasında (Bekliyor)</option>
              <option value="ONAYLANDI">✅ Müşteri Onayladı</option>
              <option value="ODENDI">💰 Ödeme Alındı / Kesinleşti</option>
              <option value="IPTAL">❌ İptal Edildi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Para Birimi
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["TRY", "USD", "EUR"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleCurrencyChange(curr)}
                  className={`rounded-lg py-2.5 text-xs font-bold transition border cursor-pointer ${
                    currency === curr
                      ? "bg-[#c8a165] text-black border-[#c8a165] shadow-md"
                      : "bg-[#090a0f] text-zinc-300 border-white/10 hover:border-[#c8a165]/50"
                  }`}
                >
                  {curr === "TRY" ? "₺ TL" : curr === "USD" ? "$ USD" : "€ EUR"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Geçerlilik Süresi (Gün)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={365}
                value={validUntilDays}
                onChange={(e) => setValidUntilDays(Number(e.target.value))}
                className="w-24 rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white focus:border-[#c8a165] outline-none"
              />
              <div className="flex items-center gap-1">
                {[7, 15, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setValidUntilDays(d)}
                    className={`rounded-lg px-2.5 py-2 text-[11px] font-semibold border cursor-pointer ${
                      validUntilDays === d
                        ? "bg-[#c8a165]/20 text-[#c8a165] border-[#c8a165]"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {d}g
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MÜŞTERİ & FİRMA BİLGİLERİ */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <h3 className="text-lg font-bold text-[#e5c184] mb-4 flex items-center gap-2">
          <span>🏢</span> Müşteri & Kurum Bilgileri
        </h3>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Müşteri / Kurum Resmi Ünvanı *
            </label>
            <input
              type="text"
              required
              value={customerTitle}
              onChange={(e) => setCustomerTitle(e.target.value)}
              placeholder="Örn: Rixos Premium Resort Otelcilik A.Ş. veya Ahmet Yılmaz"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-sm text-white font-semibold placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              İlgili / Yetkili Kişi
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Örn: Mehmet Bey (Satın Alma Müdürü)"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Telefon Numarası
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xx xxx xx xx"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              E-posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="satinalma@sirket.com"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Vergi Dairesi & Vergi No / T.C.
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={taxOffice}
                onChange={(e) => setTaxOffice(e.target.value)}
                placeholder="Vergi Dairesi"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
              />
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="Vergi No / TC"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Sevk & Fatura Adresi
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Mahalle, Cadde, No, İlçe"
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Şehir / Ülke
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Şehir (Örn: Antalya)"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ülke"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ÜRÜN VE HİZMET KALEMLERİ (DUAL MODE) */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#e5c184] flex items-center gap-2">
              <span>📦</span> Ürün & Hizmet Kalemleri
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Katalogdan tek tıkla ürün çekebilir veya özel ölçü/hizmet kalemleri ekleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#c8a165] px-4 py-2 text-xs font-bold text-black hover:bg-[#e5c184] shadow-md transition cursor-pointer"
            >
              <span>+ Katalogdan Ürün Seç</span>
            </button>
            <button
              type="button"
              onClick={addCustomItem}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition cursor-pointer"
            >
              <span>+ Özel Kalem Ekle</span>
            </button>
          </div>
        </div>

        {/* Table of items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="py-3 px-2 w-12 text-center">Görsel</th>
                <th className="py-3 px-3">Ürün / Hizmet Açıklaması</th>
                <th className="py-3 px-2 w-20 text-center">Miktar</th>
                <th className="py-3 px-2 w-20 text-center">Birim</th>
                <th className="py-3 px-3 w-32 text-right">Birim Fiyat ({currencySymbol})</th>
                <th className="py-3 px-2 w-20 text-center">İskonto %</th>
                <th className="py-3 px-3 w-32 text-right">Tutar ({currencySymbol})</th>
                <th className="py-3 px-2 w-20 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition">
                  {/* Görsel */}
                  <td className="py-3 px-2 text-center align-top">
                    <div className="relative h-12 w-12 rounded-lg bg-black/60 border border-white/10 overflow-hidden mx-auto flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-zinc-600 text-xs">Foto</span>
                      )}
                    </div>
                  </td>

                  {/* Kalem Adı ve Açıklama */}
                  <td className="py-3 px-3 align-top">
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      placeholder="Ürün veya Hizmet Adı"
                      className="w-full rounded-lg bg-[#090a0f] border border-white/10 px-3 py-1.5 text-xs md:text-sm text-white font-medium focus:border-[#c8a165] outline-none"
                    />
                    <textarea
                      rows={2}
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                      placeholder="Ölçü, renk, kumaş türü, teknik detay veya özel şartlar..."
                      className="w-full mt-1.5 rounded-lg bg-[#090a0f]/80 border border-white/5 px-3 py-1 text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
                    />
                    {/* Görsel URL Girişi */}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">Görsel URL:</span>
                      <input
                        type="text"
                        value={item.image || ""}
                        onChange={(e) => updateItem(item.id, { image: e.target.value })}
                        placeholder="/images/... veya https://..."
                        className="flex-1 rounded bg-[#090a0f] border border-white/5 px-2 py-0.5 text-[10px] text-zinc-400 focus:border-[#c8a165] outline-none"
                      />
                    </div>
                  </td>

                  {/* Miktar */}
                  <td className="py-3 px-2 text-center align-top">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: Number(e.target.value) })
                      }
                      className="w-16 text-center rounded-lg bg-[#090a0f] border border-white/10 px-2 py-1.5 text-xs text-white focus:border-[#c8a165] outline-none font-semibold"
                    />
                  </td>

                  {/* Birim */}
                  <td className="py-3 px-2 text-center align-top">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                      className="w-20 rounded-lg bg-[#090a0f] border border-white/10 px-1 py-1.5 text-xs text-zinc-300 focus:border-[#c8a165] outline-none cursor-pointer"
                    >
                      <option value="Adet">Adet</option>
                      <option value="Takım">Takım</option>
                      <option value="Metre">Metre</option>
                      <option value="Set">Set</option>
                      <option value="Paket">Paket</option>
                      <option value="Hizmet">Hizmet</option>
                    </select>
                  </td>

                  {/* Birim Fiyat */}
                  <td className="py-3 px-3 text-right align-top">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: Number(e.target.value) })
                      }
                      className="w-28 text-right rounded-lg bg-[#090a0f] border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-white focus:border-[#c8a165] outline-none"
                    />
                  </td>

                  {/* İskonto % */}
                  <td className="py-3 px-2 text-center align-top">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.discountRate}
                      onChange={(e) =>
                        updateItem(item.id, { discountRate: Number(e.target.value) })
                      }
                      className="w-16 text-center rounded-lg bg-[#090a0f] border border-white/10 px-2 py-1.5 text-xs text-zinc-300 focus:border-[#c8a165] outline-none"
                    />
                  </td>

                  {/* Toplam */}
                  <td className="py-3 px-3 text-right align-top">
                    <div className="font-extrabold text-sm text-[#e5c184] pt-1.5">
                      {formatCurrencyValue(item.lineTotal, currencySymbol)}
                    </div>
                  </td>

                  {/* İşlem */}
                  <td className="py-3 px-2 text-center align-top">
                    <div className="flex items-center justify-center gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => duplicateItem(item)}
                        title="Kalemi Kopyala"
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        📋
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        title="Kalemi Sil"
                        className="rounded p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. VERGİ, İSKONTO VE FİNANSAL HESAPLAMALAR & CANLI ÖZET */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sol Kolon: KDV & İskonto Ayarları */}
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#121420]/80 p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-[#e5c184] flex items-center gap-2">
            <span>⚙️</span> KDV & Finansal Koşullar
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                KDV Durumu
              </label>
              <select
                value={kdvStatus}
                onChange={(e) => setKdvStatus(e.target.value as KdvStatus)}
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white focus:border-[#c8a165] outline-none cursor-pointer"
              >
                <option value="HARIC">+ KDV Hariç (Matrah Üzerine Eklenir)</option>
                <option value="DAHIL">✓ KDV Dahil (Fiyatlara Yedirilmiş)</option>
                <option value="MUAFIYET">0 KDV Muafiyeti (İhracat / İstisna)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                KDV Oranı (%)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={kdvRate}
                  onChange={(e) => setKdvRate(Number(e.target.value))}
                  className="w-20 rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white text-center font-bold focus:border-[#c8a165] outline-none"
                />
                <div className="flex items-center gap-1">
                  {[20, 10, 1, 0].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setKdvRate(rate)}
                      className={`rounded-lg px-2.5 py-2 text-xs font-bold border cursor-pointer ${
                        kdvRate === rate
                          ? "bg-[#c8a165] text-black border-[#c8a165]"
                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/30"
                      }`}
                    >
                      %{rate}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Genel Proforma İskontosu (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={100}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                placeholder="0"
                className="w-28 rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white text-center font-bold focus:border-[#c8a165] outline-none"
              />
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15, 20].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscountRate(d)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold border cursor-pointer ${
                      discountRate === d
                        ? "bg-[#c8a165]/20 text-[#c8a165] border-[#c8a165]"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    %{d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {currency !== "TRY" && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300">
              <label className="block font-semibold mb-1">
                Döviz Kuru (1 {currency} = ? TL)
              </label>
              <input
                type="number"
                step="0.0001"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                className="w-32 rounded-lg bg-black/60 border border-amber-500/30 p-2 text-white font-bold outline-none"
              />
              <span className="ml-2 text-[11px] text-zinc-400">
                TL karşılığı:{" "}
                <strong>
                  {formatCurrencyValue(totals.grandTotal * exchangeRate, "₺")}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Sağ Kolon: Finansal Matrah & Genel Toplam Kartı */}
        <div className="lg:col-span-6 rounded-2xl border-2 border-[#c8a165]/40 bg-gradient-to-br from-[#121420] via-[#161928] to-[#0d0e15] p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#c8a165]">
                FİNANSAL HESAP ÖZETİ
              </span>
              <span className="text-xs text-zinc-400">
                {items.length} Kalem Ürün / Hizmet
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Ara Toplam (Kalemler Toplamı):</span>
                <span className="font-semibold text-white">
                  {formatCurrencyValue(totals.subtotal, currencySymbol)}
                </span>
              </div>

              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>İskonto İndirimi (%{discountRate}):</span>
                  <span className="font-semibold">
                    - {formatCurrencyValue(totals.totalDiscount, currencySymbol)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-zinc-300">
                <span>
                  KDV Tutarı ({kdvStatus === "MUAFIYET" ? "Muaf" : `%${kdvRate}`}):
                </span>
                <span className="font-semibold text-white">
                  {formatCurrencyValue(totals.totalTax, currencySymbol)}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 block">
                    GENEL TOPLAM ({currency})
                  </span>
                  <span className="text-[11px] text-[#c8a165]">
                    {kdvStatus === "HARIC"
                      ? "KDV Dahil Edilmiş Net Ödenecek"
                      : kdvStatus === "DAHIL"
                      ? "KDV Dahil Toplam"
                      : "KDV Muaf Toplam"}
                  </span>
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#e5c184] tracking-tight">
                  {formatCurrencyValue(totals.grandTotal, currencySymbol)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 bg-black/40 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              YALNIZCA (YAZIYLA LEGAL TÜRKÇE TUTAR):
            </span>
            <p className="text-xs font-semibold text-zinc-200 mt-1 italic tracking-wide">
              {wordsRepresentation}
            </p>
          </div>
        </div>
      </div>

      {/* 5. BANKA VE ŞARTLAR (AKORDİYON YA DA TABLAR) */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <h3 className="text-lg font-bold text-[#e5c184] flex items-center gap-2">
          <span>📜</span> Banka Hesapları, Teslimat & Teklif Şartları
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Banka & IBAN Bilgileri (Resmi Proforma Altında Basılır)
            </label>
            <textarea
              rows={6}
              value={bankInfo}
              onChange={(e) => setBankInfo(e.target.value)}
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white font-mono leading-relaxed placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Teslimat & Sevkiyat Şartları
            </label>
            <textarea
              rows={6}
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(e.target.value)}
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white leading-relaxed placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Ödeme Koşulları & Vade Şartları
            </label>
            <textarea
              rows={4}
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white leading-relaxed placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Özel Notlar & Garanti Koşulları
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3.5 text-xs text-white leading-relaxed placeholder:text-zinc-600 focus:border-[#c8a165] outline-none"
            />
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM SUBMIT BAR */}
      <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-white/15 bg-[#0e101a]/95 p-4 md:px-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] text-zinc-400 block">Proforma Genel Toplam</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#e5c184]">
              {formatCurrencyValue(totals.grandTotal, currencySymbol)}
            </span>
          </div>
          <span className="hidden sm:inline-block h-8 w-[1px] bg-white/10"></span>
          <span className="hidden sm:inline-block text-xs text-zinc-400">
            {items.length} Kalem • {kdvStatus === "HARIC" ? "+ KDV Hariç" : "KDV Dahil"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/proforma"
            className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-xs md:text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="gold-gradient-btn rounded-full px-8 py-3 text-xs md:text-sm font-extrabold text-black shadow-2xl hover:scale-105 transition cursor-pointer disabled:opacity-50"
          >
            {saving
              ? "Kaydediliyor..."
              : isEditMode
              ? "Değişiklikleri Kaydet"
              : "Proformayı Oluştur ve Önizle →"}
          </button>
        </div>
      </div>

      {/* KATALOGDAN ÜRÜN SEÇME MODAL */}
      {catalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-[#121420] p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>✨</span> Sitedeki Ürünlerden Kalem Ekle
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tıkladığınız ürün fotoğrafı, başlığı ve fiyatıyla proforma faturanıza otomatik aktarılır.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCatalogOpen(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Arama Input */}
            <div className="mb-4">
              <input
                type="text"
                autoFocus
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Ürün adı veya kategori ara (Örn: Hamak, Şemsiye, Şezlong...)"
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-3 text-xs md:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
              />
            </div>

            {/* Ürün Listesi Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {catalogLoading ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  Ürün kataloğu yükleniyor...
                </div>
              ) : filteredCatalog.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  Aramanıza uygun ürün bulunamadı.
                </div>
              ) : (
                filteredCatalog.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addCatalogItem(product)}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#090a0f]/60 p-3 hover:border-[#c8a165]/50 hover:bg-white/[0.04] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-black border border-white/10 overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs">
                            Foto
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#e5c184] transition">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          {product.category && (
                            <span className="rounded bg-white/5 px-2 py-0.5">
                              {product.category}
                            </span>
                          )}
                          {product.dimensions && <span>{product.dimensions}</span>}
                          {product.material && <span>• {product.material}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-extrabold text-sm text-[#e5c184]">
                        {formatCurrencyValue(product.price, "₺")}
                      </span>
                      <span className="rounded-full bg-[#c8a165] px-3 py-1 text-xs font-bold text-black group-hover:scale-105 transition">
                        + Ekle
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-white/10 pt-4 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCatalogOpen(false)}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
