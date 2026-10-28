import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";
import { getProductImageUrl } from "@/lib/utils/productImage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/sozlesmeler/gizlilik-kvkk`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/sozlesmeler/iptal-iade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/sozlesmeler/mesafeli-satis`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // 2. Default and Dynamic Categories
  const categoryNames = new Set<string>([
    "Hamak",
    "Lüks Şezlong",
    "Şemsiye Modelleri",
    "Ateş Çukurları",
    "Tamamlayıcı Ürünler",
  ]);

  // 3. Dynamic Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        category: true,
        image: true,
        updatedAt: true,
      },
    });

    for (const prod of products) {
      if (prod.category) {
        categoryNames.add(prod.category);
      }
      const namedImg = prod.image
        ? getProductImageUrl(prod.image, prod.name, 1)
        : null;
      productRoutes.push({
        url: `${siteUrl}/product/${prod.id}`,
        lastModified: prod.updatedAt || now,
        changeFrequency: "weekly",
        priority: 0.9,
        images: namedImg
          ? [namedImg.startsWith("http") ? namedImg : `${siteUrl}${namedImg}`]
          : undefined,
      });
    }
  } catch (error) {
    console.error("Error generating product sitemap entries:", error);
  }

  const categoryRoutes: MetadataRoute.Sitemap = Array.from(categoryNames).map(
    (cat) => ({
      url: `${siteUrl}/kategori/${encodeURIComponent(cat)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
