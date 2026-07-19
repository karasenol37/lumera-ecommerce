import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";


export default async function ProductPage({

params,

}:{

params: Promise<{id:string}>

}){


const {id}=await params;



const product =
await prisma.product.findUnique({

where:{

id:Number(id)

},

include:{

images:true

}

});



if(!product){

notFound();

}



return (

<main

className="
min-h-screen
bg-[#0b0b0b]
px-6
py-16
text-white
"

>


<div

className="
mx-auto
max-w-7xl
grid
gap-10
md:grid-cols-2
"

>



<ProductGallery

mainImage={product.image}

name={product.name}

images={product.images}

/>





<div>


<p

className="
text-sm
tracking-[0.3em]
text-[#c8a165]
"

>

LUMERA COLLECTION

</p>



<div className="mt-5">


<ProductInfo

product={{

id:product.id,

name:product.name,

price:product.price,

image:product.image,

description:product.description,

material:product.material,

dimensions:product.dimensions,

stock:product.stock

}}

/>


</div>


</div>



</div>


</main>

);


}