"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Lütfen zorunlu alanları doldurunuz.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSubmitted(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Mesaj gönderilirken bir hata oluştu.");
      } else {
        setSubmitted(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold">
          ✓ Mesajınız sitede kayıtlı destek e-posta adresine başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
          ✕ {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Adınız Soyadınız *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ahmet Yılmaz"
            required
            className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            E-posta Adresiniz *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="ahmet@example.com"
            required
            className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-300 mb-2">
          Konu
        </label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Örn: Özel Sipariş & Ürün Hakkında Bilgi"
          className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-300 mb-2">
          Mesajınız *
        </label>
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Mesajınızı detaylıca yazabilirsiniz..."
          required
          className="w-full rounded-xl bg-[#090a0f] border border-white/10 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`gold-gradient-btn px-8 py-4 rounded-full font-extrabold text-black shadow-xl transition-all ${
          loading ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
        }`}
      >
        {loading ? "Gönderiliyor..." : "Mesajı Gönder →"}
      </button>
    </form>
  );
}
