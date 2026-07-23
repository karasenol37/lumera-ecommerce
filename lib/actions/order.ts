"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./session";





// ===============================
// SİPARİŞ OLUŞTURMA
// ===============================


export async function createOrder(
  data:{
    fullName:string;
    phone:string;
    email:string;

    city:string;
    district:string;
    address:string;
    postalCode:string;

    items:{
      id:number;
      quantity:number;
      price:number;
    }[];
  }
){


  const user = await getSessionUser();





  if(!data.items || data.items.length === 0){

    throw new Error(
      "Sepet boş."
    );

  }






  const total = data.items.reduce(

    (sum,item)=>

      sum + item.price * item.quantity,

    0

  );







  const order = await prisma.$transaction(async(tx)=>{






    // Stok kontrolü ve stok düşme


    for(const item of data.items){



      const product = await tx.product.findUnique({

        where:{
          id:item.id
        },


        select:{

          id:true,

          name:true,

          stock:true

        }


      });






      if(!product){

        throw new Error(
          "Ürün bulunamadı."
        );

      }







      if(product.stock < item.quantity){


        throw new Error(

          `${product.name} için yeterli stok yok.`

        );


      }







      await tx.product.update({

        where:{

          id:item.id

        },


        data:{

          stock:{

            decrement:item.quantity

          }

        }


      });



    }













    const createdOrder = await tx.order.create({


      data:{



        userId:user?.id ?? null,


        orderNumber:
          `LUM-${Date.now()}`,


        fullName:data.fullName,


        phone:data.phone,


        email:data.email,



        city:data.city,


        district:data.district,


        address:data.address,


        postalCode:data.postalCode,



        total,

        paymentStatus:"Başarılı",

        paymentMethod:"Kredi Kartı",

        status:"Hazırlanıyor",



        items:{


          create:data.items.map(item=>({


            productId:item.id,


            quantity:item.quantity,


            price:item.price



          }))


        }



      }


    });








    return createdOrder;



  });









  return {


    success:true,


    orderId:order.id


  };


}











// ===============================
// SİPARİŞ DURUM GÜNCELLEME
// ===============================


export async function updateOrderStatus({


  orderId,


  status,



}:{


  orderId:number;


  status:string;



}){






  const updatedOrder = await prisma.$transaction(async(tx)=>{






    const currentOrder = await tx.order.findUnique({


      where:{


        id:orderId


      },


      include:{


        items:true


      }


    });








    if(!currentOrder){


      throw new Error(

        "Sipariş bulunamadı."

      );


    }









    // Daha önce iptal edilmiş sipariş tekrar iptal edilmesin


    if(

      currentOrder.status === "İptal"

      &&

      status === "İptal"

    ){


      return currentOrder;


    }









    // Sipariş iptal edilirse stokları geri ekle


    if(

      status === "İptal"

      &&

      currentOrder.status !== "İptal"

    ){






      for(const item of currentOrder.items){





        await tx.product.update({


          where:{


            id:item.productId


          },


          data:{


            stock:{


              increment:item.quantity


            }


          }


        });





      }





    }












    const order = await tx.order.update({



      where:{


        id:orderId


      },



      data:{


        status


      },



      include:{


        items:true


      }



    });







    return order;






  });









  return {


    success:true,


    order:updatedOrder



  };



}