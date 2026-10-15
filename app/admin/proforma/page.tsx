import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import ProformaListClient from "@/components/admin/ProformaListClient";
import { formatCurrencyValue } from "@/lib/proforma/utils";

export const metadata = {
  title: "Proforma Fatura & Teklif Yönetimi | Admin Paneli",
};

export default async function AdminProformaPage() {
  const user = await requireAdmin();

  // Fetch all proformas
  const proformas = await prisma.proformaInvoice.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Calculate quick stats
  const totalCount = proformas.length;
  const approvedCount = proformas.filter((p) => p.status === "ONAYLANDI" || p.status === "ODENDI").length;
  const pendingCount = proformas.filter((p) => p.status === "TEKLIF").length;
  const totalVolumeTRY = proformas.reduce((acc, p) => {
    // If currency is not TRY, convert using its exchangeRate
    const mult = p.currency === "TRY" ? 1 : p.exchangeRate || 1;
    return acc + p.grandTotal * mult;
  }, 0);

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 md:px-8 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Proforma Fatura & Teklif Yönetimi"
          subtitle="Kurumsal müşteriler, toptan alıcılar ve mimari projeler için resmi teklif ve proforma fatura oluşturun."
          userEmail={user.email}
        />

        {/* Quick KPI Stats & Action Bar */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#121420]/80 p-5 backdrop-blur-md">
            <span className="text-xs text-zinc-400 font-medium">Toplam Teklif Belgesi</span>
            <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white">
              {totalCount} <span className="text-sm font-normal text-zinc-500">adet</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-md">
            <span className="text-xs text-emerald-400 font-medium">Onaylanan & Kesinleşen</span>
            <div className="mt-2 text-2xl md:text-3xl font-extrabold text-emerald-300">
              {approvedCount} <span className="text-sm font-normal text-emerald-500/70">adet</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-md">
            <span className="text-xs text-amber-400 font-medium">Bekleyen Teklifler</span>
            <div className="mt-2 text-2xl md:text-3xl font-extrabold text-amber-300">
              {pendingCount} <span className="text-sm font-normal text-amber-500/70">adet</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#c8a165]/30 bg-gradient-to-br from-[#121420] to-[#1c1913] p-5 backdrop-blur-md flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#c8a165] font-semibold">Toplam Teklif Hacmi</span>
              <div className="mt-1 text-xl md:text-2xl font-extrabold text-[#e5c184]">
                {formatCurrencyValue(totalVolumeTRY, "₺")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Hazırlanan Proformalar</h2>
            <p className="text-xs text-zinc-400">
              Belgeleri yazdırabilir, A4 PDF olarak indirebilir veya müşteriye WhatsApp üzerinden doğrudan iletebilirsiniz.
            </p>
          </div>

          <Link
            href="/admin/proforma/new"
            className="gold-gradient-btn inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs md:text-sm font-extrabold text-black shadow-xl hover:scale-105 transition cursor-pointer"
          >
            <span>+ Yeni Proforma Fatura Hazırla</span>
          </Link>
        </div>

        {/* Interactive List Table */}
        <ProformaListClient
          initialProformas={proformas.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
