"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Lütfen tüm zorunlu alanları doldurunuz.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await registerUser(form);

      if (!result.success) {
        setErrorMsg(result.message || "Kayıt oluşturulurken bir hata oluştu.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg("Kayıt olunurken bir sunucu hatası oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121420]/80 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl transition-all">
      {/* Header & Tagline */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
          LUMERA MÜŞTERİ PORTALI
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-white">
          Aramıza Katılın
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light">
          Yeni üyelik oluşturarak özel tekliflerden ve hızlı sipariş imkanından yararlanın.
        </p>
      </div>

      {/* In-page Error Alert */}
      {errorMsg && (
        <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 font-medium flex items-center gap-3 animate-shake">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold">
            ✕
          </span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Adınız Soyadınız
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              name="name"
              type="text"
              required
              placeholder="Ahmet Yılmaz"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#090a0f] border border-white/10 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            E-posta Adresiniz
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="ornek@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#090a0f] border border-white/10 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Şifreniz
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="En az 6 karakter"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#090a0f] border border-white/10 pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#c8a165] focus:ring-2 focus:ring-[#c8a165]/20 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition"
              title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.023 10.023 0 013.682-.663c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-3-3m-3.95-3.95L3 3" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 rounded-full gold-gradient-btn py-4 font-extrabold text-black shadow-xl transition-all ${
            loading ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Kayıt Oluşturuluyor...</span>
            </span>
          ) : (
            "Kayıt Ol →"
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-zinc-400">
        Zaten hesabınız var mı?{" "}
        <Link
          href="/login"
          className="font-bold text-[#c8a165] hover:text-[#e5c184] hover:underline transition"
        >
          Giriş Yapın →
        </Link>
      </div>
    </div>
  );
}
