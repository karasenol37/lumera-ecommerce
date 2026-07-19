"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./session";




// Favoriye ekle

export async function addFavorite(
  productId:number
){

  const user =
  await getSessionUser();


  if(!user){

    throw new Error(
      "Giriş yapmalısınız."
    );

  }



  const favorite =
  await prisma.favorite.create({

    data:{

      userId:user.id,

      productId

    }

  });



  return favorite;

}







// Favoriden çıkar

export async function removeFavorite(
  productId:number
){

  const user =
  await getSessionUser();


  if(!user){

    throw new Error(
      "Giriş yapmalısınız."
    );

  }



  await prisma.favorite.delete({

    where:{

      userId_productId:{

        userId:user.id,

        productId

      }

    }

  });



  return {
    success:true
  };

}









// Favori kontrol

export async function checkFavorite(
productId:number
){


const user =
await getSessionUser();



if(!user){

return false;

}




const favorite =
await prisma.favorite.findUnique({

where:{

userId_productId:{

userId:user.id,

productId

}

}

});





return !!favorite;


}









// Kullanıcının favorileri

export async function getFavorites(){


const user =
await getSessionUser();



if(!user){

return [];

}




const favorites =
await prisma.favorite.findMany({

where:{

userId:user.id

},


include:{

product:true

},


orderBy:{

createdAt:"desc"

}


});




return favorites;


}