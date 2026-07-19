"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function AdminLoginPage() {

  const router = useRouter();


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);



  async function handleSubmit(
    e: React.FormEvent
  ){

    e.preventDefault();

    setLoading(true);
    setError("");


    const res = await fetch(
      "/api/admin/login",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },

        body:JSON.stringify({
          email,
          password,
        }),
      }
    );


    if(res.ok){

      router.push("/admin");

    }

    else{

      setError(
        "E-posta veya şifre hatalı"
      );

    }


    setLoading(false);

  }




return (

<main

className="
min-h-screen
flex
items-center
justify-center
bg-[#0b0b0b]
px-6
"


>


<form

onSubmit={handleSubmit}

className="
w-full
max-w-md
rounded-2xl
border
border-[#2b2b2b]
bg-[#151515]
p-10
shadow-2xl
"


>


<div className="text-center mb-10">


<h1

className="
text-4xl
font-bold
tracking-wide
text-white
"

>

LUMERA

</h1>


<p

className="
mt-2
text-sm
text-[#c8a165]
"

>

Admin Panel

</p>


</div>




<label className="
mb-2
block
text-sm
text-gray-300
">

E-posta

</label>


<input

type="email"

placeholder="admin@lumera.com"

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

className="
mb-5
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
text-white
placeholder:text-gray-600
outline-none
focus:border-[#c8a165]
"

/>





<label className="
mb-2
block
text-sm
text-gray-300
">

Şifre

</label>


<input

type="password"

placeholder="••••••••"

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

className="
mb-5
w-full
rounded-lg
border
border-[#333]
bg-[#0f0f0f]
px-4
py-3
text-white
placeholder:text-gray-600
outline-none
focus:border-[#c8a165]
"

/>





{
error && (

<p

className="
mb-5
text-sm
text-red-400
"

>

{error}

</p>

)

}




<button

disabled={loading}

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

{

loading
?
"Giriş yapılıyor..."
:
"Giriş Yap"

}


</button>



</form>


</main>

);


}