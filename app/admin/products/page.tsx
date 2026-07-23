import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import ToggleProductStatusButton from "@/components/ToggleProductStatusButton";


type AdminProduct = {

  id:number;

  name:string;

  slug:string;

  price:number;

  oldPrice?:number | null;

  image?:string | null;

  stock:number;

  category?:string | null;

  isActive:boolean;

};





export default async function AdminProductsPage(){


await requireAdmin();





const products =
await prisma.product.findMany({

  orderBy:{

    createdAt:"desc"

  }

});





const typedProducts = products as AdminProduct[];






return (

<main className="
min-h-screen
bg-[#111]
p-10
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
text-4xl
font-bold
">

Ürün Yönetimi

</h1>





<Link

href="/admin/products/new"

className="
rounded-full
bg-[#c8a165]
px-6
py-3
font-bold
text-black
"

>

+ Yeni Ürün

</Link>



</div>









<div className="
mt-10
overflow-hidden
rounded-2xl
bg-[#181818]
">





<table className="
w-full
text-left
">





<thead className="
border-b
border-[#333]
">


<tr>


<th className="p-5">
Ürün
</th>


<th>
Fiyat
</th>


<th>
Stok
</th>


<th>
Durum
</th>


<th>
İşlem
</th>


</tr>


</thead>








<tbody>


{


typedProducts.map((product:AdminProduct)=>(




<tr

key={product.id}

className="
border-b
border-[#333]
"

>







<td className="p-5">

{product.name}

</td>








<td>

₺
{
product.price.toLocaleString(
"tr-TR"
)
}

</td>









<td>


<div className="
flex
flex-col
gap-1
">



<span className="font-bold">

{product.stock} adet

</span>






{


product.stock === 0


?


<span className="
text-red-400
text-sm
">

Tükendi

</span>



:


product.stock <= 10


?


<span className="
text-yellow-400
text-sm
">

Az kaldı

</span>



:


<span className="
text-green-400
text-sm
">

Stokta

</span>



}



</div>


</td>









<td>


{


product.isActive


?


<span className="
font-semibold
text-green-400
">

🟢 Yayında

</span>



:


<span className="
font-semibold
text-red-400
">

🔴 Pasif

</span>



}



</td>









<td>


<div className="
flex
items-center
gap-4
">





<Link

href={`/admin/products/${product.id}`}

className="
text-[#c8a165]
"

>

Düzenle

</Link>







<ToggleProductStatusButton

id={product.id}

isActive={product.isActive}

/>







</div>


</td>








</tr>



))


}



</tbody>







</table>








</div>








</div>


</main>


);


}