"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteOrderButton({
  orderId,
  orderStatus,
  redirectToOrders = false,
}: {
  orderId: number;
  orderStatus: string;
  redirectToOrders?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const allowedStatuses = ["Teslim Edildi", "İptal"];

  async function handleDelete() {
    if (!allowedStatuses.includes(orderStatus)) {
      alert(
        `⚠️ UYARI:\n\n"${orderStatus}" durumundaki siparişler silinemez.\n\nYalnızca "Teslim Edildi" veya "İptal" durumundaki siparişler silinebilir.`
      );
      return;
    }

    const confirmAction = confirm(
      `Sipariş #${orderId} veritabanından tamamen silinecektir. Emin misiniz?`
    );

    if (!confirmAction) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Sipariş silinirken bir hata oluştu.");
      } else {
        if (redirectToOrders) {
          router.push("/admin/orders");
        } else {
          router.refresh();
        }
      }
    } catch (err) {
      console.error(err);
      alert("Bir sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-full bg-red-600/20 border border-red-500/30 px-5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
    >
      {loading ? "Siliniyor..." : "🗑️ Siparişi Sil"}
    </button>
  );
}
