import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";



export async function PUT(
request:Request,
context:{
params:Promise<{id:string}>
}
){



const user =
await getSessionUser();



if(!user || user.role !== "ADMIN"){

return NextResponse.json(
{
message:"Yetkisiz"
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





const order =
await prisma.order.update({

where:{
id:Number(id)
},


data:{


status:
body.status


}

});





return NextResponse.json({

success:true,

order

});


}