const items=[

{
title:"Doğal Ahşap",
text:"Özenle seçilmiş dayanıklı ahşap malzemeler."
},

{
title:"El İşçiliği",
text:"Her üründe detaylara verilen özel önem."
},

{
title:"Uzun Ömür",
text:"Dış mekan koşullarına uygun üretim."
}

];


export default function QualitySection(){

return (

<section
className="
bg-[#181818]
px-6
py-20
text-white
"
>


<div
className="
mx-auto
max-w-7xl
"
>


<h2
className="
text-4xl
font-bold
"
>

Neden LUMERA?

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
items.map(item=>(


<div

key={item.title}

className="
rounded-2xl
border
border-[#2b2b2b]
bg-[#111]
p-8
"

>


<h3
className="
text-xl
font-bold
text-[#c8a165]
"
>

{item.title}

</h3>


<p className="mt-4 text-gray-300">

{item.text}

</p>


</div>


))
}


</div>


</div>


</section>

)

}