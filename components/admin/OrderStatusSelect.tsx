"use client";

import { useRouter } from "next/navigation";



export default function OrderStatusSelect({

id,

status

}:{

id:number;

status:string;

}){


const router =
useRouter();





async function changeStatus(
e:React.ChangeEvent<HTMLSelectElement>
){



await fetch(

`/api/admin/orders/${id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

status:e.target.value

})

}

);




router.refresh();


}







return (

<select

defaultValue={status}

onChange={changeStatus}

className="
rounded-xl
bg-[#222]
px-4
py-3
text-white
outline-none
"

>

<option>
Bekliyor
</option>

<option>
Hazırlanıyor
</option>

<option>
Kargoda
</option>

<option>
Tamamlandı
</option>

<option>
İptal
</option>


</select>

)

}