import { NextRequest, NextResponse } from "next/server";
import { getIyzipay } from "@/lib/payment/iyzico";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {

  try {


    const formData =
      await req.formData();


    const token =
      formData.get("token") as string;



    if (!token) {

      return NextResponse.redirect(
        new URL(
          "/odeme-basarisiz",
          req.url
        )
      );

    }



    const iyzipay =
      getIyzipay();




    const result:any =
      await new Promise(

        (resolve, reject)=>{


          iyzipay.checkoutForm.retrieve(

            {

              locale:"tr",

              conversationId:
                Date.now().toString(),

              token

            },


            (
              error:any,
              response:any
            )=>{


              if(error){

                reject(error);

                return;

              }


              resolve(response);


            }

          );


        }

      );





    /*
      İyzico ödeme başarısızsa
    */

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





    /*
      Bekleyen ödeme kaydını buluyoruz
    */

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





    /*
      Sipariş numarası oluştur
    */

    const orderNumber =

      `LUM-${Date.now()}`;







    /*
      Order oluştur
    */

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

              (pendingPayment.items as any[])
                .map(

                  (item:any)=>({

                    productId:
                      item.id,


                    quantity:
                      item.quantity,


                    price:
                      item.price

                  })

                )

          }



        }

      });







    /*
      Kullanılmış pending kaydı sil
    */

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