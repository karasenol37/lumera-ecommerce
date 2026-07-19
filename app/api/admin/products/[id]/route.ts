import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import fs from "fs/promises";
import path from "path";



async function saveFile(file:File){

const bytes =
await file.arrayBuffer();


const buffer =
Buffer.from(bytes);



const fileName =
`${Date.now()}-${file.name.replace(/\s/g,"-")}`;



const uploadPath =
path.join(
process.cwd(),
"public",
"uploads",
"products",
fileName
);



await fs.writeFile(
uploadPath,
buffer
);



return `/uploads/products/${fileName}`;

}






export async function GET(
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



const {id}=await context.params;



const product =
await prisma.product.findUnique({

where:{
id:Number(id)
},

include:{
images:true
}

});





if(!product){

return NextResponse.json(
{
message:"Ürün bulunamadı"
},
{
status:404
}
);

}





return NextResponse.json({
product
});


}









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





const {id}=await context.params;





const formData =
await request.formData();






const data:any={


name:
String(formData.get("name")),


slug:
String(formData.get("slug")),


category:
String(formData.get("category")),


price:
Number(formData.get("price")),


oldPrice:
Number(formData.get("oldPrice")),


description:
String(formData.get("description")),


material:
String(formData.get("material")),


dimensions:
String(formData.get("dimensions")),


stock:
formData.get("stock")==="true",


};






const mainImage =
formData.get("mainImage");




if(
mainImage &&
mainImage instanceof File &&
mainImage.size > 0
){

data.image =
await saveFile(mainImage);

}







const gallery =
formData.getAll("gallery") as File[];





const galleryUrls:string[]=[];



for(const file of gallery){


if(file.size>0){

const url =
await saveFile(file);


galleryUrls.push(url);

}


}







const product =
await prisma.product.update({

where:{
id:Number(id)
},


data:{


...data,



images:

galleryUrls.length > 0

?

{

create:

galleryUrls.map(url=>({

url

}))

}

:

undefined


}

});






return NextResponse.json({

success:true,

product

});


}









export async function DELETE(
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




const {id}=await context.params;





await prisma.product.update({
  where: {
    id: Number(id)
  },
  data: {
    isActive: false
  }
});

return NextResponse.json({
  success: true
});





return NextResponse.json({

success:true

});


}