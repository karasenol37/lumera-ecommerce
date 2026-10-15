import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import ProformaEditor from "@/components/admin/ProformaEditor";
import { KdvStatus, ProformaStatus, ProformaItem } from "@/lib/proforma/types";

export const metadata = {
  title: "Proforma Fatura Düzenle | Admin Paneli",
};

export default async function EditProformaPage({
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

  let items: ProformaItem[] = [];
  try {
    items = JSON.parse(proforma.itemsJson);
  } catch {
    items = [];
  }

  const formData = {
    id: proforma.id,
    proformaNumber: proforma.proformaNumber,
    customerTitle: proforma.customerTitle,
    contactPerson: proforma.contactPerson || undefined,
    email: proforma.email || undefined,
    phone: proforma.phone || undefined,
    taxOffice: proforma.taxOffice || undefined,
    taxNumber: proforma.taxNumber || undefined,
    address: proforma.address || undefined,
    city: proforma.city || undefined,
    country: proforma.country || "Türkiye",
    currency: proforma.currency as "TRY" | "USD" | "EUR",
    currencySymbol: proforma.currencySymbol || "₺",
    exchangeRate: proforma.exchangeRate || 1.0,
    kdvRate: proforma.kdvRate || 20.0,
    kdvStatus: proforma.kdvStatus as KdvStatus,
    discountRate: proforma.discountRate || 0.0,
    validUntilDays: proforma.validUntilDays || 15,
    deliveryTerms: proforma.deliveryTerms || undefined,
    paymentTerms: proforma.paymentTerms || undefined,
    bankInfo: proforma.bankInfo || undefined,
    notes: proforma.notes || undefined,
    items,
    subtotal: proforma.subtotal,
    totalDiscount: proforma.totalDiscount,
    totalTax: proforma.totalTax,
    grandTotal: proforma.grandTotal,
    status: proforma.status as ProformaStatus,
  };

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 md:px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <AdminHeader
          title={`Proforma Düzenle: ${proforma.proformaNumber}`}
          subtitle="Teklif kalemlerini, fiyatları, iskontoları veya şartları güncelleyin."
          userEmail={user.email}
        />

        <ProformaEditor initialData={formData} isEditMode={true} />
      </div>
    </main>
  );
}
