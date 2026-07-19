"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";



type Product = {

  id:number;

  name:string;

  price:number;

  image:string;

  stock:number;

};





export type CartItem = Product & {

  quantity:number;

};







type CartContextType = {


  cart:CartItem[];


  addToCart:(product:Product)=>void;


  removeFromCart:(id:number)=>void;


  increaseQuantity:(id:number)=>void;


  decreaseQuantity:(id:number)=>void;


  clearCart:()=>void;


};







const CartContext =
createContext<CartContextType | undefined>(undefined);









export function CartProvider({

children,

}:{

children:ReactNode;

}){





const [cart,setCart] =
useState<CartItem[]>([]);









// kayıtlı sepeti getir

useEffect(()=>{


const saved =
localStorage.getItem("lumera-cart");



if(saved){


const parsed =
JSON.parse(saved);



// eski sepetlerde stock yoksa düzelt

const fixedCart =
parsed.map((item:CartItem)=>({

...item,

stock:item.stock ?? 0

}));



setCart(fixedCart);


}



},[]);









// sepet değişince kaydet

useEffect(()=>{


localStorage.setItem(

"lumera-cart",

JSON.stringify(cart)

);


},[cart]);











function addToCart(

product:Product

){



setCart((current)=>{





const existing =

current.find(

(item)=>item.id===product.id

);







// ürün zaten sepetteyse

if(existing){





if(existing.quantity >= product.stock){


alert(

"Yeterli stok yok."

);


return current;


}







return current.map(item=>


item.id===product.id

?

{

...item,

quantity:item.quantity+1

}


:

item


);




}










// stok yoksa

if(product.stock <= 0){


alert(

"Bu ürün stokta yok."

);


return current;


}









return [

...current,


{

...product,

quantity:1

}

];





});



}













function removeFromCart(

id:number

){



setCart((current)=>


current.filter(

(item)=>item.id!==id

)


);



}












function increaseQuantity(

id:number

){



setCart((current)=>



current.map(item=>{





if(item.id===id){





if(item.quantity >= item.stock){


alert(

"Stok sınırına ulaştınız."

);


return item;


}








return {


...item,


quantity:item.quantity+1


};



}





return item;



})


);



}













function decreaseQuantity(

id:number

){



setCart((current)=>


current.map(item=>{





if(item.id===id){



return {


...item,


quantity:

Math.max(

1,

item.quantity-1

)


};



}





return item;



})


);



}













function clearCart(){


setCart([]);


}













return (


<CartContext.Provider


value={{


cart,


addToCart,


removeFromCart,


increaseQuantity,


decreaseQuantity,


clearCart



}}


>


{children}


</CartContext.Provider>



);



}












export function useCart(){



const context =

useContext(CartContext);





if(!context){


throw new Error(

"useCart CartProvider içinde kullanılmalıdır"

);


}





return context;



}