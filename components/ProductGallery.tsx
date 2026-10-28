"use client";

import { useState } from "react";
import { getProductImageUrl } from "@/lib/utils/productImage";

type Image = {
  id: number;
  url: string;
};

type Props = {
  mainImage: string;
  name: string;
  images: Image[];
};

export default function ProductGallery({ mainImage, name, images }: Props) {
  const allImages = [
    {
      id: 0,
      url: mainImage,
    },
    ...images,
  ].map((img, idx) => ({
    ...img,
    url: getProductImageUrl(img.url, name, idx + 1),
  }));

  const [activeImage, setActiveImage] = useState(
    allImages[0]?.url || getProductImageUrl(mainImage, name, 1)
  );

  return (
    <div>
      <img
        src={activeImage || "/images/no-image.jpg"}
        alt={name}
        title={name}
        className="h-[500px] w-full rounded-xl object-fill"
      />

      <div className="mt-5 grid grid-cols-4 gap-4">
        {allImages.map((img) => (
          <button
            key={img.id}
            onClick={() => setActiveImage(img.url)}
            className="overflow-hidden rounded-lg"
          >
            <img
              src={img.url}
              alt={name}
              title={name}
              className="h-24 w-full object-fill hover:opacity-80 transition"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
