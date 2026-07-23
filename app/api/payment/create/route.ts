import { NextRequest, NextResponse } from "next/server";
import { getIyzipay } from "@/lib/payment/iyzico";
import { prisma } from "@/lib/prisma";


function generateId(prefix: string = "ID") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;
}


export async function POST(req: NextRequest) {

  try {

    const body = await req.json();


    const {
      items,
      buyer
    } = body;



    if (!items || items.length === 0) {

      return NextResponse.json(
        {
          error: "Sepet boş"
        },
        {
          status: 400
        }
      );

    }



    const iyzipay = getIyzipay();



    const totalPrice = items.reduce(
      (
        total: number,
        item: any
      ) =>
        total + item.price * item.quantity,

      0
    );



    const conversationId =
      generateId("CONV");



    /*
      Ön ödeme kaydı oluşturuyoruz.
      İyzico başarılı olunca callback
      buradan siparişi oluşturacak.
    */

    const pendingPayment =
      await prisma.pendingPayment.create({

        data: {

          token: generateId("TEMP"),


          userId:
            buyer.id || null,


          fullName:
            `${buyer.name} ${buyer.surname}`,

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



    const requestData = {


      locale: "tr",


      conversationId,


      price:
        totalPrice.toFixed(2),


      paidPrice:
        totalPrice.toFixed(2),


      currency: "TRY",


      basketId:
        generateId("BASKET"),


      paymentGroup:
        "PRODUCT",



      callbackUrl:
        `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,




      buyer: {

        id:
          buyer.id?.toString() || "guest",


        name:
          buyer.name,


        surname:
          buyer.surname,


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
          buyer.city || "Kastamonu",


        country:
          "Turkey",


        ip:
          req.headers.get("x-forwarded-for")
          || "85.34.78.112"

      },



      basketItems:

        items.map(
          (item: any) => ({

            id:
              item.id.toString(),


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

        )

    };





    const result: any =

      await new Promise(

        (resolve, reject) => {


          iyzipay.checkoutFormInitialize.create(

            requestData,

            (
              error: any,
              result: any
            ) => {


              if (error) {

                reject(error);

                return;

              }


              resolve(result);


            }

          );


        }

      );






    if (
      !result ||
      result.status !== "success"
    ) {


      await prisma.pendingPayment.delete({
        where:{
          id: pendingPayment.id
        }
      });



      return NextResponse.json(

        {
          error:
            result?.errorMessage ||
            "Ödeme başlatılamadı"
        },

        {
          status:400
        }

      );

    }





    /*
      Gerçek iyzico tokenini kaydediyoruz
    */


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
        result.token,


      conversationId


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