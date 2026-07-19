"use client";

import { useRouter } from "next/navigation";


export default function DeleteProductButton({
  id
}:{
  id:number
}){


const router = useRouter();




async function handleDelete(){


const confirmDelete =
confirm(
"Bu ürünü pasife almak istediğinize emin misiniz?"
);



if(!confirmDelete){

  return;

}





const res =
await fetch(
`/api/admin/products/${id}`,
{
  method:"DELETE"
}
);





if(res.ok){

  router.refresh();

}



}





return (

<button

onClick={handleDelete}

className="
ml-4
rounded-full
bg-red-600
px-4
py-2
text-sm
font-semibold
text-white
hover:bg-red-700
"

>

Pasife Al

</button>

);


}