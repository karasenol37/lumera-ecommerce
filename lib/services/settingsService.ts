import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS: Record<string, string> = {
  topBannerText: "✨ 750 TL ve üzeri siparişlerde **Ücretsiz Kargo** | 💬 WhatsApp Sipariş & Destek: 0535 874 69 09",
  announcementBadge: "LUMERA LUXURY COLLECTION",
  contactPhone: "0535 874 69 09",
  contactEmail: "lumeratasarim@gmail.com",
  contactAddress: "İstanbul / Türkiye",
  whatsappNumber: "905358746909",
  heroBadge: "LUMERA PREMIUM OUTDOOR 2026",
  heroTitle: "Gölgede Zarafet & Konfor",
  heroSubtitle:
    "Bahçenizi sıradan bir alandan çıkarıp, doğal masif ahşap ve üst düzey el işçiliğiyle üretilmiş ultra-lüks bir dinlenme vahasına dönüştürün.",
  brandTagline: "Gölgede zarafet, dinlenmede ayrıcalık.",
  onlinePaymentActive: "false",
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  if (typeof window !== "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const siteSettingModel = (prisma as any).siteSetting;
    if (!siteSettingModel) {
      return DEFAULT_SETTINGS;
    }
    const settings = await siteSettingModel.findMany();
    const result: Record<string, string> = { ...DEFAULT_SETTINGS };

    if (Array.isArray(settings)) {
      for (const item of settings) {
        if (item && item.key && item.value !== undefined && item.value !== null) {
          result[item.key] = item.value;
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(
  settings: Record<string, string>
): Promise<boolean> {
  if (typeof window !== "undefined") {
    return false;
  }

  try {
    const siteSettingModel = (prisma as any).siteSetting;
    if (!siteSettingModel) {
      return false;
    }
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await siteSettingModel.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating site settings:", error);
    return false;
  }
}
