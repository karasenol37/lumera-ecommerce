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
    <section id="urunler" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24">
      <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#c8a165] uppercase">
            LUMERA SEÇKİN KOLEKSİYONU
          </p>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Premium Dış Mekan Ürünleri
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-400 font-light max-w-lg">
            Bahçeniz, terasınız ve havuz kenarınız için tasarlanmış dayanıklı ve lüks mobilyalar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {products.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-[#121420]/80 p-8 sm:p-12 text-center text-zinc-400 backdrop-blur-md text-xs sm:text-sm">
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