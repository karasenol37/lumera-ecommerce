import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/services/productService";

type ProductItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  stock: boolean | number;
  image?: string | null;
};

type ProductListProps = {
  category?: string;
  sort?: string;
};

export default async function ProductList({ category, sort }: ProductListProps) {
  const products = await getProducts({
    category,
    sort,
  });

  return (
    <section id="urunler" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA SEÇKİN KOLEKSİYONU
          </p>
          <h2 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
            Premium Dış Mekan Ürünleri
          </h2>
          <p className="mt-3 text-zinc-400 font-light max-w-lg">
            Bahçeniz, terasınız ve havuz kenarınız için tasarlanmış dayanıklı ve lüks mobilyalar.
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-[#121420]/80 p-12 text-center text-zinc-400 backdrop-blur-md">
            Aradığınız kriterlere uygun ürün bulunamadı.
          </div>
        ) : (
          products.map((product: ProductItem) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              oldPrice={product.oldPrice ?? 0}
              stock={typeof product.stock === "number" ? product.stock : product.stock ? 10 : 0}
              image={product.image || "/images/no-image.png"}
            />
          ))
        )}
      </div>
    </section>
  );
}