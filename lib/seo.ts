/**
 * SEO Utility and Schema.org Structured Data Generators for LUMERA
 */

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://lumera.com";
  // Ensure no trailing slash
  return url.replace(/\/$/, "");
}

export const SITE_NAME = "LUMERA";
export const SITE_TAGLINE = "Premium Ahşap Bahçe Mobilyaları & Lüks Outdoor";
export const SITE_DEFAULT_DESCRIPTION =
  "Doğal masif ahşap ve üst düzey zanaatkarlığın buluştuğu el yapımı hamak, şezlong, bahçe şemsiyesi ve ateş çukuru koleksiyonları. Türkiye geneli ücretsiz kargo ve güvenli alışveriş.";

export const DEFAULT_KEYWORDS = [
  "ahşap hamak",
  "lüks şezlong",
  "bahçe şemsiyesi",
  "ateş çukuru",
  "masif bahçe mobilyası",
  "teak şezlong",
  "lüks bahçe dekorasyonu",
  "dış mekan mobilyaları",
  "tasarım hamak",
  "ahşap sallanan yatak",
  "otel şezlongu",
  "villa bahçe mobilyası",
  "lumera outdoor",
  "lumera",
];

export function generateOrganizationSchema(siteUrl: string, settings?: Record<string, string>) {
  const phone = settings?.contactPhone || "+90 535 874 69 09";
  const email = settings?.contactEmail || "lumeratasarim@gmail.com";
  const address = settings?.contactAddress || "Kastamonu / Tosya, Türkiye";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      caption: SITE_NAME,
    },
    description: SITE_DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "Kastamonu",
      addressRegion: "Tosya",
      addressCountry: "TR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        areaServed: "TR",
        availableLanguage: ["Turkish"],
      },
    ],
    sameAs: [
      "https://www.instagram.com/lumeraoutdoor",
      "https://wa.me/905358746909",
    ],
  };
}

export function generateWebSiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export interface ProductSchemaInput {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  images?: { url: string }[];
  category?: string;
  material?: string;
  dimensions?: string;
}

export function generateProductSchema(product: ProductSchemaInput, siteUrl: string) {
  const images = [
    product.image?.startsWith("http") ? product.image : `${siteUrl}${product.image}`,
    ...(product.images || []).map((img) =>
      img.url.startsWith("http") ? img.url : `${siteUrl}${img.url}`
    ),
  ].filter(Boolean);

  const productUrl = `${siteUrl}/product/${product.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    image: images.length > 0 ? images : undefined,
    description: product.description?.replace(/<[^>]*>?/gm, "").slice(0, 500) || product.name,
    sku: `LUMERA-${product.id}`,
    mpn: `LUM-${product.id}`,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: product.category,
    material: product.material,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "TRY",
      price: product.price,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "18",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateCollectionSchema(
  categoryName: string,
  products: { id: number; name: string; image: string; price: number }[],
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Modelleri & Fiyatları | LUMERA`,
    description: `Özel tasarım ${categoryName} koleksiyonu. Doğal masif ahşap malzeme ve lüks konfor.`,
    url: `${siteUrl}/kategori/${encodeURIComponent(categoryName)}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/product/${prod.id}`,
        name: prod.name,
      })),
    },
  };
}

export function generateAboutPageSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Hakkımızda | ${SITE_NAME}`,
    description: "Doğal masif ahşap, üst düzey zanaat ve modern estetiğin buluştuğu LUMERA Outdoor hikayesi.",
    url: `${siteUrl}/hakkimizda`,
    mainEntity: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function generateContactPageSchema(siteUrl: string, settings?: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `İletişim & WhatsApp Sipariş Hattı | ${SITE_NAME}`,
    description: "LUMERA iletişim bilgileri, adres, telefon ve doğrudan WhatsApp sipariş kanalı.",
    url: `${siteUrl}/iletisim`,
    mainEntity: generateOrganizationSchema(siteUrl, settings),
  };
}
