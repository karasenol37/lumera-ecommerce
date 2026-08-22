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
  children,
  userId = null,
}: {
  children: ReactNode;
  userId?: number | null;
}) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = userId
    ? `lumera-favorites-user-${userId}`
    : "lumera-favorites-guest";

  // Favorileri yükle
  useEffect(() => {
    setIsLoaded(false);
    async function loadUserFavorites() {
      try {
        if (userId) {
          const res = await fetch("/api/account/favorites");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const formatted = data.map((fav: any) => ({
                id: fav.product ? fav.product.id : fav.productId || fav.id,
                name: fav.product ? fav.product.name : fav.name,
                price: fav.product ? fav.product.price : fav.price,
                image: fav.product ? fav.product.image : fav.image,
              }));
              setFavorites(formatted);
              localStorage.setItem(storageKey, JSON.stringify(formatted));
              setIsLoaded(true);
              return;
            }
          }
        }

        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setFavorites(JSON.parse(saved));
        } else {
          setFavorites([]);
        }
      } catch {
        setFavorites([]);
      } finally {
        setIsLoaded(true);
      }
    }

    loadUserFavorites();
  }, [userId, storageKey]);

  // Favoriler değişince kaydet
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {}
  }, [favorites, storageKey, isLoaded]);






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