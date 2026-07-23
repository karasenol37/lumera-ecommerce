import {
  NextRequest,
  NextResponse
}
from "next/server";

import {
  prisma
}
from "@/lib/prisma";

import {
  iyzicoRequest
}
from "@/lib/payment/iyzico-auth";





export async function POST(
  req:NextRequest
){


try{


const formData =
await req.formData();



const token = formData.get("token") as string;



if(!token){


return NextResponse.redirect(

new URL(
"/odeme-basarisiz",
req.url
)

);


}






const result =
await iyzicoRequest(

"/payment/iyzipos/checkoutform/auth/ecom",

{


locale:"tr",


conversationId:
Date.now().toString(),


token


}

);






if(
!result ||
result.status !== "success"
){


return NextResponse.redirect(

new URL(
"/odeme-basarisiz",
req.url
)

);


}








const pendingPayment =

await prisma.pendingPayment.findUnique({

where:{
token
}

});






if(!pendingPayment){


return NextResponse.redirect(

new URL(
"/odeme-basarisiz",
req.url
)

);


}







const orderNumber =

`LUM-${Date.now()}`;







const order =

await prisma.order.create({

data:{



userId:
pendingPayment.userId,



orderNumber,



paymentToken:
token,



fullName:
pendingPayment.fullName,


phone:
pendingPayment.phone,


email:
pendingPayment.email,



city:
pendingPayment.city,


district:
pendingPayment.district,


address:
pendingPayment.address,


postalCode:
pendingPayment.postalCode,



total:
pendingPayment.total,



paymentStatus:
"Ödendi",



paymentMethod:
"Kredi Kartı",



status:
"Hazırlanıyor",





items:{


create:


(
pendingPayment.items as any[]
)
.map(
(item:any)=>(

{

productId:
item.id,


quantity:
item.quantity,


price:
item.price


}

)

)



}



}



});









await prisma.pendingPayment.delete({

where:{
id:
pendingPayment.id
}

});








return NextResponse.redirect(

new URL(

`/odeme-basarili?order=${order.orderNumber}`,

req.url

)

);







}
catch(error:any){



console.error(
"Payment callback error:",
error
);




return NextResponse.redirect(

new URL(

"/odeme-basarisiz",

req.url

)

);



}



}