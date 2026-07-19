import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";


async function createProduct(
  formData: FormData
) {

  "use server";


  const name =
    formData.get("name") as string;



  const slug =
    name
      .toLocaleLowerCase("tr-TR")
      .replaceAll(" ", "-")
      .replaceAll("ı", "i")
      .replaceAll("ş", "s")
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c");



  const gallery =
    formData.getAll("gallery") as string[];



  const image =
    formData.get("image") as string;



  const product =
    await prisma.product.create({

      data: {

        name,

        slug,


        category:
          formData.get("category") as string,


        price:
          Number(
            formData.get("price") || 0
          ),


        oldPrice:
          Number(
            formData.get("oldPrice") || 0
          ),


        

        stock:
          Number(
            formData.get("stock") || 0
          ),


        image,


        description:
          formData.get("description") as string,


        material:
          formData.get("material") as string,


        dimensions:
          formData.get("dimensions") as string,

      }

    });




  if(gallery.length > 0){

    await prisma.productImage.createMany({

      data:

      gallery.map((url)=>({

        url,

        productId:
          product.id

      }))

    });

  }



  redirect("/admin");

}






export default async function NewProductPage(){


const session =
await getSession();



if(!session){

redirect("/admin/login");

}



return (

<main className="
min-h-screen
bg-[#0b0b0b]
px-6
py-12
text-white
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

Yeni Ürün Ekle

</h1>




<form

action={createProduct}

className="
space-y-6
rounded-xl
border
border-[#2b2b2b]
bg-[#151515]
p-8
"

>



<input

name="name"

placeholder="Ürün adı"

required

className="
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
"

/>





<input

name="category"

placeholder="Kategori"

required

className="
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
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

placeholder="Satış fiyatı"

required

className="
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
"

/>



<input

name="oldPrice"

type="number"

placeholder="Eski fiyat"

className="
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
"

/>



</div>





<div>


<p className="
mb-2
text-gray-300
">

Ana Görsel

</p>


<ImageUpload

name="image"

/>


</div>





<div>


<p className="
mb-2
mt-5
text-gray-300
">

Galeri Görselleri

</p>


<ImageUpload

name="gallery"

multiple

/>


</div>





<textarea

name="description"

placeholder="Ürün açıklaması"

required

className="
h-32
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
"

/>





<input

name="material"

placeholder="Materyal"

className="
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
"

/>





<input

name="dimensions"

placeholder="Ölçüler"

className="
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
"

/>





<input

name="stock"

type="number"

placeholder="Stok adedi"

defaultValue="10"

min="0"

className="
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
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
font-semibold
text-black
transition
hover:bg-[#d6b47c]
"

>

Ürünü Kaydet

</button>



</form>


</div>


</main>

);


}