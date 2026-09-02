import { CartProvider } from "../context/CartContext";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { getSessionUser } from "@/lib/session";
import { getSiteSettings } from "@/lib/services/settingsService";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import JsonLd from "@/components/JsonLd";
import {
  getSiteUrl,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_DEFAULT_DESCRIPTION,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Lüks Ahşap Bahçe Mobilyaları, Hamak & Şezlong`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: "LUMERA Luxury Outdoor", url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Ahşap Bahçe Mobilyaları & Lüks Outdoor`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Luxury Outdoor Koleksiyonu`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Ahşap Bahçe Mobilyaları`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "ecommerce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const userId = user?.id ?? null;
  const settings = await getSiteSettings();

  const organizationSchema = generateOrganizationSchema(siteUrl, settings);
  const websiteSchema = generateWebSiteSchema(siteUrl);

  return (
    <html
      lang="tr"
      className={`${plusJakartaSans.variable} font-sans h-full antialiased dark`}
    >
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
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

