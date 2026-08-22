"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function PaymentButton({ buyer }: { buyer: any }) {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    if (!cart || cart.length === 0) {
      alert("Sepetinizde ürün bulunmamaktadır.");
      return;
    }

    if (!buyer.fullName?.trim() || !buyer.phone?.trim() || !buyer.email?.trim()) {
      alert("Lütfen Ad Soyad, Telefon ve E-posta alanlarını doldurunuz.");
      return;
    }

    if (!buyer.address?.trim()) {
      alert("Lütfen Teslimat Adresinizi giriniz.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          buyer,
        }),
      });

      const data = await response.json();

      console.log("IYZICO RESPONSE:", data);

      if (data.success && data.paymentPageUrl) {
        localStorage.removeItem("lumera-cart");
        window.location.href = data.paymentPageUrl;
      } else {
        alert(data.error || data.message || "Ödeme başlatılamadı. Lütfen bilgilerinizi kontrol ediniz.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Ödeme bağlantısı kurulurken bir hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className={`w-full rounded-full py-4 text-base font-extrabold text-black transition-all shadow-xl shadow-[#c8a165]/10 flex items-center justify-center gap-2 ${
        loading
          ? "bg-zinc-600 cursor-not-allowed opacity-75 text-zinc-300"
          : "gold-gradient-btn hover:scale-[1.02]"
      }`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>İyzico Ödeme Sayfasına Yönlendiriliyor...</span>
        </>
      ) : (
        <span>Ödemeye Geç (Güvenli İyzico Ödemesi) →</span>
      )}
    </button>
  );
}