import Link from "next/link";
import { formatPrice } from "@/lib/format";
import FavoriteButton from "./FavoriteButton";

type ProductCardProps = {

  id:number;

  slug:string;

  name:string;

  price:number;

  oldPrice:number;


  stock:number;

  image:string;

};



export default function ProductCard({

  id,
  slug,
  name,
  price,
  oldPrice,
  stock,
  image,

}:ProductCardProps){



const discount =
oldPrice > price
?
Math.round(
((oldPrice-price)/oldPrice)*100
)
:
0;



return (

<div

className="
group
relative
overflow-hidden
rounded-2xl
border
border-[#2b2b2b]
bg-[#151515]
transition-all
duration-500
hover:-translate-y-2
hover:border-[#c8a165]
hover:shadow-2xl
"

>


{/* Rozetler */}

<div
className="
absolute
left-4
top-4
z-10
flex
flex-col
gap-2
"
>


{
discount > 0 && (

<span

className="
rounded-full
bg-[#c8a165]
px-3
py-1
text-xs
font-bold
text-black
"

>

-%{discount}

</span>

)

}



<span
className={`
rounded-full
px-3
py-1
text-xs
font-semibold

${
stock > 0
? "bg-green-600 text-white"
: "bg-red-600 text-white"
}
`}
>

{
stock > 0
? `Stok: ${stock}`
: "Tükendi"
}

</span>



</div>





{/* Favori */}

<FavoriteButton

id={id}

name={name}

price={price}

image={image}

/>





{/* Görsel */}

<Link href={`/product/${id}`}>

<div

className="
relative
h-72
overflow-hidden
bg-[#0d0d0d]
"

>


<img

src={
image || "/images/no-image.jpg"
}

alt={name}

className="
h-full
w-full
object-cover
transition
duration-700
group-hover:scale-110
"

/>



<div

className="
absolute
inset-0
flex
items-center
justify-center
bg-black/0
transition
group-hover:bg-black/30
"

>


<span

className="
translate-y-5
rounded-full
border
border-[#c8a165]
px-5
py-2
text-sm
text-white
opacity-0
transition
duration-500
group-hover:translate-y-0
group-hover:opacity-100
"

>

Ürünü İncele

</span>


</div>


</div>


</Link>







{/* Bilgi */}

<div

className="
p-6
text-white
"

>


<Link href={`/product/${id}`}>

<h3

className="
line-clamp-2
text-xl
font-semibold
transition
hover:text-[#c8a165]
"

>

{name}

</h3>


</Link>




<div

className="
mt-3
text-sm
text-yellow-400
"

>

⭐ 

</div>





<div className="mt-4">


<span

className="
text-2xl
font-bold
text-[#c8a165]
"

>

{formatPrice(price)}

</span>



{
oldPrice > price && (

<span

className="
ml-3
text-sm
text-gray-500
line-through
"

>

{formatPrice(oldPrice)}

</span>

)

}


</div>





<div className="mt-5 flex items-center justify-between">


<p

className="
text-sm
text-gray-400
"

>

Premium Koleksiyon

</p>


<Link

href={`/product/${id}`}

className="
text-sm
text-[#c8a165]
hover:underline
"

>

Detay →

</Link>



</div>



</div>


</div>


)

}