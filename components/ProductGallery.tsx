"use client";

import { useState } from "react";


type Image = {
  id:number;
  url:string;
};


type Props = {
  mainImage:string;
  name:string;
  images:Image[];
};



export default function ProductGallery({

  mainImage,
  name,
  images,

}:Props){



const allImages = [

  {
    id:0,
    url:mainImage
  },

  ...images

];



const [activeImage,setActiveImage] =
useState(mainImage);



return (

<div>



<img

src={
activeImage ||
"/images/no-image.jpg"
}

alt={name}

className="
h-[500px]
w-full
rounded-xl
object-cover
"

/>





<div

className="
mt-5
grid
grid-cols-4
gap-4
"

>


{

allImages.map((img)=>(


<button

key={img.id}

onClick={()=>
setActiveImage(img.url)
}

className="
overflow-hidden
rounded-lg
"

>


<img

src={img.url}

alt={name}

className="
h-24
w-full
object-cover
hover:opacity-80
transition
"

/>


</button>


))


}



</div>



</div>

);

}