import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import { notFound } from "next/navigation";



type PageProps = {

  params: Promise<{
    id:string;
  }>;

};





export default async function OrderDetailPage({

  params,

}:PageProps){



  const user = await getSessionUser();




  if(!user){

    return (

      <main className="
      min-h-screen
      bg-[#111]
      p-10
      text-white
      text-center
      ">

        Giriş yapmanız gerekiyor.

      </main>

    );

  }







  const { id } = await params;






  const order = await prisma.order.findFirst({

    where:{

      id:Number(id),

      userId:user.id,

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
max-w-5xl
">







<Link

href="/account"

className="
text-sm
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
mt-8
grid
gap-8
md:grid-cols-2
">








{/* Sipariş Bilgisi */}


<div className="
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Sipariş Bilgileri

</h2>



<div className="
mt-6
space-y-4
text-gray-300
">


<p>

Durum:

<span className="
ml-2
font-bold
text-[#c8a165]
">

{order.status}

</span>

</p>





<p>

Tarih:

<span className="ml-2">

{

new Date(
order.createdAt
).toLocaleDateString(
"tr-TR"
)

}

</span>

</p>





<p>

Toplam:

<span className="
ml-2
font-bold
text-white
">

₺
{order.total.toLocaleString("tr-TR")}

</span>

</p>





</div>


</div>









{/* Teslimat */}


<div className="
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Teslimat Bilgileri

</h2>




<div className="
mt-6
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



<p>

{order.city} / {order.district}

</p>


<p>

{order.address}

</p>


<p>

{order.postalCode}

</p>




</div>



</div>







</div>









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

order.items.map(item=>(


<div

key={item.id}

className="
flex
items-center
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
font-bold
text-[#c8a165]
">


₺
{
(
item.price *
item.quantity
).toLocaleString(
"tr-TR"
)
}


</div>







</div>


))


}



</div>



</section>






</div>


</main>


);


}