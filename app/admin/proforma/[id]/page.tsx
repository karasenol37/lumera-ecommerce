import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import ProformaViewClient from "@/components/admin/ProformaViewClient";
import { getSiteSettings } from "@/lib/services/settingsService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proforma = await prisma.proformaInvoice.findUnique({
    where: { id: parseInt(id, 10) || 0 },
    select: { proformaNumber: true, customerTitle: true },
  });

  return {
    title: proforma
      ? `Proforma: ${proforma.proformaNumber} - ${proforma.customerTitle}`
      : "Proforma Fatura Görüntüle",
  };
}

export default async function ViewProformaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdmin();
  const { id } = await params;
  const proformaId = parseInt(id, 10);

  if (isNaN(proformaId)) {
    notFound();
  }

  const proforma = await prisma.proformaInvoice.findUnique({
    where: { id: proformaId },
  });

  if (!proforma) {
    notFound();
  }

  const siteSettings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 md:px-8 py-10 text-white print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl">
        <div className="no-print">
          <AdminHeader
            title={`Proforma Belgesi: ${proforma.proformaNumber}`}
            subtitle="Resmi kurumsal teklif belgesini yazdırabilir, PDF olarak kaydedebilir veya WhatsApp ile müşterinize iletebilirsiniz."
            userEmail={user.email}
          />
        </div>

        <ProformaViewClient
          proforma={{
            ...proforma,
            createdAt: proforma.createdAt.toISOString(),
            updatedAt: proforma.updatedAt.toISOString(),
          }}
          siteSettings={siteSettings}
        />
      </div>
    </main>
  );
}
