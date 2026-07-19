"use client";

import { useRouter } from "next/navigation";


export default function ToggleProductStatusButton({

id,
isActive

}:{

id:number;

isActive:boolean;

}){


const router = useRouter();




async function handleToggle(){


const action =
isActive
?
"pasife almak"
:
"yayına almak";



const confirmAction =
confirm(
`Bu ürünü ${action} istediğinize emin misiniz?`
);



if(!confirmAction){

return;

}





const res =
await fetch(
`/api/admin/products/${id}/status`,
{

method:"PATCH",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

isActive:!isActive

})

}

);





if(res.ok){

router.refresh();

}


}





return (

<button

onClick={handleToggle}

className={`
ml-4
rounded-full
px-4
py-2
text-sm
font-semibold
text-white

${
isActive

?

"bg-red-600 hover:bg-red-700"

:

"bg-green-600 hover:bg-green-700"

}

`}

>


{
isActive
?
"Pasife Al"
:
"Yayına Al"
}


</button>

);


}