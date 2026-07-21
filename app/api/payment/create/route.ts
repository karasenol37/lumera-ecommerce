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



      callbackUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,





buyer:{
  id:
    conversationId,

  name:
    "Senol",

  surname:
    "Kara",

  gsmNumber:
    "5395216430",

  email:
    buyer.email,

  identityNumber:
    "47821397810",

  registrationAddress:
    buyer.address,

  city:
    "Kastamonu",

  country:
    "Turkey",

  zipCode:
    buyer.postalCode
},





      shippingAddress:{


        contactName:
          buyer.fullName,


        city:
          buyer.city,


        country:
          "Turkey",


        address:
          buyer.address,


        zipCode:
          buyer.postalCode


      },





      billingAddress:{


        contactName:
          buyer.fullName,


        city:
          buyer.city,


        country:
          "Turkey",


        address:
          buyer.address,


        zipCode:
          buyer.postalCode


      },





     basketItems:
items.map((item:any)=>({

  id:
  "BI"+String(item.id),

  name:
  item.name,

category1:
"General",

category2:
"General",

  itemType:
  "PHYSICAL",

  price:
  (
    item.price *
    item.quantity
  ).toFixed(2)

}))


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