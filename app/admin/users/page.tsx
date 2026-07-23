import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import UserActions from "@/components/admin/UserActions";


type AdminUser = {

  id:number;

  name:string | null;

  email:string;

  role:string | null;

  createdAt:Date;

};





export default async function AdminUsersPage(){



const user =
await getSessionUser();





if(!user || user.role !== "ADMIN"){

  redirect("/");

}








const users =
await prisma.user.findMany({

  orderBy:{

    createdAt:"desc"

  },


  select:{


    id:true,

    name:true,

    email:true,

    role:true,

    createdAt:true,


  }


});





const typedUsers = users as AdminUser[];






return (


<main className="
min-h-screen
bg-[#111]
p-10
text-white
">


<div className="
mx-auto
max-w-7xl
">





<h1 className="
mb-10
text-4xl
font-bold
">

Kullanıcı Yönetimi

</h1>







<div className="
overflow-hidden
rounded-2xl
border
border-[#2b2b2b]
bg-[#181818]
">





<table className="
w-full
text-left
">





<thead className="
border-b
border-[#333]
text-gray-400
">



<tr>


<th className="p-5">
Ad
</th>


<th className="p-5">
E-posta
</th>


<th className="p-5">
Rol
</th>


<th className="p-5">
Kayıt
</th>


<th className="p-5">
İşlem
</th>


</tr>


</thead>









<tbody>





{


typedUsers.map((item:AdminUser)=>(



<tr

key={item.id}

className="
border-b
border-[#222]
"

>





<td className="p-5 font-semibold">

{item.name ?? "-"}

</td>







<td className="p-5 text-gray-300">

{item.email}

</td>








<td className="p-5">



<span className="
rounded-full
bg-[#c8a165]
px-4
py-2
text-sm
font-bold
text-black
">

{item.role ?? "USER"}

</span>



</td>









<td className="p-5 text-gray-400">


{

new Date(item.createdAt)

.toLocaleDateString(
"tr-TR"
)

}


</td>









<td className="p-5">


<UserActions

id={item.id}

role={item.role ?? "USER"}

/>


</td>







</tr>



))


}





</tbody>






</table>






</div>







</div>


</main>


);


}