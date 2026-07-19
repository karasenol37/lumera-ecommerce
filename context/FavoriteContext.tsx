"use client";

import {
createContext,
useContext,
useEffect,
useState,
ReactNode
} from "react";


type FavoriteProduct = {

id:number;

name:string;

price:number;

image:string;

};



type FavoriteContextType = {

favorites:FavoriteProduct[];

addFavorite:(product:FavoriteProduct)=>void;

removeFavorite:(id:number)=>void;

isFavorite:(id:number)=>boolean;

};



const FavoriteContext =
createContext<FavoriteContextType | undefined>(
undefined
);



export function FavoriteProvider({
children
}:{
children:ReactNode
}){


const [favorites,setFavorites]=
useState<FavoriteProduct[]>([]);



useEffect(()=>{

const saved =
localStorage.getItem(
"lumera-favorites"
);


if(saved){

setFavorites(
JSON.parse(saved)
);

}

},[]);




useEffect(()=>{


localStorage.setItem(
"lumera-favorites",
JSON.stringify(favorites)
);


},[favorites]);






function addFavorite(
product:FavoriteProduct
){


setFavorites(current=>{


if(
current.some(
item=>item.id===product.id
)
){

return current;

}


return [
...current,
product
];


});


}






function removeFavorite(
id:number
){


setFavorites(current=>

current.filter(
item=>item.id!==id
)

);


}





function isFavorite(
id:number
){


return favorites.some(
item=>item.id===id
);


}





return (

<FavoriteContext.Provider

value={{

favorites,

addFavorite,

removeFavorite,

isFavorite

}}

>

{children}

</FavoriteContext.Provider>

);


}







export function useFavorite(){


const context =
useContext(FavoriteContext);



if(!context){

throw new Error(
"FavoriteProvider dışında kullanıldı"
);

}


return context;


}