import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.product.createMany({

    data: [

      {
        name: "Teak Ahşap Hamak",
        slug: "teak-ahsap-hamak",
        category: "Hamak",
        price: 12990,
        oldPrice: 15990,
        stock: 10,
        freeShipping: true,
        shippingFee: 0,
        image: "/images/products/hamak.jpg",
        description:
          "Doğal teak ağacından üretilmiş, açık hava alanlarınıza şıklık katacak premium hamak.",
        material:
          "Teak ahşap + dayanıklı kumaş",
        dimensions:
          "250 x 120 cm",
      },
      {
        name: "Premium Şemsiye Modeli",
        slug: "premium-semsiye-modeli",
        category: "Şemsiye Modelleri",
        price: 8490,
        oldPrice: 9990,
        stock: 10,
        freeShipping: true,
        shippingFee: 0,
        image: "/images/products/semsiye.jpg",
        description:
          "Güneş korumalı, dayanıklı dış mekan şemsiyesi.",
        material:
          "Alüminyum gövde",
        dimensions:
          "300 cm çap",
      },
      {
        name: "Lüks Ahşap Şezlong",
        slug: "luks-ahsap-sezlong",
        category: "Lüks Şezlong",
        price: 5990,
        oldPrice: 6990,
        stock: 10,
        freeShipping: true,
        shippingFee: 0,
        image: "/images/products/sezlong.jpg",
        description:
          "Teras ve havuz kenarı kullanımı için ergonomik lüks şezlong.",
        material:
          "Masif ahşap",
        dimensions:
          "190 x 70 cm",
      },
      {
        name: "Modern Ateş Çukuru",
        slug: "modern-ates-cukuru",
        category: "Ateş Çukurları",
        price: 7490,
        oldPrice: 8990,
        stock: 10,
        freeShipping: true,
        shippingFee: 0,
        image: "/images/products/ates-cukuru.jpg",
        description:
          "Açık havada sıcak atmosfer oluşturacak modern ateş çukuru.",
        material:
          "Çelik",
        dimensions:
          "80 cm çap",
      }

    ]

  });


}


main()

  .then(async () => {

    console.log("Seed tamamlandı");

    await prisma.$disconnect();

  })


  .catch(async (e) => {

    console.error(e);

    await prisma.$disconnect();

    process.exit(1);

  });