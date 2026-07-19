import Link from "next/link";
import { getSessionUser } from "@/lib/actions/session";
import { prisma } from "@/lib/prisma";



export default async function AccountPage() {


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


        <h1 className="
          text-3xl
          font-bold
        ">

          Giriş Yapmanız Gerekiyor

        </h1>


        <Link

          href="/login"

          className="
            mt-6
            inline-block
            rounded-full
            bg-[#c8a165]
            px-8
            py-3
            text-black
            font-bold
          "

        >

          Giriş Yap

        </Link>


      </main>

    );

  }







  const orders = await prisma.order.findMany({

    where:{
      userId:user.id
    },


    orderBy:{
      createdAt:"desc"
    },


    select:{


      id:true,

      total:true,

      status:true,

      createdAt:true,


    }


  });








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





<h1 className="
text-5xl
font-bold
">

Hesabım

</h1>





<div className="
mt-8
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Merhaba {user.name}

</h2>



<p className="
mt-2
text-gray-400
">

{user.email}

</p>


</div>









<section className="
mt-10
">


<h2 className="
mb-6
text-3xl
font-bold
">

Siparişlerim

</h2>








{

orders.length === 0 ? (


<div className="
rounded-2xl
bg-[#181818]
p-10
text-center
text-gray-400
">


Henüz siparişiniz bulunmuyor.


</div>


)

:


(


<div className="
space-y-5
">


{

orders.map(order=>(


<div

key={order.id}

className="
rounded-2xl
bg-[#181818]
p-6
"

>



<div className="
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
">





<div>


<h3 className="
text-xl
font-bold
">

Sipariş #{order.id}

</h3>


<p className="
mt-2
text-sm
text-gray-400
">

{

new Date(
order.createdAt
).toLocaleDateString(
"tr-TR"
)

}

</p>


</div>









<div>


<p className="
text-[#c8a165]
font-bold
">

₺
{
order.total.toLocaleString(
"tr-TR"
)
}

</p>


<p className="
mt-1
text-sm
text-gray-400
">

{order.status}

</p>


</div>







<Link

href={`/account/orders/${order.id}`}

className="
rounded-full
border
border-[#c8a165]
px-5
py-2
text-[#c8a165]
hover:bg-[#c8a165]
hover:text-black
transition
"

>

Detay

</Link>





</div>



</div>



))


}



</div>



)


}



</section>






</div>

</main>


);


}