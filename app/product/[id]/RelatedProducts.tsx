import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string | {
    name: string;
  } | null;
};

export default function RelatedProducts({
  products,
}: {
  products: Product[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-24 border-t border-white/10 pt-16">
      <div className="text-center mb-12">
        <span className="text-[11px] font-semibold tracking-[0.3em] text-[#c8a165] uppercase">
          TAMAMLAYICI PARÇALAR
        </span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
          İlginizi Çekebilecek Diğer Koleksiyon Parçaları
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-light max-w-lg mx-auto">
          Aynı üst düzey el işçiliği ve masif ahşap kalitesiyle üretilmiş alternatif bahçe ve teras mobilyalarımız.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            id={prod.id}
            slug={`product-${prod.id}`}
            name={prod.name}
            price={prod.price}
            oldPrice={Math.round(prod.price * 1.25)}
            stock={prod.stock}
            image={prod.image}
          />
        ))}
      </div>
    </section>
  );
}
