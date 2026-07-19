"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  material: string;
  dimensions: string;
  stock: number;
};

export default function ProductInfo({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (product.stock <= 0) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-bold text-white">
        {product.name}
      </h1>

      <p className="text-3xl font-bold text-[#c8a165]">
        ₺{product.price.toLocaleString("tr-TR")}
      </p>

      <div className="rounded-xl bg-[#181818] p-5">
        <p className="leading-8 text-gray-300">
          {product.description}
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-[#2b2b2b] p-5">
        <p>
          <span className="font-semibold text-[#c8a165]">
            Materyal:
          </span>{" "}
          {product.material}
        </p>

        <p>
          <span className="font-semibold text-[#c8a165]">
            Ölçüler:
          </span>{" "}
          {product.dimensions}
        </p>

        <p>
          <span className="font-semibold text-[#c8a165]">
            Stok:
          </span>{" "}
          {product.stock} adet
        </p>

        <p>
          {product.stock > 10 && (
            <span className="text-green-400">
              ✓ Stokta
            </span>
          )}

          {product.stock > 0 && product.stock <= 10 && (
            <span className="text-yellow-400">
              ⚠ Son {product.stock} ürün
            </span>
          )}

          {product.stock === 0 && (
            <span className="text-red-500">
              ✕ Tükendi
            </span>
          )}
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="
          w-full
          rounded-full
          bg-[#c8a165]
          py-4
          text-lg
          font-bold
          text-black
          transition
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:bg-gray-600
        "
      >
        {product.stock > 0
          ? "Sepete Ekle"
          : "Stokta Yok"}
      </button>

      {added && (
        <div className="rounded-lg bg-green-600 p-4 text-center">
          ✓ Ürün sepete eklendi.
        </div>
      )}
    </div>
  );
}