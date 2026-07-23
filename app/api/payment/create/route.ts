import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIyzipayAuthorization } from "@/lib/payment/iyzico-auth";


function generateId(prefix:string="ID"){

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2,10)}`;

}



export async function POST(
  req:NextRequest
){

  try{


    const body =
      await req.json();



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
          error:"Sepet boş"
        },
        {
          status:400
        }
      );

    }



    if(!buyer){

      return NextResponse.json(
        {
          error:"Müşteri bilgisi bulunamadı"
        },
        {
          status:400
        }
      );

    }




    /*
      Checkout formundaki
      fullName alanını
      İyzico'nun istediği
      name / surname formatına çeviriyoruz
    */

    const nameParts =
      (buyer.fullName || "")
      .trim()
      .split(" ");



    const buyerName =
      nameParts.shift() || "Müşteri";


    const buyerSurname =
      nameParts.join(" ") || "Test";






    if(
      !buyer.email ||
      !buyer.phone ||
      !buyer.fullName
    ){

      return NextResponse.json(
        {
          error:
          "Ad soyad, telefon ve e-posta zorunludur."
        },
        {
          status:400
        }
      );

    }





    const totalPrice =
      items.reduce(
        (
          total:number,
          item:any
        ) =>
          total +
          item.price *
          item.quantity,

        0
      );







    const pendingPayment =
      await prisma.pendingPayment.create({

        data:{


          token:
            generateId("TEMP"),


          userId:
            buyer.id ?? null,


          fullName:
            buyer.fullName,



          phone:
            buyer.phone,


          email:
            buyer.email,



          city:
            buyer.city || "Kastamonu",



          district:
            buyer.district || "",



          address:
            buyer.address,



          postalCode:
            buyer.postalCode || "",



          items,


          total:
            totalPrice

        }

      });









    const basketItems =

      items.map(
        (item:any)=>({

          id:
            String(item.id),


          name:
            item.name,


          category1:
            item.category || "Genel",


          itemType:
            "PHYSICAL",


          price:
            (
              item.price *
              item.quantity
            ).toFixed(2)

        })

      );








    const requestData = {


      locale:"tr",


      conversationId:
        generateId("CONV"),



      price:
        totalPrice.toFixed(2),



      paidPrice:
        totalPrice.toFixed(2),



      currency:"TRY",



      basketId:
        generateId("BASKET"),



      paymentGroup:
        "PRODUCT",





      callbackUrl:

        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,







      buyer:{


        id:
          buyer.id
          ?
          String(buyer.id)
          :
          "guest",



        name:
          buyerName,



        surname:
          buyerSurname,



        gsmNumber:
          buyer.phone,



        email:
          buyer.email,



        identityNumber:
          buyer.identityNumber ||
          "11111111111",



        registrationAddress:
          buyer.address,



        city:
          buyer.city ||
          "Kastamonu",



        country:
          "Turkey",



        ip:
          req.headers.get(
            "x-forwarded-for"
          )
          ||
          "85.34.78.112"

      },



      basketItems

    };








    const endpoint =
      "/payment/iyzipos/checkoutform/initialize/auth/ecom";





    const bodyString =
      JSON.stringify(requestData);







    console.log(
      "Iyzico Request:",
      {
        endpoint,
        body:requestData
      }
    );







    const response =
      await fetch(

        `${process.env.IYZICO_BASE_URL}${endpoint}`,

        {

          method:"POST",


          headers:
            generateIyzipayAuthorization(
              bodyString
            ),



          body:
            bodyString

        }

      );









    const result =
      await response.json();






    console.log(
      "Iyzico Response:",
      {
        status:response.status,
        result
      }
    );








    if(
      !result ||
      result.status !== "success"
    ){


      await prisma.pendingPayment.delete({

        where:{
          id:
            pendingPayment.id
        }

      }).catch(()=>{});





      return NextResponse.json(

        {
          error:
            result?.errorMessage ||
            result?.errorGroup ||
            "Ödeme başlatılamadı"
        },

        {
          status:400
        }

      );

    }









    await prisma.pendingPayment.update({

      where:{
        id:
          pendingPayment.id
      },


      data:{


        token:
          result.token

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


  catch(error:any){


    console.error(
      "Payment create error:",
      error
    );



    return NextResponse.json(

      {
        error:
          error.message ||
          "Sunucu hatası"
      },

      {
        status:500
      }

    );


  }


}