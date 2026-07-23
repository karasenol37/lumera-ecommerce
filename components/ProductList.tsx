import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/services/productService";
type ProductItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  stock: boolean | number;
  image?: string | null;
};

type ProductListProps = {

  category?: string;

  sort?: string;

};



export default async function ProductList({

  category,

  sort,

}:ProductListProps){



const products = await getProducts({

  category,

  sort,

});





return (

<section

id="urunler"

className="
mx-auto
max-w-7xl
px-6
py-20
"

>



<div className="
mb-12
flex
items-end
justify-between
"

>


<div>


<p className="
text-sm
tracking-[0.35em]
text-[#c8a165]
">

LUMERA COLLECTION

</p>



<h2 className="
mt-3
text-4xl
font-bold
text-white
">

Premium Koleksiyon

</h2>



<p className="
mt-3
text-gray-400
">

Bahçeniz için özel tasarım dış mekan ürünleri

</p>



</div>



</div>







<div

className="
grid
gap-8
md:grid-cols-2
lg:grid-cols-4
"

>



{

products.length===0 ?



<div className="
col-span-full
rounded-2xl
bg-[#181818]
p-10
text-center
text-gray-400
">

Henüz ürün bulunamadı.

</div>



:



products.map((product: ProductItem)=>(


<ProductCard

key={product.id}

id={product.id}

slug={product.slug}

name={product.name}

price={product.price}

oldPrice={product.oldPrice ?? 0}


stock={product.stock ? 1 : 0}


image={product.image || "/images/no-image.png"}

/>


))


}




</div>





</section>


);


}