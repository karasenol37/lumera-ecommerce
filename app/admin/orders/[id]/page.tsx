import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/actions/session";
import UpdateOrderStatus from "@/components/admin/UpdateOrderStatus";
interface AdminOrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image?: string;
  };
}


type PageProps = {

  params: Promise<{
    id:string;
  }>;

};




export default async function AdminOrderDetailPage({

  params,

}:PageProps){



  const user = await getSessionUser();



  if(!user || user.role !== "ADMIN"){

    return (

      <main className="
      min-h-screen
      bg-[#111]
      p-10
      text-white
      text-center
      ">

        Yetkisiz erişim

      </main>

    );

  }







  const {id} = await params;






  const order = await prisma.order.findUnique({

    where:{
      id:Number(id)
    },


    include:{


      items:{


        include:{


          product:true


        }


      }


    }


  });







  if(!order){

    notFound();

  }







return (

<main className="
min-h-screen
bg-[#111]
px-6
py-16
text-white
">


<div className="
mx-auto
max-w-6xl
">





<Link

href="/admin/orders"

className="
text-gray-400
hover:text-white
"

>

← Siparişlere Dön

</Link>








<h1 className="
mt-8
text-5xl
font-bold
">

Sipariş #{order.id}

</h1>









<div className="
mt-10
grid
gap-8
lg:grid-cols-3
">







{/* Müşteri */}


<div className="
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Müşteri

</h2>



<div className="
mt-5
space-y-2
text-gray-300
">


<p>

{order.fullName}

</p>


<p>

{order.phone}

</p>


<p>

{order.email}

</p>


</div>



</div>








{/* Adres */}


<div className="
rounded-2xl
bg-[#181818]
p-8
lg:col-span-2
">


<h2 className="
text-2xl
font-bold
">

Teslimat Adresi

</h2>



<p className="
mt-5
text-gray-300
">

{order.city}
/
{order.district}

</p>



<p className="
mt-2
text-gray-300
">

{order.address}

</p>




<p className="
mt-2
text-gray-300
">

{order.postalCode}

</p>



</div>







</div>









{/* Ürünler */}


<section className="
mt-10
">


<h2 className="
mb-6
text-3xl
font-bold
">

Ürünler

</h2>






<div className="
space-y-5
">


{

order.items.map((item: AdminOrderItem)=>(


<div

key={item.id}

className="
flex
justify-between
rounded-2xl
bg-[#181818]
p-6
"

>


<div>


<h3 className="
text-xl
font-bold
">

{item.product.name}

</h3>



<p className="
mt-2
text-gray-400
">

{item.quantity} adet

</p>



</div>





<div className="
text-[#c8a165]
font-bold
">


₺
{
(
item.price *
item.quantity
).toLocaleString("tr-TR")
}


</div>



</div>



))


}



</div>


</section>









{/* Durum */}


<div className="
mt-10
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Sipariş Durumu

</h2>



<p className="
mt-4
text-[#c8a165]
font-bold
">

{order.status}

</p>





<UpdateOrderStatus

orderId={order.id}

currentStatus={order.status}

/>



</div>










</div>

</main>

);


}