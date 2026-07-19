import Link from "next/link";
import { getSessionUser, logout } from "@/lib/actions/session";


export default async function UserMenu(){


const user = await getSessionUser();



if(!user){

return (

<Link

href="/login"

className="
text-sm
hover:text-[#c8a165]
"

>

Giriş Yap

</Link>

)

}




return (

<div className="
flex
items-center
gap-4
text-sm
">


<span>

Merhaba, {user.name}

</span>


<Link

href="/account"

className="
hover:text-[#c8a165]
"

>

Hesabım

</Link>



<form action={logout}>

<button

className="
hover:text-red-400
"

>

Çıkış

</button>


</form>


</div>

)


}