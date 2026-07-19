import { prisma } from "@/lib/prisma";


export async function getOrders() {

  return await prisma.order.findMany({

    orderBy:{
      createdAt:"desc",
    },

    include:{
      items:{
        include:{
          product:true,
        },
      },
    },

  });

}






export async function getOrderById(
  id:number
){

  return await prisma.order.findUnique({

    where:{
      id,
    },

    include:{
      items:{
        include:{
          product:true,
        },
      },
    },

  });

}