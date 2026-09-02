import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const disallowList = [
    "/admin/",
    "/admin",
    "/api/",
    "/account/",
    "/account",
    "/cart",
    "/checkout",
    "/login",
    "/register",
    "/odeme-basarili",
    "/odeme-basarisiz",
    "/order-success",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowList,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowList,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
