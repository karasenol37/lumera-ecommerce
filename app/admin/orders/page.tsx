import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";


type OrderItem = {

  id:number;

  productId:number;

  quantity:number;

};



type AdminOrder = {

  id:number;

  status:string;

  total:number;

  createdAt:Date;

  fullName:string;

  phone:string;

  email:string;

  items:OrderItem[];

};





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







export default async function AdminOrdersPage(){


await requireAdmin();




const orders =
await prisma.order.findMany({

  orderBy:{

    createdAt:"desc"

  },


  include:{


    items:true


  }


});





const typedOrders = orders as AdminOrder[];







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





<div className="
flex
items-center
justify-between
">


<h1 className="
text-5xl
font-bold
">

Sipariş Yönetimi

</h1>





<Link

href="/admin"

className="
rounded-full
border
border-[#c8a165]
px-6
py-3
text-[#c8a165]
"

>

← Admin Panel

</Link>



</div>









<div className="
mt-10
space-y-6
">





{

typedOrders.length===0

?


<div className="
rounded-2xl
bg-[#181818]
p-10
text-center
text-gray-400
">

Henüz sipariş bulunmuyor.

</div>


:


typedOrders.map((order:AdminOrder)=>(



<div

key={order.id}

className="
rounded-2xl
bg-[#181818]
p-8
"

>




<div className="
flex
flex-col
gap-6
lg:flex-row
lg:items-center
lg:justify-between
">





<div>


<h2 className="
text-2xl
font-bold
">

Sipariş #{order.id}

</h2>



<p className="
mt-2
text-gray-400
">

{order.fullName}

</p>




<p className="
text-gray-400
">

{order.phone}

</p>




<p className="
text-gray-400
">

{order.email}

</p>




<p className="
text-gray-400
">

{
new Date(order.createdAt)
.toLocaleDateString("tr-TR")
}

</p>




</div>









<div className="
flex
flex-col
gap-3
text-right
">





<p className="
text-2xl
font-bold
text-[#c8a165]
">

₺
{
order.total.toLocaleString("tr-TR")
}

</p>






<p

className={`
font-bold
${statusStyle(order.status)}
`}

>

{order.status}

</p>






<Link

href={`/admin/orders/${order.id}`}

className="
rounded-full
border
border-[#c8a165]
px-6
py-3
text-center
text-[#c8a165]
"

>

Sipariş Detayı

</Link>




</div>





</div>









<div className="
mt-6
border-t
border-[#333]
pt-6
">





<p className="
mb-3
font-semibold
">

Ürünler

</p>







<div className="
flex
flex-wrap
gap-3
">





{

order.items.map((item:OrderItem)=>(



<span

key={item.id}

className="
rounded-full
bg-[#222]
px-4
py-2
text-sm
text-gray-300
"

>

Ürün ID: {item.productId}

× {item.quantity}

</span>



))


}






</div>





</div>







</div>





))


}







</div>






</div>


</main>


);


}