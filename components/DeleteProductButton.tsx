"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
  productName,
}: {
  id: number;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const initialConfirm = confirm(
      `"${productName}" ürününü veritabanından silmek istediğinize emin misiniz?`
    );
    if (!initialConfirm) return;

    setLoading(true);

    try {
      // 1. İlk silme denemesi (Sipariş kontrolü)
      let res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      let data = await res.json();

      // Sipariş uyarısı ve onay alma
      if (data.requiresConfirmation) {
        const forceConfirm = confirm(
          `⚠️ UYARI:\n\n${data.message}`
        );

        if (!forceConfirm) {
          setLoading(false);
          return;
        }

        // Onay verildiyse zorunlu (force=true) silme
        res = await fetch(`/api/admin/products/${id}?force=true`, {
          method: "DELETE",
        });
        data = await res.json();
      }

      if (res.ok && data.success) {
        router.refresh();
      } else {
        alert(data.message || "Ürün silinirken bir hata oluştu.");
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
      className="ml-2 rounded-full bg-red-600/90 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all shadow-md disabled:opacity-50"
    >
      {loading ? "Siliniyor..." : "🗑️ Sil"}
    </button>
  );
}