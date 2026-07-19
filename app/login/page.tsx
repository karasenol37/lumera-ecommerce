"use client";

import { useState } from "react";
import { loginUser } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";


export default function LoginPage(){


const router = useRouter();


const [form,setForm]=useState({

email:"",
password:""

});


const [loading,setLoading]=useState(false);



function change(
e:React.ChangeEvent<HTMLInputElement>
){

setForm({

...form,

[e.target.name]:e.target.value

});

}



async function submit(
e:React.FormEvent
){

e.preventDefault();


setLoading(true);



const result =
await loginUser(form);



if(!result.success){

alert(result.message);

setLoading(false);

return;

}



router.push("/");


}





return (

<main className="
min-h-screen
bg-[#111]
px-6
py-20
text-white
">


<div className="
mx-auto
max-w-md
rounded-2xl
bg-[#181818]
p-8
">


<h1 className="text-4xl font-bold">
Giriş Yap
</h1>



<form
onSubmit={submit}
className="mt-8 space-y-5"
>


<input

name="email"

placeholder="E-posta"

value={form.email}

onChange={change}

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>



<input

name="password"

type="password"

placeholder="Şifre"

value={form.password}

onChange={change}

className="
w-full
rounded-xl
bg-[#222]
p-4
"

/>



<button

disabled={loading}

className="
w-full
rounded-full
bg-[#c8a165]
py-4
font-bold
text-black
"

>

{
loading
?
"Giriş yapılıyor..."
:
"Giriş Yap"
}

</button>



</form>


</div>


</main>

)

}