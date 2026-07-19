import Link from "next/link";
import { getFavorites } from "@/lib/actions/favorite";
import { notFound } from "next/navigation";


export default async function FavoritesPage(){


const favorites =
await getFavorites();




return (

<main

className="
min-h-screen
bg-[#0b0b0b]
px-6
py-20
text-white
"

>


<div className="
mx-auto
max-w-7xl
">


<p

className="
text-sm
tracking-[0.3em]
text-[#c8a165]
"

>

LUMERA COLLECTION

</p>



<h1

className="
mt-4
text-4xl
font-bold
"

>

Favorilerim

</h1>





{
favorites.length === 0

?

<div

className="
mt-10
rounded-2xl
bg-[#181818]
p-10
text-center
text-gray-400
"

>

Henüz favori ürününüz bulunmuyor.

<br />

<Link

href="/"

className="
mt-5
inline-block
text-[#c8a165]
hover:underline
"

>

Ürünlere göz at

</Link>


</div>


:


<div

className="
mt-10
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
"

>


{

favorites.map((item)=>(


<div

key={item.id}

className="
overflow-hidden
rounded-2xl
border
border-[#2b2b2b]
bg-[#151515]
"

>


<div

className="
h-64
overflow-hidden
"

>


<img

src={item.product.image}

alt={item.product.name}

className="
h-full
w-full
object-cover
"

 />


</div>





<div className="p-5">


<h2

className="
text-xl
font-semibold
"

>

{item.product.name}

</h2>




<p

className="
mt-3
text-2xl
font-bold
text-[#c8a165]
"

>

₺{item.product.price.toLocaleString("tr-TR")}

</p>




<Link

href={`/product/${item.product.id}`}

className="
mt-5
inline-block
text-sm
text-[#c8a165]
hover:underline
"

>

Ürünü İncele →

</Link>



</div>



</div>


))


}


</div>


}


</div>


</main>


);

}