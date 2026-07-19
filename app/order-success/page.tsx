import Link from "next/link";
import { prisma } from "@/lib/prisma";


type PageProps = {

  searchParams: Promise<{
    id?: string;
  }>;

};




export default async function OrderSuccessPage({

  searchParams,

}: PageProps) {



  const params = await searchParams;


  const orderId = Number(params.id);




  const order = await prisma.order.findUnique({

    where:{
      id:orderId,
    },

    select:{

      id:true,

      status:true,

      total:true,

    }


  });





  return (

    <main className="
      min-h-screen
      bg-[#111111]
      px-6
      py-20
      text-white
    ">


      <div className="
        mx-auto
        max-w-3xl
        rounded-3xl
        bg-[#181818]
        p-12
        text-center
      ">




        <div className="
          mx-auto
          mb-8
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-[#c8a165]
          text-5xl
          text-black
        ">

          ✓

        </div>






        <h1 className="
          text-4xl
          font-bold
        ">

          Siparişiniz Başarıyla Oluşturuldu

        </h1>






        <p className="
          mt-4
          text-gray-400
        ">

          Bizi tercih ettiğiniz için teşekkür ederiz.

          Siparişiniz hazırlanmaya başlanacaktır.

        </p>








        {

          order && (


            <div className="
              mt-10
              rounded-2xl
              bg-[#222]
              p-6
              text-left
            ">



              <div className="
                flex
                justify-between
                border-b
                border-[#333]
                pb-4
              ">


                <span className="text-gray-400">

                  Sipariş No

                </span>


                <span className="font-bold">

                  #{order.id}

                </span>


              </div>







              <div className="
                mt-4
                flex
                justify-between
              ">


                <span className="text-gray-400">

                  Durum

                </span>


                <span className="
                  text-[#c8a165]
                  font-bold
                ">

                  {order.status}

                </span>


              </div>







              <div className="
                mt-4
                flex
                justify-between
              ">


                <span className="text-gray-400">

                  Toplam

                </span>


                <span className="
                  font-bold
                ">

                  ₺
                  {order.total.toLocaleString("tr-TR")}

                </span>


              </div>






            </div>


          )

        }









        <div className="
          mt-10
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:justify-center
        ">




          <Link

            href="/account"

            className="
              rounded-full
              bg-[#c8a165]
              px-8
              py-4
              font-bold
              text-black
            "

          >

            Siparişlerim

          </Link>








          <Link

            href="/"

            className="
              rounded-full
              border
              border-[#c8a165]
              px-8
              py-4
              text-[#c8a165]
            "

          >

            Alışverişe Devam Et

          </Link>






        </div>





      </div>



    </main>


  );

}