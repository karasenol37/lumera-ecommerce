"use client";

import { useEffect, useState } from "react";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "@/lib/actions/favorite";


type Props = {

  id:number;

  name:string;

  price:number;

  image:string;

};




export default function FavoriteButton({

  id,

}:Props){



const [favorite,setFavorite] =
useState(false);


const [loading,setLoading] =
useState(false);







useEffect(()=>{


async function loadFavorite(){


try{


const result =
await checkFavorite(id);


setFavorite(result);


}
catch{

// giriş yapılmamış olabilir

}



}



loadFavorite();


},[id]);









async function toggleFavorite(){



try{


setLoading(true);




if(favorite){


await removeFavorite(id);


setFavorite(false);



}else{



await addFavorite(id);


setFavorite(true);



}



}
catch(error){


alert(
"Giriş yapmanız gerekiyor."
);


}
finally{


setLoading(false);


}


}









return (

<button

onClick={toggleFavorite}

disabled={loading}

className="
absolute
right-4
top-4
z-20
flex
h-10
w-10
items-center
justify-center
rounded-full
bg-black/50
text-2xl
transition
hover:scale-110
"

>


{

favorite

?

"♥"

:

"♡"

}



</button>


);


}