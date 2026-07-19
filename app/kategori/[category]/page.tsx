import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";



export default async function CategoryPage({

params,

}:{

params: Promise<{
category:string
}>

}){



const {category}=await params;



const decodedCategory =
decodeURIComponent(category);





const products =
await prisma.product.findMany({

where:{

category:decodedCategory,

isActive:true,

},

orderBy:{

createdAt:"desc"

}

});






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


<div

className="
mx-auto
max-w-7xl
"

>



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
text-5xl
font-bold
"

>

{decodedCategory}

</h1>






<div

className="
mt-12
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
"

>


{

products.length === 0 ?



<div

className="
col-span-full
rounded-xl
bg-[#181818]
p-10
text-center
text-gray-400
"

>

Bu kategoride ürün bulunamadı.

</div>



:



products.map(product=>(


<ProductCard

key={product.id}

id={product.id}

slug={product.slug}

name={product.name}

price={product.price}

oldPrice={product.oldPrice}

stock={product.stock}

image={product.image}


/>


))


}



</div>



</div>



</main>


);


}