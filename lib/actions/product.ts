"use server";

import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";





function createSlug(text:string){

  return text

    .toLowerCase()

    .replace(/ğ/g,"g")
    .replace(/ü/g,"u")
    .replace(/ş/g,"s")
    .replace(/ı/g,"i")
    .replace(/ö/g,"o")
    .replace(/ç/g,"c")

    .replace(/[^a-z0-9]+/g,"-")

    .replace(/^-+|-+$/g,"");

}









async function saveImage(
  file:File
){


  const bytes =
  await file.arrayBuffer();


  const buffer =
  Buffer.from(bytes);



  const fileName =
  Date.now()
  +
  "-"
  +
  file.name.replace(/\s/g,"-");




  const uploadPath =
  path.join(
    process.cwd(),
    "public/uploads",
    fileName
  );




  await writeFile(
    uploadPath,
    buffer
  );



  return "/uploads/" + fileName;


}









export async function createProduct(
  formData:FormData
){



  const name =
  formData.get("name") as string;



  const category =
  formData.get("category") as string;



  const price =
  Number(
    formData.get("price")
  );



  const oldPrice =
  Number(
    formData.get("oldPrice")
  );



  const description =
  formData.get("description") as string;



  const material =
  formData.get("material") as string;



  const dimensions =
  formData.get("dimensions") as string;



  const stock =
  Number(
    formData.get("stock")
  );







  const mainImage =
  formData.get("mainImage") as File;



  if(!mainImage){

    throw new Error(
      "Ana resim zorunlu."
    );

  }







  const imageUrl =
  await saveImage(
    mainImage
  );






  let slug =
  createSlug(name);





  const existingProduct =
  await prisma.product.findUnique({

    where:{
      slug
    }

  });





  if(existingProduct){


    slug =
    slug
    +
    "-"
    +
    Date.now();


  }









  const product =
  await prisma.product.create({

    data:{


      name,


      slug,


      category,


      price,


      oldPrice,


      description,


      material,


      dimensions,


      stock,


      image:imageUrl



    }


  });










  const galleryImages =
  formData.getAll(
    "images"
  ) as File[];







  for(
    const image
    of
    galleryImages
  ){


    const url =
    await saveImage(
      image
    );



    await prisma.productImage.create({

      data:{


        url,


        productId:
        product.id


      }

    });


  }







  return product;


}