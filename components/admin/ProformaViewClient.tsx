"use client";

import { useState } from "react";
import Link from "next/link";
import {
  amountToTurkishWords,
  formatCurrencyValue,
} from "@/lib/proforma/utils";
import { ProformaItem, ProformaStatus } from "@/lib/proforma/types";

interface ProformaViewProps {
  proforma: {
    id: number;
    proformaNumber: string;
    customerTitle: string;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
    taxOffice: string | null;
    taxNumber: string | null;
    address: string | null;
    city: string | null;
    country: string;
    currency: string;
    currencySymbol: string;
    exchangeRate: number;
    kdvRate: number;
    kdvStatus: string;
    discountRate: number;
    validUntilDays: number;
    deliveryTerms: string | null;
    paymentTerms: string | null;
    bankInfo: string | null;
    notes: string | null;
    itemsJson: string;
    subtotal: number;
    totalDiscount: number;
    totalTax: number;
    grandTotal: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  siteSettings: Record<string, string>;
}

export default function ProformaViewClient({
  proforma: initialProforma,
  siteSettings,
}: ProformaViewProps) {
  const [proforma, setProforma] = useState(initialProforma);
  const [status, setStatus] = useState<string>(initialProforma.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parse items
  let items: ProformaItem[] = [];
  try {
    items = JSON.parse(proforma.itemsJson);
  } catch {
    items = [];
  }

  // Calculate Dates
  const createdDate = new Date(proforma.createdAt);
  const createdDateStr = createdDate.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const validUntilDate = new Date(createdDate);
  validUntilDate.setDate(validUntilDate.getDate() + (proforma.validUntilDays || 15));
  const validUntilDateStr = validUntilDate.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Turkish words
  const wordsRepresentation = amountToTurkishWords(
    proforma.grandTotal,
    proforma.currency
  );

  // Handle status change
  async function handleStatusChange(newStatus: ProformaStatus) {
    setUpdatingStatus(true);
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/admin/proforma/${proforma.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...proforma,
          items,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProforma((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      alert("Durum güncellenirken hata oluştu.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  // WhatsApp share
  function getWhatsAppUrl() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const cleanPhone = (proforma.phone || "").replace(/\D/g, "");
    const viewUrl = `${origin}/admin/proforma/${proforma.id}`;
    const text = encodeURIComponent(
      `Sayın ${proforma.customerTitle},\n\nLUMERA Tasarım olarak sizin için hazırladığımız "${proforma.proformaNumber}" numaralı Proforma Fatura ve Teklifimiz ekte ve bağlantıdadır.\n\nToplam Tutar: ${formatCurrencyValue(proforma.grandTotal, proforma.currencySymbol)}\nGeçerlilik: ${validUntilDateStr} tarihine kadar geçerlidir.\n\nTeklifi incelemek ve yazdırmak için:\n${viewUrl}\n\nSaygılarımızla,\nLUMERA Dış Mekan Mobilyaları`
    );

    return cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith("90") ? cleanPhone : "90" + cleanPhone.replace(/^0/, "")}?text=${text}`
      : `https://wa.me/?text=${text}`;
  }

  // Copy URL
  function handleCopyUrl() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Print
  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  const companyAddress =
    siteSettings.companyFullAddress ||
    "Organize Sanayi Bölgesi, Marangozlar & Metal Sanayi Sitesi No: 14, Tosya / Kastamonu";
  const companyPhone = siteSettings.contactPhone || "0535 874 69 09";
  const companyEmail = siteSettings.contactEmail || "lumeratasarim@gmail.com";

  return (
    <div>
      {/* 1. TOP ACTION TOOLBAR (HIDDEN ON PRINT) */}
      <div className="no-print mb-8 rounded-2xl border border-white/10 bg-[#121420]/90 p-4 md:p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/proforma"
            className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            ← Listeye Dön
          </Link>
          <div className="h-6 w-[1px] bg-white/10"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {proforma.proformaNumber}
              </span>
              <span className="text-xs text-zinc-400">• {proforma.customerTitle}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Changer */}
          <div className="flex items-center gap-1.5 bg-black/40 rounded-xl px-3 py-1.5 border border-white/10">
            <span className="text-[11px] text-zinc-400">Durum:</span>
            <select
              value={status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as ProformaStatus)}
              className="bg-transparent text-xs font-bold text-[#c8a165] outline-none cursor-pointer"
            >
              <option value="TEKLIF" className="bg-[#121420] text-amber-400">
                📄 Teklif Aşamasında
              </option>
              <option value="ONAYLANDI" className="bg-[#121420] text-emerald-400">
                ✅ Müşteri Onayladı
              </option>
              <option value="ODENDI" className="bg-[#121420] text-cyan-400">
                💰 Ödeme Alındı
              </option>
              <option value="IPTAL" className="bg-[#121420] text-rose-400">
                ❌ İptal Edildi
              </option>
            </select>
          </div>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyUrl}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition cursor-pointer"
          >
            {copied ? "✓ Kopyalandı" : "📋 Linki Kopyala"}
          </button>

          {/* WhatsApp Share */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
          >
            <span>💬</span>
            <span>WhatsApp ile Gönder</span>
          </a>

          {/* Edit */}
          <Link
            href={`/admin/proforma/${proforma.id}/edit`}
            className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition flex items-center gap-1"
          >
            <span>✏️</span>
            <span>Düzenle</span>
          </Link>

          {/* PRINT / PDF BUTTON */}
          <button
            type="button"
            onClick={handlePrint}
            className="gold-gradient-btn rounded-xl px-5 py-2 text-xs md:text-sm font-extrabold text-black shadow-xl hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>🖨️</span>
            <span>PDF İndir / Yazdır</span>
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL A4 PRINTABLE DOCUMENT CONTAINER */}
      <div className="print-sheet mx-auto max-w-[850px] bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 print:border-0 print:shadow-none print:rounded-none">
        <div className="p-8 md:p-12 print:p-0">
          {/* A4 HEADER */}
          <div className="border-b-2 border-zinc-900 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Sol: Logo & Firma Bilgileri */}
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-serif font-black tracking-widest text-[#936c2a] uppercase">
                    LUMERA
                  </span>
                  <div className="h-7 w-[2px] bg-zinc-300"></div>
                  <div>
                    <span className="block text-[11px] font-extrabold tracking-wider text-zinc-900 uppercase">
                      OUTDOOR LUXURY
                    </span>
                    <span className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-widest">
                      Dış Mekan Mobilyaları
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-zinc-600 leading-relaxed font-sans max-w-sm">
                  <p className="font-semibold text-zinc-800">
                    LUMERA TASARIM VE DIŞ MEKAN MOBİLYALARI SAN. TİC. LTD. ŞTİ.
                  </p>
                  <p className="mt-0.5">{companyAddress}</p>
                  <p className="mt-0.5">
                    <strong>Tel:</strong> {companyPhone} • <strong>E-Posta:</strong> {companyEmail}
                  </p>
                  <p className="mt-0.5">
                    <strong>Web:</strong> www.lumeratasarim.com • <strong>Vergi D.:</strong> Tosya V.D.
                  </p>
                </div>
              </div>

              {/* Sağ: Proforma Başlık & Belge No */}
              <div className="text-left sm:text-right">
                <div className="inline-block bg-zinc-900 text-white px-4 py-1.5 text-xs md:text-sm font-extrabold uppercase tracking-widest rounded print:bg-zinc-900 print:text-white">
                  PROFORMA FATURA & TEKLİF
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex sm:justify-end gap-2">
                    <span className="text-zinc-500 font-medium">Proforma No:</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {proforma.proformaNumber}
                    </span>
                  </div>

                  <div className="flex sm:justify-end gap-2">
                    <span className="text-zinc-500 font-medium">Düzenleme Tarihi:</span>
                    <span className="font-semibold text-zinc-900">{createdDateStr}</span>
                  </div>

                  <div className="flex sm:justify-end gap-2">
                    <span className="text-zinc-500 font-medium">Son Geçerlilik:</span>
                    <span className="font-bold text-amber-700">
                      {validUntilDateStr} ({proforma.validUntilDays} Gün)
                    </span>
                  </div>

                  <div className="flex sm:justify-end gap-2">
                    <span className="text-zinc-500 font-medium">Para Birimi:</span>
                    <span className="font-bold text-zinc-900 uppercase">
                      {proforma.currency} ({proforma.currencySymbol})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MÜŞTERİ / FİRMA BİLGİLERİ KUTUSU */}
          <div className="rounded-lg border border-zinc-300 bg-zinc-50/70 p-4 mb-6">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#936c2a] border-b border-zinc-200 pb-1 mb-2">
              SAYIN / MÜŞTERİ BİLGİLERİ
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">
                  {proforma.customerTitle}
                </div>
                {proforma.contactPerson && (
                  <div className="text-zinc-700 mt-0.5">
                    <span className="text-zinc-500">İlgili Kişi:</span> {proforma.contactPerson}
                  </div>
                )}
                {proforma.address && (
                  <div className="text-zinc-600 mt-1 leading-snug">
                    <span className="text-zinc-500">Adres:</span> {proforma.address}
                  </div>
                )}
                {proforma.city && (
                  <div className="text-zinc-600 mt-0.5">
                    {proforma.city} / {proforma.country}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {(proforma.taxOffice || proforma.taxNumber) && (
                  <div className="text-zinc-700">
                    <span className="text-zinc-500 font-medium">Vergi Dairesi & No:</span>{" "}
                    <strong>{proforma.taxOffice || "-"}</strong> / <strong>{proforma.taxNumber || "-"}</strong>
                  </div>
                )}
                {proforma.phone && (
                  <div className="text-zinc-700">
                    <span className="text-zinc-500 font-medium">Telefon:</span> {proforma.phone}
                  </div>
                )}
                {proforma.email && (
                  <div className="text-zinc-700">
                    <span className="text-zinc-500 font-medium">E-posta:</span> {proforma.email}
                  </div>
                )}
                <div className="text-zinc-700">
                  <span className="text-zinc-500 font-medium">KDV Statüsü:</span>{" "}
                  <strong>
                    {proforma.kdvStatus === "HARIC"
                      ? "KDV Hariç Fiyatlandırma"
                      : proforma.kdvStatus === "DAHIL"
                      ? "KDV Dahil Fiyatlandırma"
                      : "KDV'den Muaf / İstisna"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* KALEMLER TABLOSU */}
          <div className="mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white font-bold uppercase text-[10px] tracking-wider print:bg-zinc-900 print:text-white">
                  <th className="py-2.5 px-2 text-center w-8">#</th>
                  <th className="py-2.5 px-2 text-center w-12 print:hidden">Görsel</th>
                  <th className="py-2.5 px-3">Ürün / Hizmet Açıklaması</th>
                  <th className="py-2.5 px-2 text-center w-16">Miktar</th>
                  <th className="py-2.5 px-2 text-center w-16">Birim</th>
                  <th className="py-2.5 px-3 text-right w-24">Birim Fiyat</th>
                  {proforma.totalDiscount > 0 && (
                    <th className="py-2.5 px-2 text-center w-14">İsk.%</th>
                  )}
                  <th className="py-2.5 px-3 text-right w-28">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item, idx) => (
                  <tr key={item.id} className="align-top">
                    <td className="py-3 px-2 text-center font-bold text-zinc-500">
                      {idx + 1}
                    </td>

                    {/* Görsel (Baskıda küçük veya isteğe bağlı) */}
                    <td className="py-2 px-2 text-center print:hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 object-cover rounded border border-zinc-200 mx-auto"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center text-[9px] text-zinc-400 mx-auto">
                          -
                        </div>
                      )}
                    </td>

                    {/* Açıklama */}
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-zinc-900 text-[12px]">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                          {item.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-2 text-center font-bold text-zinc-800">
                      {item.quantity}
                    </td>

                    <td className="py-3 px-2 text-center text-zinc-600">
                      {item.unit}
                    </td>

                    <td className="py-3 px-3 text-right font-medium text-zinc-800">
                      {formatCurrencyValue(item.unitPrice, proforma.currencySymbol)}
                    </td>

                    {proforma.totalDiscount > 0 && (
                      <td className="py-3 px-2 text-center text-emerald-700 font-semibold">
                        {item.discountRate > 0 ? `%${item.discountRate}` : "-"}
                      </td>
                    )}

                    <td className="py-3 px-3 text-right font-bold text-zinc-900">
                      {formatCurrencyValue(item.lineTotal, proforma.currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FİNANSAL TOPLAMLAR & YAZI İLE ALANI */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 pt-2 border-t-2 border-zinc-200">
            {/* Sol: Yalnızca Yazı ile Tutar & Banka Özeti */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 mb-3">
                <span className="text-[9px] font-black uppercase text-zinc-500 block">
                  YALNIZCA (YAZIYLA):
                </span>
                <p className="text-xs font-bold text-zinc-900 mt-0.5 tracking-wide">
                  {wordsRepresentation}
                </p>
              </div>

              {/* Banka Hesapları Kutusu */}
              {proforma.bankInfo && (
                <div className="rounded-lg border border-zinc-200 p-3 bg-white">
                  <span className="text-[10px] font-bold text-[#936c2a] uppercase block mb-1">
                    ÖDEME / HAVALE BİLGİLERİ
                  </span>
                  <pre className="text-[10px] font-mono text-zinc-700 whitespace-pre-wrap leading-tight">
                    {proforma.bankInfo}
                  </pre>
                </div>
              )}
            </div>

            {/* Sağ: Rakamlar ve Toplam Tablosu */}
            <div className="md:col-span-5">
              <div className="space-y-1.5 text-xs text-zinc-700 bg-zinc-50/50 p-4 rounded-lg border border-zinc-200">
                <div className="flex justify-between">
                  <span>Ara Toplam:</span>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrencyValue(proforma.subtotal, proforma.currencySymbol)}
                  </span>
                </div>

                {proforma.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>İskonto İndirimi:</span>
                    <span>
                      - {formatCurrencyValue(proforma.totalDiscount, proforma.currencySymbol)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    KDV Matrahı:
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrencyValue(
                      proforma.subtotal - proforma.totalDiscount,
                      proforma.currencySymbol
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    KDV Tutarı ({proforma.kdvStatus === "MUAFIYET" ? "Muaf" : `%${proforma.kdvRate}`}):
                  </span>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrencyValue(proforma.totalTax, proforma.currencySymbol)}
                  </span>
                </div>

                <div className="border-t-2 border-zinc-900 pt-2.5 mt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-black uppercase text-zinc-900 block">
                      GENEL TOPLAM
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      ({proforma.kdvStatus === "HARIC" ? "KDV Dahil Net Ödenecek" : "Ödenecek Toplam"})
                    </span>
                  </div>
                  <div className="text-xl font-black text-zinc-900">
                    {formatCurrencyValue(proforma.grandTotal, proforma.currencySymbol)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ŞARTLAR & TEKLİF NOTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-zinc-600 border-t border-zinc-200 pt-4 mb-8">
            {proforma.deliveryTerms && (
              <div>
                <span className="font-bold text-zinc-900 uppercase block mb-0.5">
                  1. Teslimat & Sevkiyat Şartları:
                </span>
                <p className="leading-relaxed">{proforma.deliveryTerms}</p>
              </div>
            )}

            {proforma.paymentTerms && (
              <div>
                <span className="font-bold text-zinc-900 uppercase block mb-0.5">
                  2. Ödeme & Vade Koşulları:
                </span>
                <p className="leading-relaxed">{proforma.paymentTerms}</p>
              </div>
            )}

            {proforma.notes && (
              <div className="md:col-span-2 mt-1">
                <span className="font-bold text-zinc-900 uppercase block mb-0.5">
                  3. Teklif Hükümleri & Notlar:
                </span>
                <pre className="text-[10px] font-sans text-zinc-600 whitespace-pre-wrap leading-relaxed">
                  {proforma.notes}
                </pre>
              </div>
            )}
          </div>

          {/* DUAL KAŞE & İMZA ALANI (LEGAL) */}
          <div className="border-t-2 border-zinc-900 pt-4">
            <div className="grid grid-cols-2 gap-8 text-center">
              {/* Sol: Müşteri Onayı */}
              <div className="border border-dashed border-zinc-300 rounded-lg p-4 flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-xs font-bold text-zinc-900 uppercase block">
                    MÜŞTERİ ONAYI & KABUL
                  </span>
                  <p className="text-[9px] text-zinc-500 mt-1">
                    Yukarıdaki teklif koşullarını ve ürün bedelini kabul ediyorum.
                  </p>
                </div>
                <div className="mt-8 border-t border-zinc-300 pt-2">
                  <span className="text-[10px] text-zinc-400 block">
                    Yetkili İmza / Firma Kaşesi & Tarih
                  </span>
                </div>
              </div>

              {/* Sağ: Lumera Onayı */}
              <div className="border border-zinc-300 rounded-lg p-4 bg-zinc-50/50 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                <div>
                  <span className="text-xs font-bold text-zinc-900 uppercase block">
                    LUMERA TASARIM VE DIŞ MEKAN MOBİLYALARI
                  </span>
                  <p className="text-[9px] text-zinc-500 mt-1">
                    Şirket Kaşesi & Yetkili İmzası
                  </p>
                </div>

                {/* Decorative Official Stamp Graphic */}
                <div className="my-2 flex justify-center">
                  <div className="rounded-full border-2 border-dashed border-[#936c2a] px-4 py-1 text-[10px] font-black tracking-widest text-[#936c2a] uppercase transform -rotate-3 opacity-80">
                    ★ LUMERA ONAYLANMIŞTIR ★
                  </div>
                </div>

                <div className="border-t border-zinc-300 pt-2">
                  <span className="text-[10px] text-zinc-500 font-semibold block">
                    Genel Müdürlük / Satış Direktörlüğü
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-[9px] text-zinc-400 print:mt-4">
              Bu belge 213 sayılı V.U.K. hükümlerine göre tanzim edilmiş resmi proforma fatura & teklif niteliğindedir.
            </div>
          </div>
        </div>
      </div>

      {/* PRINT CSS STYLES INJECTED */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav,
          header,
          footer,
          .no-print {
            display: none !important;
          }
          .print-sheet {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
