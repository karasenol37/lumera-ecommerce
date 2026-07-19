import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";



export async function PUT(
request:Request,
context:{
params:Promise<{id:string}>
}
){


const admin =
await getSessionUser();



if(!admin || admin.role !== "ADMIN"){

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





const updatedUser =
await prisma.user.update({

where:{
id:Number(id)
},


data:{
role:body.role
}


});





return NextResponse.json({

success:true,

user:updatedUser

});


}









export async function DELETE(
request:Request,
context:{
params:Promise<{id:string}>
}
){



const admin =
await getSessionUser();



if(!admin || admin.role !== "ADMIN"){

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





if(Number(id)===admin.id){

return NextResponse.json(
{
message:"Kendi hesabınızı silemezsiniz"
},
{
status:400
}
);

}







await prisma.user.delete({

where:{
id:Number(id)
}

});





return NextResponse.json({

success:true

});


}