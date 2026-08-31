import { CartProvider } from "../context/CartContext";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { getSessionUser } from "@/lib/session";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LUMERA | Premium Outdoor & Lüks Dinlenme Koleksiyonları",
  description:
    "Doğal ahşap ve lüks tasarımın buluştuğu hamak, şezlong, şemsiye ve ateş çukuru koleksiyonu.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const userId = user?.id ?? null;

  return (
    <html
      lang="tr"
      className={`${plusJakartaSans.variable} font-sans h-full antialiased dark`}
    >
      <body className="min-h-screen bg-[#090a0f] text-[#f5efe6] selection:bg-[#c8a165] selection:text-black">
        <CartProvider userId={userId}>
          <FavoriteProvider userId={userId}>
            {children}
            <FloatingWhatsApp />
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  );
}
