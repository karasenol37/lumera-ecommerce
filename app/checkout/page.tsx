"use client";

import PaymentButton from "@/components/PaymentButton";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from "next/link";


export default function CheckoutPage() {


  const { cart } = useCart();


  const [form, setForm] = useState({

    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",

  });





  const total = cart.reduce(

    (sum, item) =>
      sum + item.price * item.quantity,

    0

  );



  const cargo = total >= 750 ? 0 : 150;


  const grandTotal = total + cargo;






  function handleChange(

    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >

  ) {


    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });


  }







return (


<main className="
min-h-screen
bg-[#111111]
px-6
py-16
text-white
">


<div className="
mx-auto
max-w-7xl
">





<h1 className="
mb-12
text-5xl
font-bold
">

Teslimat Bilgileri

</h1>







<div className="
grid
gap-10
lg:grid-cols-3
">







{/* FORM */}


<form

className="
lg:col-span-2
rounded-2xl
bg-[#181818]
p-8
"

>



<div className="
grid
gap-6
md:grid-cols-2
">





<input

name="fullName"

placeholder="Ad Soyad"

value={form.fullName}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="phone"

placeholder="Telefon"

value={form.phone}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="email"

placeholder="E-posta"

value={form.email}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="city"

placeholder="İl"

value={form.city}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="district"

placeholder="İlçe"

value={form.district}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>








<input

name="postalCode"

placeholder="Posta Kodu"

value={form.postalCode}

onChange={handleChange}

className="
rounded-xl
bg-[#222]
p-4
outline-none
"

/>





</div>









<textarea

name="address"

placeholder="Açık Adres"

value={form.address}

onChange={handleChange}

rows={5}

className="
mt-6
w-full
rounded-xl
bg-[#222]
p-4
outline-none
"

/>







<div className="
mt-8
">

<PaymentButton

buyer={form}

/>

</div>






</form>









{/* SİPARİŞ ÖZETİ */}



<div className="
h-fit
rounded-2xl
bg-[#181818]
p-8
">





<h2 className="
text-3xl
font-bold
">

Sipariş Özeti

</h2>







<div className="
mt-8
space-y-5
">


{

cart.map(item => (


<div

key={item.id}

className="
flex
justify-between
text-sm
"

>


<div>

<p>

{item.name}

</p>


<p className="
text-gray-500
">

{item.quantity} adet

</p>


</div>





<span>

₺
{(
item.price *
item.quantity

).toLocaleString("tr-TR")}

</span>





</div>



))


}



</div>









<hr className="
my-6
border-[#333]
"/>









<div className="
space-y-4
">





<div className="
flex
justify-between
">

<span>

Ara Toplam

</span>


<span>

₺{total.toLocaleString("tr-TR")}

</span>


</div>









<div className="
flex
justify-between
">


<span>

Kargo

</span>


{

cargo === 0 ? (


<span className="
text-green-400
">

Ücretsiz

</span>


)

:

(


<span>

₺{cargo.toLocaleString("tr-TR")}

</span>


)

}


</div>









<div className="
flex
justify-between
text-2xl
font-bold
">


<span>

Toplam

</span>



<span className="
text-[#c8a165]
">

₺{grandTotal.toLocaleString("tr-TR")}

</span>



</div>






</div>









<Link

href="/cart"

className="
mt-8
block
text-center
text-sm
text-gray-400
hover:text-white
"

>

← Sepete Dön

</Link>








</div>








</div>






</div>


</main>


);


}