"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


export default function EditProductPage(){


const router = useRouter();

const params = useParams();

const id = params.id;



const [loading,setLoading] =
useState(true);



const [form,setForm] =
useState({

name:"",
slug:"",
category:"",
price:"",
oldPrice:"",
description:"",
material:"",
dimensions:"",
stock:"",

});



const [mainImage,setMainImage] =
useState<File | null>(null);



const [gallery,setGallery] =
useState<File[]>([]);







useEffect(()=>{


async function loadProduct(){


const res =
await fetch(
`/api/admin/products/${id}`
);



const data =
await res.json();




setForm({

name:data.product.name,

slug:data.product.slug,

category:data.product.category,

price:String(data.product.price),

oldPrice:String(data.product.oldPrice),

description:data.product.description,

material:data.product.material,

dimensions:data.product.dimensions,

stock:String(data.product.stock),

});



setLoading(false);


}



loadProduct();


},[id]);









function handleChange(
e:React.ChangeEvent<
HTMLInputElement | HTMLTextAreaElement
>
){


setForm({

...form,

[e.target.name]:
e.target.value

});


}








function handleMainImage(
e:React.ChangeEvent<HTMLInputElement>
){


if(e.target.files?.[0]){

setMainImage(
e.target.files[0]
);

}


}








function handleGallery(
e:React.ChangeEvent<HTMLInputElement>
){


if(e.target.files){

setGallery(
Array.from(e.target.files)
);

}


}









async function handleSubmit(
e:React.FormEvent
){


e.preventDefault();



const formData =
new FormData();





Object.entries(form)
.forEach(([key,value])=>{


formData.append(
key,
value
);


});






if(mainImage){

formData.append(
"mainImage",
mainImage
);

}







gallery.forEach(file=>{


formData.append(
"gallery",
file
);


});







const res =
await fetch(

`/api/admin/products/${id}`,

{

method:"PUT",

body:formData

}

);







if(res.ok){

router.push(
"/admin/products"
);

}


}









if(loading){

return (

<div className="
min-h-screen
bg-[#111]
p-10
text-white
">

Yükleniyor...

</div>

);

}








return (

<main className="
min-h-screen
bg-[#111]
p-10
text-white
">


<div className="
mx-auto
max-w-3xl
">



<h1 className="
text-4xl
font-bold
">

Ürün Düzenle

</h1>








<form

onSubmit={handleSubmit}

className="
mt-10
space-y-6
rounded-2xl
bg-[#181818]
p-8
"

>





<input

name="name"

value={form.name}

onChange={handleChange}

placeholder="Ürün adı"

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>







<input

name="slug"

value={form.slug}

onChange={handleChange}

placeholder="Slug"

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>







<input

name="category"

value={form.category}

onChange={handleChange}

placeholder="Kategori"

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>







<div className="
grid
gap-5
md:grid-cols-3
">


<input

name="price"

type="number"

value={form.price}

onChange={handleChange}

placeholder="Fiyat"

className="
rounded-xl
bg-[#222]
p-4
"

/>



<input

name="oldPrice"

type="number"

value={form.oldPrice}

onChange={handleChange}

placeholder="Eski fiyat"

className="
rounded-xl
bg-[#222]
p-4
"

/>




<input

name="stock"

type="number"

value={form.stock}

onChange={handleChange}

placeholder="Stok adedi"

className="
rounded-xl
bg-[#222]
p-4
"

/>



</div>









<textarea

name="description"

value={form.description}

onChange={handleChange}

placeholder="Açıklama"

rows={5}

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>







<input

name="material"

value={form.material}

onChange={handleChange}

placeholder="Materyal"

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>







<input

name="dimensions"

value={form.dimensions}

onChange={handleChange}

placeholder="Ölçüler"

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>









<label>

Yeni Ana Görsel

</label>


<input

type="file"

accept="image/*"

onChange={handleMainImage}

/>









<label>

Yeni Galeri Görselleri

</label>


<input

type="file"

multiple

accept="image/*"

onChange={handleGallery}

/>









<button

className="
w-full
rounded-full
bg-[#c8a165]
py-4
font-bold
text-black
"

>

Güncelle

</button>







</form>



</div>


</main>

);


}