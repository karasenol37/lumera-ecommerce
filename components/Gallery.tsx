const images=[

"/images/gallery1.jpg",

"/images/gallery2.jpg",

"/images/gallery3.jpg",

"/images/gallery4.jpg"

];


export default function Gallery(){


return (

<section
className="
bg-[#181818]
px-6
py-20
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
text-white
"
>

Yaşam Alanlarından

</h2>



<div
className="
mt-10
grid
grid-cols-2
gap-5
md:grid-cols-4
"
>

{

images.map(img=>(


<img

key={img}

src={img}

className="
h-64
w-full
rounded-2xl
object-cover
"

/>


))

}


</div>


</div>


</section>

)

}