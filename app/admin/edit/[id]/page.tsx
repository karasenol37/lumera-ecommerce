import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";


export default async function EditProductPage({

params

}:{

params:Promise<{id:string}>

}){


const session =
await getSession();



if(!session){

redirect("/admin/login");

}



const {id}=await params;



const product =
await prisma.product.findUnique({

where:{
id:Number(id)
}

});



if(!product){

return (

<div className="p-10">

Ürün bulunamadı

</div>

);

}



return (

<main className="
min-h-screen
bg-[#0b0b0b]
text-white
px-6
py-12
">


<div className="
mx-auto
max-w-3xl
">


<h1 className="
mb-10
text-4xl
font-bold
">

Ürün Düzenle

</h1>




<form

action={async(formData)=>{

"use server";



await prisma.product.update({

where:{
id:product.id
},


data:{


name:
formData.get("name") as string,


category:
formData.get("category") as string,


price:
Number(formData.get("price")),


oldPrice:
Number(formData.get("oldPrice")),


description:
formData.get("description") as string,


material:
formData.get("material") as string,


dimensions:
formData.get("dimensions") as string,

}

});



redirect("/admin");


}}


className="
space-y-5
rounded-xl
border
border-[#333]
bg-[#151515]
p-8
"

>


<input

name="name"

defaultValue={product.name}

className="
w-full
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>





<input

name="category"

defaultValue={product.category}

className="
w-full
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>





<div className="
grid
grid-cols-2
gap-4
">


<input

name="price"

type="number"

defaultValue={product.price}

className="
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>



<input

name="oldPrice"

type="number"

defaultValue={product.oldPrice}

className="
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>


</div>





<textarea

name="description"

defaultValue={product.description}

className="
h-32
w-full
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>





<input

name="material"

defaultValue={product.material}

className="
w-full
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>





<input

name="dimensions"

defaultValue={product.dimensions}

className="
w-full
rounded-lg
bg-[#0f0f0f]
border
border-[#333]
px-4
py-3
"

/>




<button

className="
w-full
rounded-lg
bg-[#c8a165]
py-3
font-bold
text-black
"

>

Kaydet

</button>




</form>


</div>


</main>

);


}