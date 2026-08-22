import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 w-full flex items-center justify-center">
        <LoginForm />
      </main>

      <Footer />
    </div>
  );
}