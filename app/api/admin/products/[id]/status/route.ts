import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";



export async function PATCH(

request:Request,

context:{
  params:Promise<{
    id:string
  }>
}

){



const user =
await getSessionUser();





if(
!user ||
user.role !== "ADMIN"
){

return NextResponse.json(

{
message:"Yetkisiz erişim"
},

{
status:403
}

);

}







const {id} =
await context.params;





const body =
await request.json();





const isActive =
Boolean(body.isActive);







const product =
await prisma.product.update({

where:{

id:Number(id)

},

data:{

isActive

}

});







return NextResponse.json({

success:true,

product

});



}