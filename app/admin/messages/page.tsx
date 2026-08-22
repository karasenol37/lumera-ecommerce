import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteMessageButton from "@/components/DeleteMessageButton";

export default async function AdminMessagesPage() {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#111] p-10 text-center text-white">
        Yetkisiz erişim
      </main>
    );
  }

  const contactModel = (prisma as any).contactMessage;
  let messages: any[] = [];
  if (contactModel) {
    // Mark unread messages as read
    await contactModel.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    messages = await contactModel.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <main className="min-h-screen bg-[#111] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Gelen İletişim Mesajları"
          userEmail={user.email}
          subtitle="Sitedeki iletişim formundan gönderilen tüm mesajlar"
        />

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#c8a165] hover:underline"
          >
            ← Admin Paneline Dön
          </Link>
          <span className="text-xs text-zinc-400">
            Toplam {messages.length} mesaj bulundu
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-12 text-center text-zinc-400">
              Henüz gelen bir iletişim mesajı bulunmuyor.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-white/10 bg-[#181818] p-6 shadow-md transition-all hover:border-[#c8a165]/30 space-y-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>👤 {msg.name}</span>
                      <span className="text-xs font-normal text-zinc-400">
                        (&lt;{msg.email}&gt;)
                      </span>
                    </h3>
                    {msg.subject && (
                      <p className="text-sm font-semibold text-[#c8a165] mt-1">
                        Konu: {msg.subject}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right text-xs text-zinc-400">
                      <div>
                        Tarih: {new Date(msg.createdAt).toLocaleString("tr-TR")}
                      </div>
                      <div className="mt-1 text-[#e5c184]">
                        Hedef: {msg.targetEmail}
                      </div>
                    </div>

                    <DeleteMessageButton messageId={msg.id} />
                  </div>
                </div>

                <div className="text-sm text-zinc-200 whitespace-pre-wrap bg-[#111] p-4 rounded-xl border border-white/5">
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
