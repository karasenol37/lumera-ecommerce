const comments=[

{
name:"Ahmet Y.",
text:"Hamak kalitesi gerçekten beklentimin üzerinde."
},

{
name:"Elif K.",
text:"Bahçemize çok şık bir hava kattı."
},

{
name:"Murat T.",
text:"Ahşap işçiliği ve tasarım mükemmel."
}

];



export default function Testimonials(){

return (

<section
className="
bg-[#111]
px-6
py-20
text-white
"
>


<div className="mx-auto max-w-7xl">


<h2
className="
text-4xl
font-bold
"
>

Müşterilerimiz Ne Diyor?

</h2>



<div
className="
mt-10
grid
gap-6
md:grid-cols-3
"
>


{
comments.map(item=>(


<div

key={item.name}

className="
rounded-2xl
bg-[#181818]
p-8
"

>

<div className="text-[#d4af37]">
★★★★★
</div>


<p className="mt-5 text-gray-300">

"{item.text}"

</p>


<p className="mt-5 font-bold">

{item.name}

</p>


</div>


))
}


</div>


</div>


</section>

)

}