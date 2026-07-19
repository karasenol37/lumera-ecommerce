"use client";

import { useCart } from "@/context/CartContext";


export default function PaymentButton({

buyer

}:{

buyer:any;

}){


const {cart}=useCart();





async function handlePayment(){


console.log("ÖDEME BUTONU ÇALIŞTI");



try{


const response =
await fetch(

"/api/payment/create",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

items:cart,

buyer

})


}

);





const data =
await response.json();



console.log(
"IYZICO RESPONSE:",
data
);




if(data.success){



localStorage.removeItem(
"lumera-cart"
);



window.location.href =
data.paymentPageUrl;



}


else{


alert(
data.message
);


}



}

catch(error){


console.error(error);


alert(
"Ödeme başlatılamadı."
);


}



}







return (


<button

type="button"

onClick={handlePayment}

className="
mt-8
w-full
rounded-full
bg-[#c8a165]
py-4
text-lg
font-bold
text-black
"

>


Ödeme Yap


</button>



);


}