import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import AdminHeader from "@/components/admin/AdminHeader";

type LatestOrder = {
  id: number;
  status: string;
  total: number;
  createdAt: Date;
  fullName?: string;
  email?: string;
};

function statusStyle(status: string) {
  switch (status) {
    case "Bekliyor":
      return "text-yellow-400";
    case "Hazırlanıyor":
      return "text-blue-400";
    case "Kargoda":
      return "text-purple-400";
    case "Teslim Edildi":
      return "text-green-400";
    case "İptal":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#151921] p-10 text-center text-white">
        Yetkisiz erişim
      </main>
    );
  }

  const totalSales = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  const orderCount = await prisma.order.count();
  const userCount = await prisma.user.count();

  const pendingOrders = await prisma.order.count({
    where: {
      status: "Bekliyor",
    },
  });

  const contactModel = (prisma as any).contactMessage;
  let unreadMessageCount = 0;
  if (contactModel) {
    unreadMessageCount = await contactModel.count({
      where: { isRead: false },
    });
  }

  let reviewCount = 0;
  try {
    reviewCount = await prisma.review.count();
  } catch {
    // ignore
  }

  // Ziyaretçi Analitiği
  let totalVisits = 0;
  let todayVisits = 0;
  let uniqueVisitors = 0;
  try {
    totalVisits = await prisma.siteVisit.count();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    todayVisits = await prisma.siteVisit.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    const uniqueRaw = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(DISTINCT ip)::int as count FROM "SiteVisit" WHERE ip IS NOT NULL`
    );
    uniqueVisitors = uniqueRaw[0]?.count ?? totalVisits;
  } catch (err) {
    console.error("Error fetching visitor stats:", err);
  }

  let proformaCount = 0;
  try {
    proformaCount = await prisma.proformaInvoice.count();
  } catch (err) {
    console.error("Error fetching proforma count:", err);
  }

  const latestOrders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      fullName: true,
      total: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#151921] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Admin Paneli"
          userEmail={user.email}
          subtitle="Sistem genel bakışı, ürün, sipariş, teklif, yorum ve site ayarları yönetimi"
        />

        {/* Yönetim Menüleri */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
            <p className="mt-2 text-zinc-400">
              Ürünleri ekle, düzenle ve yönet.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/products"
                className="rounded-full border border-[#c8a165] px-5 py-3 text-[#c8a165]"
              >
                Ürünler
              </Link>
              <Link
                href="/admin/products/new"
                className="rounded-full bg-[#c8a165] px-5 py-3 font-bold text-black"
              >
                + Ürün Ekle
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <h2 className="text-2xl font-bold">Sipariş Yönetimi</h2>
            <p className="mt-2 text-zinc-400">
              Siparişleri görüntüle ve durum güncelle.
            </p>
            <Link
              href="/admin/orders"
              className="mt-6 inline-block rounded-full bg-[#c8a165] px-6 py-3 font-bold text-black"
            >
              Siparişler
            </Link>
          </div>

          {/* Proforma & Toptan Teklif Kartı */}
          <div className="relative rounded-2xl border border-[#c8a165]/40 bg-gradient-to-br from-[#1d222c] to-[#171b23] p-8 shadow-xl flex flex-col justify-between">
            <div>
              <span className="absolute top-4 right-4 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/30 px-3 py-1 text-xs font-bold text-[#e5c184]">
                {proformaCount} Kayıt
              </span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📑 Proforma & Toptan Teklif</span>
              </h2>
              <p className="mt-2 text-zinc-400 text-sm">
                Siteden gelen proje/toptan fiyat teklif taleplerini görüntüle, logolu A4 PDF hazırla ve WhatsApp ile gönder.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/admin/proforma"
                className="rounded-full border border-[#c8a165] px-5 py-2.5 text-xs font-bold text-[#c8a165] hover:bg-[#c8a165] hover:text-black transition"
              >
                Teklifleri Gör
              </Link>
              <Link
                href="/admin/proforma/new"
                className="rounded-full bg-[#c8a165] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#e5c184] transition"
              >
                + Yeni Teklif
              </Link>
            </div>
          </div>

          {/* Ürün Yorumları Yönetimi Kartı */}
          <div className="relative rounded-2xl border border-[#c8a165]/40 bg-gradient-to-br from-[#1d222c] to-[#171b23] p-8 shadow-xl flex flex-col justify-between">
            <div>
              <span className="absolute top-4 right-4 rounded-full bg-[#c8a165]/15 border border-[#c8a165]/30 px-3 py-1 text-xs font-bold text-[#e5c184]">
                {reviewCount} Yorum
              </span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⭐ Ürün Yorumları</span>
              </h2>
              <p className="mt-2 text-zinc-400 text-sm">
                Ürünlere yeni müşteri yorumları ekleyin veya mevcut yorumları silin.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/admin/reviews"
                className="inline-block rounded-full bg-[#c8a165] px-6 py-3 font-bold text-black hover:bg-[#e5c184] transition"
              >
                Yorumları Yönet →
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-[#1d222c] p-8">
            {unreadMessageCount > 0 && (
              <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1 text-xs font-extrabold text-black shadow-lg animate-pulse">
                {unreadMessageCount} Okunmamış
              </span>
            )}
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>Gelen Mesajlar & Bildirimler</span>
            </h2>
            <p className="mt-2 text-zinc-400 text-sm">
              İletişim mesajları, sipariş ve toptan teklif bildirimleri (lumeratasarim@gmail.com).
            </p>
            <Link
              href="/admin/messages"
              className="mt-6 inline-block rounded-full border border-[#c8a165] px-6 py-3 font-bold text-[#c8a165] hover:bg-[#c8a165] hover:text-black transition"
            >
              Mesajları Gör →
            </Link>
          </div>

          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <h2 className="text-2xl font-bold">Kullanıcı Yönetimi</h2>
            <p className="mt-2 text-zinc-400">
              Kullanıcıları ve il/ilçe bilgilerini görüntüle, yönet.
            </p>
            <Link
              href="/admin/users"
              className="mt-6 inline-block rounded-full bg-[#c8a165] px-6 py-3 font-bold text-black"
            >
              Kullanıcılar
            </Link>
          </div>

          <div className="rounded-2xl border border-[#c8a165]/30 bg-[#1d222c] p-8">
            <h2 className="text-2xl font-bold text-[#c8a165]">
              Site Ayarları & Yazılar
            </h2>
            <p className="mt-2 text-zinc-400">
              Duyuru metni, telefon ve ana sayfa yazılarını düzenle.
            </p>
            <Link
              href="/admin/settings"
              className="mt-6 inline-block rounded-full bg-[#c8a165] px-6 py-3 font-bold text-black"
            >
              Ayarları Yönet →
            </Link>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#c8a165]/40 bg-gradient-to-br from-[#1d222c] to-[#171b23] p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-zinc-300 text-sm font-semibold">
                Site Ziyaretçileri
              </p>
              <span className="text-2xl">👁️</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-[#e5c184]">
              {totalVisits.toLocaleString("tr-TR")}
            </h2>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
              <span>
                Bugün: <strong className="text-emerald-400">{todayVisits}</strong>
              </span>
              <span>•</span>
              <span>
                Tekil: <strong className="text-white">{uniqueVisitors}</strong>
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <p className="text-zinc-400">Toplam Satış</p>
            <h2 className="mt-3 text-3xl font-bold text-[#c8a165]">
              ₺{(totalSales._sum.total ?? 0).toLocaleString("tr-TR")}
            </h2>
          </div>

          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <p className="text-zinc-400">Sipariş Sayısı</p>
            <h2 className="mt-3 text-3xl font-bold">{orderCount}</h2>
          </div>

          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <p className="text-zinc-400">Kullanıcı Sayısı</p>
            <h2 className="mt-3 text-3xl font-bold">{userCount}</h2>
          </div>

          <div className="rounded-2xl bg-[#1d222c] border border-white/10 p-8">
            <p className="text-zinc-400">Bekleyen Sipariş</p>
            <h2 className="mt-3 text-3xl font-bold text-yellow-400">
              {pendingOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#c8a165]/30 bg-gradient-to-br from-[#1d222c] to-[#171b23] p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-zinc-300 text-sm font-semibold">
                Proforma / Teklif
              </p>
              <span className="text-2xl">📑</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-[#e5c184]">
              {proformaCount}
            </h2>
            <div className="mt-3 text-xs text-zinc-400">
              <Link
                href="/admin/proforma"
                className="text-[#c8a165] hover:underline font-semibold"
              >
                Teklifleri Yönet →
              </Link>
            </div>
          </div>
        </div>

        {/* Son Siparişler */}
        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Son Siparişler</h2>
            <Link href="/admin/orders" className="text-[#c8a165]">
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-4">
            {latestOrders.map((order: LatestOrder) => (
              <div
                key={order.id}
                className="rounded-2xl bg-[#1d222c] border border-white/10 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold">Sipariş #{order.id}</h3>
                  <p className="text-zinc-400">{order.fullName}</p>
                </div>

                <div className="flex items-center gap-8">
                  <span className="font-bold text-[#c8a165]">
                    ₺{order.total.toLocaleString("tr-TR")}
                  </span>
                  <span className={`font-bold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-full border border-[#c8a165] px-5 py-2 text-[#c8a165]"
                  >
                    Detay
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
