"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrencyValue } from "@/lib/proforma/utils";

interface ProformaSummary {
  id: number;
  proformaNumber: string;
  customerTitle: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  currency: string;
  currencySymbol: string;
  grandTotal: number;
  status: string;
  validUntilDays: number;
  createdAt: string | Date;
  itemsJson: string;
}

export default function ProformaListClient({
  initialProformas,
}: {
  initialProformas: ProformaSummary[];
}) {
  const [proformas, setProformas] = useState<ProformaSummary[]>(initialProformas);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Status helper
  function getStatusBadge(status: string) {
    switch (status) {
      case "ONAYLANDI":
        return {
          label: "Onaylandı",
          classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
      case "ODENDI":
        return {
          label: "Ödeme Alındı",
          classes: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        };
      case "IPTAL":
        return {
          label: "İptal Edildi",
          classes: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        };
      default:
        return {
          label: "Teklif / Bekliyor",
          classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        };
    }
  }

  // Filter proformas
  const filtered = useMemo(() => {
    return proformas.filter((p) => {
      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      if (!matchesStatus) return false;

      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        p.proformaNumber.toLowerCase().includes(q) ||
        p.customerTitle.toLowerCase().includes(q) ||
        (p.contactPerson && p.contactPerson.toLowerCase().includes(q)) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q))
      );
    });
  }, [proformas, searchTerm, statusFilter]);

  // Delete proforma
  async function handleDelete(id: number, number: string) {
    if (!confirm(`"${number}" numaralı proforma faturayı silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/proforma/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProformas((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      alert("Sunucu ile bağlantı hatası.");
    } finally {
      setDeletingId(null);
    }
  }

  // Quick WhatsApp share link
  function generateWhatsAppLink(p: ProformaSummary) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const cleanPhone = (p.phone || "").replace(/\D/g, "");
    const viewUrl = `${origin}/admin/proforma/${p.id}`;
    const text = encodeURIComponent(
      `Sayın ${p.customerTitle},\n\nLUMERA Tasarım olarak talep ettiğiniz ürünler için hazırlanan "${p.proformaNumber}" numaralı Proforma Faturanız ve Teklifiniz hazırlanmıştır.\n\nToplam Tutar: ${formatCurrencyValue(p.grandTotal, p.currencySymbol)}\nGeçerlilik Süresi: ${p.validUntilDays} Gün\n\nTeklifi incelemek ve detayları görüntülemek için:\n${viewUrl}\n\nİyi çalışmalar dileriz.\nLUMERA OUTDOOR`
    );

    return cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith("90") ? cleanPhone : "90" + cleanPhone.replace(/^0/, "")}?text=${text}`
      : `https://wa.me/?text=${text}`;
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-white/10 bg-[#121420]/80 p-5 backdrop-blur-md">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { key: "ALL", label: `Tümü (${proformas.length})` },
            {
              key: "TEKLIF",
              label: `Teklif (${proformas.filter((p) => p.status === "TEKLIF").length})`,
            },
            {
              key: "ONAYLANDI",
              label: `Onaylanan (${proformas.filter((p) => p.status === "ONAYLANDI").length})`,
            },
            {
              key: "ODENDI",
              label: `Ödenen (${proformas.filter((p) => p.status === "ODENDI").length})`,
            },
            {
              key: "IPTAL",
              label: `İptal (${proformas.filter((p) => p.status === "IPTAL").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-lg px-3 py-2 font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-[#c8a165] text-black shadow-md"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Proforma no, müşteri veya tel ara..."
            className="w-full rounded-xl bg-[#090a0f] border border-white/10 px-4 py-2 text-xs md:text-sm text-white placeholder:text-zinc-500 focus:border-[#c8a165] outline-none"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-white/10 bg-[#121420]/80 backdrop-blur-md shadow-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl block mb-3">📑</span>
            <h3 className="text-lg font-bold text-white">Proforma Bulunamadı</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "ALL"
                ? "Filtre kriterlerinize uygun kayıt bulunamadı."
                : "Henüz hazırlanmış bir proforma fatura bulunmuyor. Yeni bir teklif hazırlayarak başlayabilirsiniz."}
            </p>
            <div className="mt-6">
              <Link
                href="/admin/proforma/new"
                className="gold-gradient-btn inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-black shadow-lg hover:scale-105 transition"
              >
                <span>+ İlk Proformayı Oluştur</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090a0f]/60 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-4 font-bold">Proforma No</th>
                  <th className="py-4 px-4 font-bold">Müşteri / Kurum</th>
                  <th className="py-4 px-4 font-bold">Tarih & Vade</th>
                  <th className="py-4 px-4 font-bold text-right">Toplam Tutar</th>
                  <th className="py-4 px-4 font-bold text-center">Durum</th>
                  <th className="py-4 px-4 font-bold text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => {
                  const statusInfo = getStatusBadge(p.status);
                  const dateStr = new Date(p.createdAt).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  let itemCount = 0;
                  try {
                    const parsed = JSON.parse(p.itemsJson);
                    itemCount = Array.isArray(parsed) ? parsed.length : 0;
                  } catch {
                    itemCount = 1;
                  }

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition group"
                    >
                      {/* Proforma No */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/proforma/${p.id}`}
                          className="font-mono font-bold text-white group-hover:text-[#e5c184] transition flex items-center gap-1.5"
                        >
                          <span>📄</span>
                          <span>{p.proformaNumber}</span>
                        </Link>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">
                          {itemCount} Kalem Ürün
                        </span>
                      </td>

                      {/* Müşteri / Kurum */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white text-sm">
                          {p.customerTitle}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          {p.contactPerson && <span>{p.contactPerson}</span>}
                          {p.phone && <span>• {p.phone}</span>}
                          {p.city && <span>• {p.city}</span>}
                        </div>
                      </td>

                      {/* Tarih & Vade */}
                      <td className="py-4 px-4">
                        <div className="text-zinc-300 font-medium">{dateStr}</div>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">
                          Geçerlilik: {p.validUntilDays} gün
                        </span>
                      </td>

                      {/* Toplam Tutar */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-extrabold text-base text-[#e5c184]">
                          {formatCurrencyValue(p.grandTotal, p.currencySymbol)}
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-0.5 uppercase">
                          {p.currency}
                        </span>
                      </td>

                      {/* Durum */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block rounded-full border px-3 py-1 text-[11px] font-bold ${statusInfo.classes}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* İşlemler */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* A4 Görüntüle & Yazdır */}
                          <Link
                            href={`/admin/proforma/${p.id}`}
                            title="Resmi A4 Proforma & PDF Yazdır"
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-[#c8a165] hover:text-[#c8a165] hover:bg-[#c8a165]/10 transition flex items-center gap-1 font-medium"
                          >
                            <span>🖨️</span>
                            <span className="hidden sm:inline">Görüntüle / PDF</span>
                          </Link>

                          {/* WhatsApp Paylaş */}
                          <a
                            href={generateWhatsAppLink(p)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp ile Teklif İlet"
                            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1 font-medium"
                          >
                            <span>💬</span>
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>

                          {/* Düzenle */}
                          <Link
                            href={`/admin/proforma/${p.id}/edit`}
                            title="Teklifi Düzenle"
                            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                          >
                            ✏️
                          </Link>

                          {/* Sil */}
                          <button
                            type="button"
                            disabled={deletingId === p.id}
                            onClick={() => handleDelete(p.id, p.proformaNumber)}
                            title="Teklifi Sil"
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer disabled:opacity-50"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
