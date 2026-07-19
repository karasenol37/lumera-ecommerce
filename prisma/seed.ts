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
        image: "/images/products/hamak.jpg",
        description:
          "Doğal teak ağacından üretilmiş, bahçenize şıklık katacak premium hamak.",
        material:
          "Teak ahşap + dayanıklı kumaş",
        dimensions:
          "250 x 120 cm",
      },


      {
        name: "Premium Bahçe Şemsiyesi",
        slug: "premium-bahce-semsiyesi",
        category: "Şemsiye",
        price: 8490,
        oldPrice: 9990,
        stock: 10,
        image: "/images/products/semsiye.jpg",
        description:
          "Güneş korumalı, dayanıklı dış mekan şemsiyesi.",
        material:
          "Alüminyum gövde",
        dimensions:
          "300 cm çap",
      },


      {
        name: "Konfor Ahşap Şezlong",
        slug: "konfor-ahsap-sezlong",
        category: "Şezlong",
        price: 5990,
        oldPrice: 6990,
        stock: 10,
        image: "/images/products/sezlong.jpg",
        description:
          "Bahçe ve teras kullanımı için ergonomik şezlong.",
        material:
          "Masif ahşap",
        dimensions:
          "190 x 70 cm",
      },


      {
        name: "Bahçe Ateş Çukuru",
        slug: "bahce-ates-cukuru",
        category: "Ateş Çukuru",
        price: 7490,
        oldPrice: 8990,
        stock: 10,
        image: "/images/products/ates-cukuru.jpg",
        description:
          "Bahçenizde sıcak atmosfer oluşturacak modern ateş çukuru.",
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