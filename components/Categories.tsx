import Link from "next/link";


const categories=[

{
name:"Hamak",
emoji:"🌴"
},

{
name:"Şemsiye",
emoji:"⛱️"
},

{
name:"Şezlong",
emoji:"🪑"
},

{
name:"Ateş Çukuru",
emoji:"🔥"
}

];



export default function Categories(){


return (

<section
className="
mx-auto
max-w-7xl
px-6
py-20
"
>



<p
className="
text-sm
tracking-[0.3em]
text-[#c8a165]
"
>

KATEGORİLER

</p>




<h2
className="
mt-3
text-4xl
font-bold
text-white
"
>

Koleksiyonlarımız

</h2>






<div
className="
mt-10
grid
grid-cols-2
gap-6
md:grid-cols-4
"
>


{

categories.map(category=>(


<Link

key={category.name}

href={`/kategori/${category.name}`}

className="
rounded-2xl
border
border-[#2b2b2b]
bg-[#181818]
p-8
text-center
transition
hover:-translate-y-2
hover:border-[#a67c52]
"

>


<div
className="
text-5xl
"
>

{category.emoji}

</div>



<h3
className="
mt-5
text-xl
font-semibold
"
>

{category.name}

</h3>



</Link>


))


}


</div>



</section>


)

}