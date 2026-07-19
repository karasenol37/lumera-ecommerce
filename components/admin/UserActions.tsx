"use client";

import { useRouter } from "next/navigation";



export default function UserActions({

id,

role

}:{

id:number;

role:string;

}){


const router =
useRouter();





async function changeRole(
e:React.ChangeEvent<HTMLSelectElement>
){


await fetch(

`/api/admin/users/${id}`,

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

role:e.target.value

})

}

);



router.refresh();


}







async function deleteUser(){


const confirmDelete =
confirm(
"Kullanıcı silinsin mi?"
);



if(!confirmDelete){

return;

}



await fetch(

`/api/admin/users/${id}`,

{

method:"DELETE"

}

);



router.refresh();


}






return (

<div className="
flex
items-center
gap-3
">


<select

defaultValue={role}

onChange={changeRole}

className="
rounded-lg
bg-[#222]
px-3
py-2
"

>

<option>
CUSTOMER
</option>

<option>
ADMIN
</option>


</select>






<button

onClick={deleteUser}

className="
rounded-lg
bg-red-600
px-4
py-2
text-sm
font-bold
"

>

Sil

</button>


</div>

)

}