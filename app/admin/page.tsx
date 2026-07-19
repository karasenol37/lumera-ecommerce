import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";





function statusStyle(status:string){

  switch(status){

    case "Bekliyor":
      return "text-yellow-400";

    case "Hazırlanıyor":
      return "text-blue-400";

    case "Kargoda":
      return "text-purple-400";

    case "Teslim Edildi":
      return "text-green-400";

    case "İptal":
      return "text-red-400";

    default:
      return "text-gray-400";

  }

}








export default async function AdminPage(){



  const user = await getSessionUser();





  if(!user || user.role !== "ADMIN"){

    return (

      <main className="
      min-h-screen
      bg-[#111]
      p-10
      text-center
      text-white
      ">

        Yetkisiz erişim

      </main>

    );

  }









  const totalSales = await prisma.order.aggregate({

    _sum:{
      total:true
    }

  });





  const orderCount = await prisma.order.count();





  const userCount = await prisma.user.count();





  const pendingOrders = await prisma.order.count({

    where:{
      status:"Bekliyor"
    }

  });








  const latestOrders = await prisma.order.findMany({

    orderBy:{
      createdAt:"desc"
    },


    take:5,


    select:{

      id:true,

      fullName:true,

      total:true,

      status:true,

      createdAt:true

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
max-w-7xl
">





<h1 className="
text-5xl
font-bold
">

Admin Paneli

</h1>









{/* Yönetim Menüleri */}

<div className="
mt-10
grid
gap-6
md:grid-cols-3
">





<div className="
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Ürün Yönetimi

</h2>


<p className="
mt-2
text-gray-400
">

Ürünleri ekle, düzenle ve yönet.

</p>


<div className="
mt-6
flex
flex-wrap
gap-3
">


<Link

href="/admin/products"

className="
rounded-full
border
border-[#c8a165]
px-5
py-3
text-[#c8a165]
"

>

Ürünler

</Link>



<Link

href="/admin/products/new"

className="
rounded-full
bg-[#c8a165]
px-5
py-3
font-bold
text-black
"

>

+ Ürün Ekle

</Link>


</div>


</div>










<div className="
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Sipariş Yönetimi

</h2>


<p className="
mt-2
text-gray-400
">

Siparişleri görüntüle ve durum güncelle.

</p>



<Link

href="/admin/orders"

className="
mt-6
inline-block
rounded-full
bg-[#c8a165]
px-6
py-3
font-bold
text-black
"

>

Siparişler

</Link>


</div>










<div className="
rounded-2xl
bg-[#181818]
p-8
">


<h2 className="
text-2xl
font-bold
">

Kullanıcı Yönetimi

</h2>


<p className="
mt-2
text-gray-400
">

Kullanıcıları görüntüle ve yönet.

</p>



<Link

href="/admin/users"

className="
mt-6
inline-block
rounded-full
bg-[#c8a165]
px-6
py-3
font-bold
text-black
"

>

Kullanıcılar

</Link>


</div>






</div>









{/* İstatistikler */}

<div className="
mt-10
grid
gap-6
md:grid-cols-2
xl:grid-cols-4
">







<div className="
rounded-2xl
bg-[#181818]
p-8
">


<p className="
text-gray-400
">

Toplam Satış

</p>


<h2 className="
mt-3
text-3xl
font-bold
text-[#c8a165]
">

₺
{
(
totalSales._sum.total ?? 0
).toLocaleString(
"tr-TR"
)
}

</h2>


</div>










<div className="
rounded-2xl
bg-[#181818]
p-8
">


<p className="
text-gray-400
">

Sipariş Sayısı

</p>


<h2 className="
mt-3
text-3xl
font-bold
">

{orderCount}

</h2>


</div>










<div className="
rounded-2xl
bg-[#181818]
p-8
">


<p className="
text-gray-400
">

Kullanıcı Sayısı

</p>


<h2 className="
mt-3
text-3xl
font-bold
">

{userCount}

</h2>


</div>










<div className="
rounded-2xl
bg-[#181818]
p-8
">


<p className="
text-gray-400
">

Bekleyen Sipariş

</p>


<h2 className="
mt-3
text-3xl
font-bold
text-yellow-400
">

{pendingOrders}

</h2>


</div>







</div>









{/* Son Siparişler */}

<section className="
mt-12
">


<div className="
mb-6
flex
items-center
justify-between
">


<h2 className="
text-3xl
font-bold
">

Son Siparişler

</h2>



<Link

href="/admin/orders"

className="
text-[#c8a165]
"

>

Tümünü Gör

</Link>


</div>








<div className="
space-y-4
">



{

latestOrders.map(order=>(


<div

key={order.id}

className="
rounded-2xl
bg-[#181818]
p-6
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
"

>


<div>


<h3 className="
text-xl
font-bold
">

Sipariş #{order.id}

</h3>


<p className="
text-gray-400
">

{order.fullName}

</p>


</div>







<div className="
flex
items-center
gap-8
">


<span className="
font-bold
text-[#c8a165]
">

₺
{
order.total.toLocaleString(
"tr-TR"
)
}

</span>



<span className={`font-bold ${statusStyle(order.status)}`}>

{order.status}

</span>



<Link

href={`/admin/orders/${order.id}`}

className="
rounded-full
border
border-[#c8a165]
px-5
py-2
text-[#c8a165]
"

>

Detay

</Link>



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