import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import UserActions from "@/components/admin/UserActions";
import AdminHeader from "@/components/admin/AdminHeader";

type AdminUser = {
  id: number;
  name: string | null;
  email: string;
  role: string | null;
  createdAt: Date;
};

export default async function AdminUsersPage() {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Kullanıcıların il/ilçe kayıtlarını çek
  const locationSettings = await prisma.siteSetting
    .findMany({
      where: {
        key: { startsWith: "user_location_" },
      },
    })
    .catch(() => []);

  const locationMap: Record<number, { city?: string; district?: string }> = {};
  for (const s of locationSettings) {
    const uid = Number(s.key.replace("user_location_", ""));
    if (!isNaN(uid)) {
      try {
        locationMap[uid] = JSON.parse(s.value);
      } catch {
        // ignore
      }
    }
  }

  const typedUsers = users as AdminUser[];

  return (
    <main className="min-h-screen bg-[#151921] p-6 md:p-10 text-white">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Kullanıcı Yönetimi"
          userEmail={user.email}
          subtitle="Kayıtlı kullanıcıları, il/ilçe tercihlerini listeleyin ve hesap yetkilerini yönetin"
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1d222c]">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-zinc-300 text-sm">
              <tr>
                <th className="p-5">Ad Soyad</th>
                <th className="p-5">E-posta</th>
                <th className="p-5">İl / İlçe</th>
                <th className="p-5">Rol</th>
                <th className="p-5">Kayıt Tarihi</th>
                <th className="p-5">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {typedUsers.map((item: AdminUser) => {
                const loc = locationMap[item.id];
                const locText =
                  loc?.city && loc?.district
                    ? `${loc.city} / ${loc.district}`
                    : loc?.city || "-";
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-5 font-semibold">{item.name ?? "-"}</td>
                    <td className="p-5 text-zinc-300">{item.email}</td>
                    <td className="p-5 text-zinc-300 text-sm">{locText}</td>
                    <td className="p-5">
                      <span className="rounded-full bg-[#c8a165] px-4 py-1.5 text-xs font-bold text-black">
                        {item.role ?? "USER"}
                      </span>
                    </td>
                    <td className="p-5 text-zinc-400 text-sm">
                      {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-5">
                      <UserActions id={item.id} role={item.role ?? "USER"} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
