import { getSessionUser } from "@/lib/actions/session";
import { getSiteSettings } from "@/lib/services/settingsService";
import AdminSettingsForm from "./AdminSettingsForm";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#090a0f] p-10 text-center text-white">
        Yetkisiz erişim. Bu sayfayı görüntülemek için Admin yetkisi gereklidir.
      </main>
    );
  }

  const initialSettings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-[#090a0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <AdminHeader
          title="Site Ayarları & Yazı Yönetimi"
          userEmail={user.email}
          subtitle="Ana sayfadaki duyuru çubuğu, telefon numarası, kargo metinleri ve karşılama yazılarını güncelleyin"
        />

        <AdminSettingsForm initialSettings={initialSettings} />
      </div>
    </main>
  );
}
