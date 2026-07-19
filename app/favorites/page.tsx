"use client";

import Link from "next/link";
import { useFavorite } from "@/context/FavoriteContext";


export default function FavoritesPage(){


const {

favorites,

removeFavorite

}=useFavorite();



return (

<main

className="
min-h-screen
bg-[#111]
px-6
py-16
text-white
"

>


<div className="mx-auto max-w-7xl">


<h1

className="
mb-10
text-5xl
font-bold
"

>

Favorilerim

</h1>




{
favorites.length===0 ?


<div

className="
rounded-xl
bg-[#181818]
p-10
text-center
"

>

Henüz favori ürününüz yok.

</div>



:


<div

className="
grid
gap-8
md:grid-cols-3
lg:grid-cols-4
"

>


{

favorites.map(item=>(


<div

key={item.id}

className="
rounded-2xl
border
border-[#333]
bg-[#181818]
p-5
"

>


<Link href={`/product/${item.id}`}>

<img

src={item.image}

className="
h-64
w-full
rounded-xl
object-cover
"

/>


<h2

className="
mt-4
text-xl
font-bold
"

>

{item.name}

</h2>


</Link>



<p

className="
mt-3
text-[#c8a165]
"

>

₺{item.price.toLocaleString("tr-TR")}

</p>




<button

onClick={()=>removeFavorite(item.id)}

className="
mt-4
rounded-full
bg-red-600
px-4
py-2
text-sm
"

>

Favoriden Çıkar

</button>



</div>


))


}


</div>


}


</div>


</main>

)

}