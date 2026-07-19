"use client";

import { useRouter, useSearchParams } from "next/navigation";


export default function SortSelect({

currentSort,

}:{

currentSort?:string;

}){


const router = useRouter();

const searchParams = useSearchParams();



function handleChange(
e:React.ChangeEvent<HTMLSelectElement>
){


const value = e.target.value;


const params = new URLSearchParams(
searchParams.toString()
);



if(value==="new"){

params.delete("sort");

}

else{

params.set(
"sort",
value
);

}



router.push(
`/?${params.toString()}`
);


}




return (

<select

value={currentSort || "new"}

onChange={handleChange}

className="
rounded-full
border
border-[#333]
bg-[#181818]
px-6
py-3
text-sm
text-white
outline-none
"

>

<option value="new">
Yeni Eklenenler
</option>


<option value="price-asc">
Fiyat: Artan
</option>


<option value="price-desc">
Fiyat: Azalan
</option>


</select>

);

}