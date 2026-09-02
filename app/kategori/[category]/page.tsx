import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import {
  getSiteUrl,
  generateCollectionSchema,
  generateBreadcrumbSchema,
  SITE_NAME,
} from "@/lib/seo";

type CategoryProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  stock: number;
  image: string;
};

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/kategori/${encodeURIComponent(decodedCategory)}`;

  const title = `${decodedCategory} Modelleri & Fiyatları`;
  const description = `En şık ve lüks masif ahşap ${decodedCategory} çeşitleri. Özel tasarım, dayanıklı dış mekan zanaatı ve Türkiye geneli ücretsiz kargo avantajıyla keşfedin.`;

  return {
    title,
    description,
    keywords: [
      decodedCategory,
      `${decodedCategory} modelleri`,
      `${decodedCategory} fiyatları`,
      "masif ahşap bahçe mobilyası",
      "lüks outdoor",
      "el yapımı",
      "lumera",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  let categoryFilter: string[] = [decodedCategory];
  if (decodedCategory === "Şemsiye Modelleri" || decodedCategory === "Şemsiye") {
    categoryFilter = ["Şemsiye Modelleri", "Şemsiye", "Güneş Şemsiyeleri"];
  } else if (decodedCategory === "Lüks Şezlong" || decodedCategory === "Şezlong") {
    categoryFilter = ["Lüks Şezlong", "Şezlong"];
  } else if (decodedCategory === "Ateş Çukurları" || decodedCategory === "Ateş Çukuru") {
    categoryFilter = ["Ateş Çukurları", "Ateş Çukuru"];
  } else if (decodedCategory === "Hamak") {
    categoryFilter = ["Hamak", "Hamak Serisi"];
  }

  const products = await prisma.product.findMany({
    where: {
      category: { in: categoryFilter },
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const siteUrl = getSiteUrl();
  const collectionSchema = generateCollectionSchema(
    decodedCategory,
    products,
    siteUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Ana Sayfa", url: "/" },
      {
        name: decodedCategory,
        url: `/kategori/${encodeURIComponent(decodedCategory)}`,
      },
    ],
    siteUrl
  );

  return (
    <main className="min-h-screen bg-[#090a0f] px-3.5 sm:px-6 py-10 sm:py-16 pb-28 md:pb-16 text-white">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
          LUMERA COLLECTION
        </p>

        <h1 className="mt-2 sm:mt-4 text-3xl sm:text-5xl font-extrabold">
          {decodedCategory}
        </h1>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-[#121420]/80 p-8 sm:p-12 text-center text-zinc-400 text-xs sm:text-sm">
              Bu kategoride ürün bulunamadı.
            </div>
          ) : (
            products.map((product: CategoryProduct) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                stock={product.stock}
                image={product.image}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}