"use client";


import { useState } from "react";
import { useCart } from "@/context/CartContext";


type Product = {

id:number;

name:string;

price:number;

rating:number;

image:string;

description:string;

material:string;

dimensions:string;

images:{
id:number;
url:string;
}[];

};



export default function ProductDetailClient({

product

}:{

product:Product;

}){


const {addToCart}=useCart();



const [activeImage,setActiveImage]=useState(

product.image

);



function handleAdd(){

addToCart({

id:product.id,

name:product.name,

price:product.price,

image:product.image

});


alert(
"Ürün sepete eklendi"
);


}



const gallery=[

{
id:0,
url:product.image
},

...product.images

];



return (

<main className="
min-h-screen
bg-[#0b0b0b]
px-6
py-16
text-white
">


<div className="
mx-auto
max-w-7xl
grid
gap-10
md:grid-cols-2
">



<div>


<div className="
h-[500px]
overflow-hidden
rounded-xl
bg-[#151515]
">


<img

src={activeImage}

alt={product.name}

className="
h-full
w-full
object-cover
"

/>


</div>




<div className="
mt-5
flex
gap-3
flex-wrap
">


{

gallery.map((img)=>(


<button

key={img.id}

onClick={()=>setActiveImage(img.url)}

>


<img

src={img.url}

className="
h-20
w-20
rounded-lg
object-cover
border
border-[#333]
"

/>


</button>


))

}


</div>


</div>





<div>


<h1 className="
text-4xl
font-bold
">

{product.name}

</h1>



<div className="
mt-4
text-yellow-400
">

⭐ {product.rating}

</div>



<p className="
mt-6
text-3xl
font-bold
text-[#c8a165]
">

₺
{product.price.toLocaleString("tr-TR")}

</p>



<p className="
mt-8
leading-7
text-gray-300
">

{product.description}

</p>



<div className="
mt-8
space-y-3
text-gray-300
">


<p>

<strong>
Materyal:
</strong>

{" "}

{product.material}

</p>



<p>

<strong>
Ölçüler:
</strong>

{" "}

{product.dimensions}

</p>


</div>




<button

onClick={handleAdd}

className="
mt-10
rounded-lg
bg-[#c8a165]
px-10
py-4
font-semibold
text-black
hover:bg-[#d6b47c]
"

>

Sepete Ekle

</button>



</div>



</div>



</main>

);


}