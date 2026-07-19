"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { logout } from "@/lib/actions/session";
import { useRouter } from "next/navigation";


type User = {
  id:number;
  name:string;
  email:string;
  role:string;
};


type HeaderProps = {

  search:string;

  setSearch:React.Dispatch<
    React.SetStateAction<string>
  >;

  user:User | null;

};



export default function HeaderClient({

  user,

}:HeaderProps){



const {cart}=useCart();

const router=useRouter();



const cartCount =
cart.reduce(
(sum,item)=>sum + item.quantity,
0
);



async function handleLogout(){

await logout();

router.push("/login");

router.refresh();

}





return (

<header className="
bg-[#0b0b0b]
text-white
shadow-2xl
">





{/* ÜST BAR */}

<div className="
border-b
border-[#242424]
">

<div className="
mx-auto
max-w-7xl
flex
justify-between
px-6
py-3
text-xs
tracking-wider
text-gray-400
">


<span>
🚚 750 TL üzeri ücretsiz kargo
</span>


<span>
LUMERA PREMIUM COLLECTION
</span>


</div>

</div>







{/* ANA HEADER */}


<div className="
mx-auto
max-w-7xl
flex
items-center
justify-between
px-6
py-7
">







{/* LOGO */}


<Link

href="/"

className="
flex
items-center
gap-5
"

>


<img

src="/logo.png"

alt="LUMERA"

className="
h-20
w-auto
"

/>



<div className="
hidden
md:block
border-l
border-[#333]
pl-5
">

<p className="
text-sm
italic
text-[#c8b08a]
">

Gölgede zarafet,

</p>


<p className="
text-sm
italic
text-[#c8b08a]
">

dinlenmede ayrıcalık

</p>


</div>



</Link>








{/* SAĞ ALAN */}



<div className="
flex
items-center
gap-6
">





{
user ? (

<>


<div className="
hidden
lg:block
text-right
">


<p className="
text-sm
text-gray-400
">

Hoş geldiniz

</p>


<p className="
font-semibold
text-[#c8a165]
">

{user.name}

</p>


</div>






<Link

href="/account/favorites"

className="
group
text-center
"

>

<div className="
text-xl
group-hover:text-[#c8a165]
">

♡


</div>


<span className="
hidden
md:block
text-xs
text-gray-400
">

Favoriler

</span>


</Link>







<Link

href="/account/orders"

className="
group
text-center
"

>


<div className="
text-xl
group-hover:text-[#c8a165]
">

▢

</div>


<span className="
hidden
md:block
text-xs
text-gray-400
">

Sipariş

</span>


</Link>







<Link

href="/account"

className="
group
text-center
"

>


<div className="
text-xl
group-hover:text-[#c8a165]
">

♙

</div>


<span className="
hidden
md:block
text-xs
text-gray-400
">

Hesabım

</span>


</Link>







{
user.role==="ADMIN" && (

<Link

href="/admin"

className="
text-[#c8a165]
text-sm
"

>

Admin

</Link>

)

}







<button

onClick={handleLogout}

className="
text-xs
text-gray-400
hover:text-red-400
"

>

Çıkış

</button>



</>

)

:

(

<>

<Link

href="/login"

className="
text-sm
hover:text-[#c8a165]
"

>

Giriş Yap

</Link>



<Link

href="/register"

className="
rounded-full
bg-[#c8a165]
px-5
py-2
text-sm
font-bold
text-black
"

>

Kayıt Ol

</Link>


</>

)

}









{/* SEPET */}


<Link

href="/cart"

className="
relative
flex
h-14
w-14
items-center
justify-center
rounded-full
border
border-[#333]
text-2xl
transition
hover:border-[#c8a165]
"

>


🛒



{
cartCount>0 && (

<span

className="
absolute
-right-2
-top-2
rounded-full
bg-[#c8a165]
px-2
text-xs
font-bold
text-black
"

>

{cartCount}

</span>

)

}



</Link>





</div>



</div>









{/* NAV */}


<nav className="
border-t
border-[#222]
bg-[#141414]
">


<div className="
mx-auto
max-w-7xl
flex
justify-center
gap-12
px-6
py-5
text-sm
tracking-wide
">


<Link href="/" className="hover:text-[#c8a165]">
Ana Sayfa
</Link>


<Link href="/kategori/Hamak" className="hover:text-[#c8a165]">
Hamak
</Link>


<Link href="/kategori/Şezlong" className="hover:text-[#c8a165]">
Şezlong
</Link>


<Link href="/kategori/Bahçe Mobilyaları" className="hover:text-[#c8a165]">
Bahçe Mobilyaları
</Link>


<Link href="/koleksiyon" className="hover:text-[#c8a165]">
Koleksiyon
</Link>


<Link href="/iletisim" className="hover:text-[#c8a165]">
İletişim
</Link>


</div>


</nav>






</header>

);


}