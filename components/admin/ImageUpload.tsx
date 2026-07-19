"use client";

import { useState } from "react";


type Props = {
  name:string;
  multiple?:boolean;
};



export default function ImageUpload({
  name,
  multiple=false
}:Props){


const [images,setImages] =
useState<string[]>([]);



async function upload(
e:React.ChangeEvent<HTMLInputElement>
){


const files =
e.target.files;


if(!files)
return;



const uploaded:string[]=[];



for(
const file of Array.from(files)
){


const formData =
new FormData();



formData.append(
"file",
file
);



const res =
await fetch(
"/api/upload",
{
method:"POST",
body:formData
}
);



const data =
await res.json();



uploaded.push(data.url);


}



setImages(uploaded);


}





return (

<div>


<input

type="file"

multiple={multiple}

onChange={upload}

className="
block
text-sm
text-gray-300
"

/>




{
images.map((img)=>(

<div key={img}>


<img

src={img}

className="
mt-3
h-24
w-24
rounded-lg
object-cover
"

/>



<input

type="hidden"

name={name}

value={img}

/>


</div>


))

}



</div>

);


}