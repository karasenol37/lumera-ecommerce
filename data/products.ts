import { Product } from "@/types/product";


export const products: Product[] = [
  {
    id: 1,
    slug: "teak-ahsap-hamak",
    name: "Teak Ahşap Hamak",
    category: "Hamak",
    price: 12990,
    oldPrice: 15990,
    rating: 4.8,
    stock: true,
    image: "/images/products/hamak.jpg",
    description:
      "Doğal tik ağacından üretilmiş premium hamak. Teras ve açık hava yaşam alanları için özel olarak tasarlanmıştır.",
    material: "Masif Tik Ağacı",
    dimensions: "120 x 250 cm",
    features: [
      "UV dayanıklı dış mekan kaplama",
      "Suya dayanıklı yapı",
      "El işçiliği üretim",
      "Doğal ahşap dokusu"
    ]
  },
  {
    id: 2,
    slug: "premium-semsiye",
    name: "Premium Şemsiye Modeli",
    category: "Şemsiye Modelleri",
    price: 8490,
    oldPrice: 9990,
    rating: 4.6,
    stock: true,
    image: "/images/products/semsiye.jpg",
    description:
      "Geniş gölge alanı sağlayan modern tasarımlı premium şemsiye. Dış mekan konforunu artırır.",
    material: "Alüminyum gövde ve UV korumalı kumaş",
    dimensions: "300 cm çap",
    features: [
      "UV korumalı kumaş",
      "Paslanmaz gövde",
      "Kolay açılır mekanizma",
      "Rüzgar dayanıklı tasarım"
    ]
  },
  {
    id: 3,
    slug: "lumera-luks-ahsap-sezlong",
    name: "LUMERA Lüks Ahşap Şezlong",
    category: "Lüks Şezlong",
    price: 5990,
    oldPrice: 6990,
    rating: 4.7,
    stock: true,
    image: "/images/products/sezlong.jpg",
    description:
      "Teras ve havuz alanları için tasarlanmış ergonomik ahşap şezlong. Konfor ve estetiği bir araya getirir.",
    material: "Doğal Ahşap",
    dimensions: "70 x 200 cm",
    features: [
      "Ergonomik sırt desteği",
      "Katlanabilir yapı",
      "Dayanıklı dış mekan koruması",
      "Modern tasarım"
    ]
  },
  {
    id: 4,
    slug: "modern-ates-cukuru",
    name: "Modern Ateş Çukuru",
    category: "Ateş Çukurları",
    price: 7490,
    oldPrice: 8990,
    rating: 4.9,
    stock: true,
    image: "/images/products/ates-cukuru.jpg",
    description:
      "Açık hava alanlarında sıcak ve keyifli atmosfer oluşturmak için tasarlanmış modern ateş çukuru.",
    material: "Isıya dayanıklı çelik",
    dimensions: "80 cm çap",
    features: [
      "Yüksek ısı dayanımı",
      "Modern görünüm",
      "Dış mekan kullanımı",
      "Kolay temizleme"
    ]
  }
];