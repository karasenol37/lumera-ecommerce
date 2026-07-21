import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIyzipayAuthorization } from "@/lib/payment/iyzico-rest";


export async function POST(
  request: Request
) {


  try {


    const body =
      await request.json();



    const {
      items,
      buyer
    } = body;




    if(
      !items ||
      items.length === 0
    ){

      return NextResponse.json(
        {
          success:false,
          message:"Sepet boş."
        },
        {
          status:400
        }
      );

    }





    const price =
      items.reduce(
        (
          total:number,
          item:any
        ) => {

          return total +
          item.price *
          item.quantity;

        },
        0
      );





    const conversationId =
      String(Date.now());





    const requestData = {


      locale:"tr",


      conversationId,


      price:
        price.toFixed(2),


      paidPrice:
        price.toFixed(2),


      currency:"TRY",


      basketId:
        `LUM-${Date.now()}`,


      paymentGroup:"PRODUCT",

enabledInstallments:[
  1,
  2,
  3,
  6,
  9
],

      callbackUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,




buyer:{
  id:"LUMERA_USER",

  name:"John",

  surname:"Doe",

  gsmNumber:"+905350000000",

  email:"sandbox@iyzico.com",

  identityNumber:"11111111111",

  registrationAddress:"Nisantasi Istanbul",

  city:"Istanbul",

  country:"Türkiye",

  zipCode:"34742"
},


shippingAddress:{
  contactName:"John Doe",
  city:"Istanbul",
  country:"Türkiye",
  address:"Nisantasi Istanbul",
  zipCode:"34742"
},


billingAddress:{
  contactName:"John Doe",
  city:"Istanbul",
  country:"Türkiye",
  address:"Nisantasi Istanbul",
  zipCode:"34742"
},





     basketItems:[
{
 id:"BI101",
 name:"Bahçe Hamağı",
 category1:"Bahçe",
 category2:"Bahçe Mobilyası",
 itemType:"PHYSICAL",
 price:"14500.00"
}
]

    };





    const jsonBody =
      JSON.stringify(
        requestData
      );





    const apiUrl =
      `${process.env.IYZICO_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom`;





    console.log(
      "IYZICO URL:",
      apiUrl
    );


    console.log(
      "IYZICO REQUEST:",
      requestData
    );
    const headers =
      generateIyzipayAuthorization(
        "/payment/iyzipos/checkoutform/initialize/auth/ecom",
        jsonBody
      );



console.log(
"IYZICO JSON:",
jsonBody
);
console.log(
"AUTH HEADER:",
headers.Authorization.substring(0,30)
);
    const response =
      await fetch(
        apiUrl,
        {
          method:"POST",

          headers,

          body:jsonBody

        }
      );





    const result =
      await response.json();





    console.log(
      "IYZICO RESPONSE:"
    );

    console.dir(
      result,
      {
        depth:null
      }
    );







    if(
      result.status !== "success"
    ){


      return NextResponse.json(

        {

          success:false,

          message:
            result.errorMessage ||
            "İyzico ödeme başlatılamadı.",

          error:
            result

        },

        {
          status:400
        }

      );


    }









    await prisma.pendingPayment.create({

      data:{


        token:
          result.token,


        fullName:
          buyer.fullName,


        phone:
          buyer.phone,


        email:
          buyer.email,


        city:
          buyer.city,


        district:
          buyer.district,


        address:
          buyer.address,


        postalCode:
          buyer.postalCode,


        items,


        total:
          price


      }

    });








    return NextResponse.json({

      success:true,


      paymentPageUrl:
        result.paymentPageUrl,


      token:
        result.token


    });







  }

  catch(error){


    console.error(
      "IYZICO REST ERROR:"
    );


    console.dir(
      error,
      {
        depth:null
      }
    );



    return NextResponse.json(

      {

        success:false,

        message:
          "Ödeme başlatılamadı."

      },

      {
        status:500
      }

    );


  }


}