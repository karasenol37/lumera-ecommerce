"use client";

import PaymentButton from "@/components/PaymentButton";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cargo = total >= 750 ? 0 : 150;
  const grandTotal = total + cargo;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <main className="min-h-screen bg-[#090a0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#c8a165] hover:underline mb-4"
          >
            ← Sepete Dön
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Teslimat & Ödeme Bilgileri
          </h1>
          <p className="text-zinc-400 text-sm mt-2 font-light">
            Lütfen siparişinizin teslim edileceği adres bilgilerini eksiksiz giriniz.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* FORM */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              1. Teslimat Adresi
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Ad Soyad *
                </label>
                <input
                  name="fullName"
                  placeholder="Ahmet Yılmaz"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Telefon Numarası *
                </label>
                <input
                  name="phone"
                  placeholder="0532 000 00 00"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  E-posta Adresi *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="ahmet@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  İl *
                </label>
                <input
                  name="city"
                  placeholder="İstanbul"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  İlçe
                </label>
                <input
                  name="district"
                  placeholder="Kadıköy"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Posta Kodu
                </label>
                <input
                  name="postalCode"
                  placeholder="34700"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Açık Adres (Mahalle, Cadde, Sokak, Bina No) *
              </label>
              <textarea
                name="address"
                placeholder="Örn: Moda Cad. No: 12 Daire: 4 Kadıköy/İstanbul"
                value={form.address}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
              />
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  2. Sipariş Onayı & Ödeme Seçenekleri
                </h2>
              </div>

              {/* Notice regarding current order mode */}
              <div className="rounded-2xl border border-[#c8a165]/30 bg-[#c8a165]/10 p-4 text-xs text-zinc-300 leading-relaxed space-y-1 backdrop-blur-md">
                <p className="font-bold text-[#e5c184] flex items-center gap-1.5">
                  <span>ℹ️</span>
                  <span>WhatsApp & Müşteri Temsilcisi ile Hızlı Sipariş</span>
                </p>
                <p className="text-zinc-400 font-light">
                  Sipariş bilgileriniz doğrudan atölye yetkilimize iletilir. Temsilcimiz teslimat detaylarını sizinle teyit ederek siparişinizi hemen işleme alır. (Online kredi kartı pos entegrasyonu onay sürecindedir.)
                </p>
              </div>

              {/* WhatsApp Order Action */}
              <a
                href={
                  form.fullName && form.phone
                    ? `https://wa.me/905358746909?text=${encodeURIComponent(
                        `*LUMERA DIŞ MEKAN SİPARİŞİ*\n\n` +
                          `*Müşteri Bilgileri:*\n` +
                          `• Ad Soyad: ${form.fullName}\n` +
                          `• Telefon: ${form.phone}\n` +
                          `• E-posta: ${form.email || "Belirtilmedi"}\n` +
                          `• İl/İlçe: ${form.city || "-"} / ${form.district || "-"}\n` +
                          `• Açık Adres: ${form.address || "-"}\n\n` +
                          `*Sipariş Edilen Ürünler:*\n` +
                          cart
                            .map(
                              (i, idx) =>
                                `${idx + 1}. ${i.name} (${i.quantity} Adet) - ₺${(
                                  i.price * i.quantity
                                ).toLocaleString("tr-TR")}`
                            )
                            .join("\n") +
                          `\n\n*Kargo:* ${cargo === 0 ? "Ücretsiz" : `₺${cargo}`}` +
                          `\n*Toplam Tutar: ₺${grandTotal.toLocaleString("tr-TR")}*`
                      )}`
                    : "#"
                }
                onClick={(e) => {
                  if (!form.fullName.trim() || !form.phone.trim()) {
                    e.preventDefault();
                    alert("Lütfen en az Ad Soyad ve Telefon numaranızı giriniz.");
                  }
                }}
                target={form.fullName && form.phone ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full rounded-full bg-[#25D366] py-4 px-6 text-sm font-extrabold text-black shadow-2xl hover:bg-[#20bd5a] hover:scale-[1.01] transition duration-200"
              >
                <span className="text-lg">💬</span>
                <span>WhatsApp ile Siparişi Tamamla & Gönder</span>
              </a>

              {/* Direct Call / Contact alternative */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-zinc-400">
                <a
                  href="tel:05358746909"
                  className="flex items-center gap-1.5 hover:text-[#e5c184] transition"
                >
                  <span>📞 Telefonla Sipariş:</span>
                  <strong className="text-white">0535 874 69 09</strong>
                </a>
                <span className="hidden sm:inline text-zinc-700">•</span>
                <a
                  href={`mailto:lumeratasarim@gmail.com?subject=Lumera Sipariş Talebi - ${encodeURIComponent(form.fullName || "Müşteri")}`}
                  className="flex items-center gap-1.5 hover:text-[#c8a165] transition"
                >
                  <span>✉️ E-posta:</span>
                  <span>lumeratasarim@gmail.com</span>
                </a>
              </div>
            </div>
          </form>

          {/* SİPARİŞ ÖZETİ */}
          <div className="h-fit rounded-2xl border border-white/10 bg-[#121420]/80 p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">
              Sipariş Özeti
            </h2>

            <div className="mt-6 space-y-4 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-white/5"
                >
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-zinc-400">{item.quantity} Adet</p>
                  </div>
                  <span className="font-bold text-[#e5c184]">
                    ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Ara Toplam</span>
                <span className="text-white">₺{total.toLocaleString("tr-TR")}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Kargo</span>
                {cargo === 0 ? (
                  <span className="text-emerald-400 font-semibold">Ücretsiz</span>
                ) : (
                  <span className="text-white">₺{cargo.toLocaleString("tr-TR")}</span>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-extrabold">
                <span>Toplam</span>
                <span className="gold-gradient-text">
                  ₺{grandTotal.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <span>🔒 256-Bit Güvenli SSL Ödemesi</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}