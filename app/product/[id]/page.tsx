import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import ProductDetailView from "./ProductDetailView";
import RelatedProducts from "./RelatedProducts";
import JsonLd from "@/components/JsonLd";
import {
  getSiteUrl,
  generateProductSchema,
  generateBreadcrumbSchema,
  SITE_NAME,
} from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return {
      title: "Ürün Bulunamadı",
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
    };
  }

  const siteUrl = getSiteUrl();
  const cleanDescription =
    product.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
    `${product.name} - Premium masif ahşap ve üst düzey işçilikle üretilen LUMERA koleksiyonu.`;

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${siteUrl}${product.image}`;

  const canonicalUrl = `${siteUrl}/product/${product.id}`;

  return {
    title: `${product.name} - Masif Ahşap Tasarım`,
    description: cleanDescription,
    keywords: [
      product.name,
      product.category,
      "masif ahşap",
      "lüks bahçe mobilyası",
      "el yapımı",
      "lumera",
      ...(product.material ? [product.material] : []),
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  // Fetch product from DB with images
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch 4 related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },
    },
    take: 4,
    orderBy: {
      id: "desc",
    },
  });

  const siteUrl = getSiteUrl();
  const productSchema = generateProductSchema(product, siteUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Ana Sayfa", url: "/" },
      {
        name: product.category || "Koleksiyon",
        url: `/kategori/${encodeURIComponent(product.category || "Hamak")}`,
      },
      { name: product.name, url: `/product/${product.id}` },
    ],
    siteUrl
  );

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 w-full">
        <ProductDetailView product={product} />
        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}