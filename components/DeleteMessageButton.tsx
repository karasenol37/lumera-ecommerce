"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteMessageButton({ messageId }: { messageId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Mesaj silinemedi.");
        setLoading(false);
        setShowConfirm(false);
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Mesaj silinirken bir hata oluştu.");
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition flex items-center gap-1.5 shadow-sm"
        title="Mesajı Sil"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span>Sil</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#181818] p-6 text-center shadow-2xl space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 text-2xl border border-rose-500/30">
              🗑️
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Mesajı Sil</h4>
              <p className="mt-1 text-xs text-zinc-400 font-light">
                Bu mesaj veritabanından kalıcı olarak silinecektir. Devam etmek istiyor musunuz?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-full bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Siliniyor...</span>
                  </>
                ) : (
                  "Evet, Sil"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
