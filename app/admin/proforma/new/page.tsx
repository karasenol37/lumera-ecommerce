import { requireAdmin } from "@/lib/auth/admin";
import AdminHeader from "@/components/admin/AdminHeader";
import ProformaEditor from "@/components/admin/ProformaEditor";

export const metadata = {
  title: "Yeni Proforma Fatura Hazırla | Admin Paneli",
};

export default async function NewProformaPage() {
  const user = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 md:px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <AdminHeader
          title="Proforma Fatura & Teklif Hazırla"
          subtitle="Kurumsal teklifinizi hazırlayın, ürünleri ekleyin ve anında yazdırılabilir resmi A4 belgeye dönüştürün."
          userEmail={user.email}
        />

        <ProformaEditor isEditMode={false} />
      </div>
    </main>
  );
}
