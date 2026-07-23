import Link from "next/link";
import { prisma } from "@/lib/prisma";
type ProductItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image?: string | null;
  stock: boolean | number;
};

export default async function Products() {


  const products =
    await prisma.product.findMany({

      orderBy:{
        createdAt:"desc"
      },

     include:{
  images:true
}

    });



  return (

    <section className="
      mx-auto
      max-w-7xl
      px-6
      py-16
    ">


      <h2 className="
        mb-8
        text-3xl
        font-bold
      ">

        Öne Çıkan Ürünler

      </h2>




      <div className="
        grid
        grid-cols-1
        gap-8
        md:grid-cols-2
        lg:grid-cols-4
      ">



        {products.map((product: ProductItem)=>(


          <div

            key={product.id}

            className="
              overflow-hidden
              rounded-xl
              bg-white
              shadow
              transition
              hover:-translate-y-1
              hover:shadow-xl
            "

          >



            <Link href={`/product/${product.id}`}>



              <img

                src={
                  product.image ||
                  "/images/no-image.jpg"
                }

                alt={product.name}

                className="
                  h-64
                  w-full
                  object-cover
                "

              />


            </Link>





            <div className="
              p-5
            ">



              <Link href={`/product/${product.id}`}>



                <h3 className="
                  text-lg
                  font-semibold
                  hover:text-[#c8a165]
                ">

                  {product.name}

                </h3>


              </Link>





              <div className="
                mt-3
                text-yellow-500
              ">

                ⭐ 

              </div>





              <p className="
                mt-3
                text-xl
                font-bold
                text-green-700
              ">

                ₺{product.price.toLocaleString("tr-TR")}

              </p>



            </div>



          </div>


        ))}



      </div>



    </section>

  );

}