import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/actions/session";
import { put } from "@vercel/blob";


async function saveFile(file: File) {
  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url;
}






export async function POST(
request:Request
){



const user =
await getSessionUser();



if(!user){

return NextResponse.json(

{
message:"Yetkisiz erişim"
},

{
status:401
}

);

}



if(user.role !== "ADMIN"){

return NextResponse.json(

{
message:"Admin yetkisi gerekli"
},

{
status:403
}

);

}






const formData =
await request.formData();






const mainImage =
formData.get(
"mainImage"
) as File;





if(!mainImage){

return NextResponse.json(

{
message:"Ana görsel gerekli"
},

{
status:400
}

);

}







const mainImageUrl =
await saveFile(
mainImage
);









const galleryFiles =
formData.getAll(
"gallery"
) as File[];







const galleryUrls =
[];





for(const file of galleryFiles){


if(file.size > 0){

const url =
await saveFile(file);


galleryUrls.push(url);

}


}









const product =
await prisma.product.create({

data:{


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



image:
mainImageUrl,



description:
String(formData.get("description")),



material:
String(formData.get("material")),



dimensions:
String(formData.get("dimensions")),



stock:
Number(formData.get("stock")),




images:{


create:

galleryUrls.map(url=>({

url

}))


}



}


});







return NextResponse.json({

success:true,

product

});


}