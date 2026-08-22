import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import ProductDetailView from "./ProductDetailView";
import RelatedProducts from "./RelatedProducts";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f5efe6] flex flex-col justify-between">
      <HeaderWrapper />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 w-full">
        <ProductDetailView product={product} />
        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
}