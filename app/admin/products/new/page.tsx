"use client";

import { useState } from "react";
import { createProduct } from "@/lib/actions/product";
import { useRouter } from "next/navigation";



export default function NewProductPage(){


  const router = useRouter();



  const [loading,setLoading] = useState(false);




  const [form,setForm] = useState({

    name:"",
    category:"",
    price:"",
    oldPrice:"",
    description:"",
    material:"",
    dimensions:"",
    stock:"",

  });





  const [mainImage,setMainImage] = useState<File | null>(null);


  const [galleryImages,setGalleryImages] = useState<File[]>([]);









  function handleChange(
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ){

    setForm({

      ...form,

      [e.target.name]:e.target.value,

    });


  }







  function handleGalleryChange(
    e:React.ChangeEvent<HTMLInputElement>
  ){

    if(e.target.files){

      setGalleryImages(
        Array.from(e.target.files)
      );

    }

  }








  async function handleSubmit(
    e:React.FormEvent
  ){

    e.preventDefault();


    if(!mainImage){

      alert(
        "Ana resim seçmelisiniz."
      );

      return;

    }



    try{


      setLoading(true);




      const formData = new FormData();



      Object.entries(form).forEach(([key,value])=>{

        formData.append(
          key,
          value
        );

      });





      formData.append(
        "mainImage",
        mainImage
      );





      galleryImages.forEach(image=>{

        formData.append(
          "images",
          image
        );

      });







      await createProduct(
        formData
      );





      router.push(
        "/admin/products"
      );



    }


    catch(error){

      console.error(error);

      alert(
        "Ürün eklenirken hata oluştu."
      );


    }


    finally{

      setLoading(false);

    }


  }









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
max-w-5xl
">





<h1 className="
text-5xl
font-bold
">

Yeni Ürün Ekle

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





<div className="
grid
gap-6
md:grid-cols-2
">





<input

name="name"

placeholder="Ürün adı"

value={form.name}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="category"

placeholder="Kategori"

value={form.category}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="price"

type="number"

placeholder="Fiyat"

value={form.price}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="oldPrice"

type="number"

placeholder="Eski fiyat"

value={form.oldPrice}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="stock"

type="number"

placeholder="Stok Adedi"

value={form.stock}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>







<input

name="material"

placeholder="Materyal"

value={form.material}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








</div>








<input

name="dimensions"

placeholder="Ölçüler"

value={form.dimensions}

onChange={handleChange}

className="
w-full
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<textarea

name="description"

placeholder="Açıklama"

value={form.description}

onChange={handleChange}

rows={5}

className="
w-full
rounded-xl
bg-[#222]
p-4
outline-none
"

/>









<div>


<label className="
mb-2
block
text-gray-400
">

Ana Resim

</label>


<input

type="file"

accept="image/*"

onChange={(e)=>{

if(e.target.files){

setMainImage(
e.target.files[0]
);

}

}}

className="
text-sm
"

/>


</div>








<div>


<label className="
mb-2
block
text-gray-400
">

Galeri Resimleri

</label>


<input

type="file"

multiple

accept="image/*"

onChange={handleGalleryChange}

className="
text-sm
"

/>


</div>









<button

disabled={loading}

className="
w-full
rounded-full
bg-[#c8a165]
py-4
font-bold
text-black
disabled:opacity-50
"

>


{

loading

?

"Kaydediliyor..."

:

"Ürünü Kaydet"

}


</button>







</form>







</div>

</main>

);


}