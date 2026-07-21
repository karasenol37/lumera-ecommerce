"use server";

import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";





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







async function saveImage(file:File){

  const fileName =
    `${Date.now()}-${file.name.replace(/\s/g,"-")}`;



  const blob = await put(
    fileName,
    file,
    {
      access:"public"
    }
  );


  return blob.url;

}









export async function createProduct(
  formData:FormData
){


  try{


    const name =
      String(formData.get("name"));



    const category =
      String(formData.get("category"));



    const price =
      Number(formData.get("price"));



    const oldPrice =
      Number(formData.get("oldPrice"));



    const description =
      String(formData.get("description"));



    const material =
      String(formData.get("material"));



    const dimensions =
      String(formData.get("dimensions"));



    const stock =
      Number(formData.get("stock"));







    const mainImage =
      formData.get("mainImage") as File;



    if(
      !mainImage ||
      mainImage.size === 0
    ){

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
        `${slug}-${Date.now()}`;

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
      const image of galleryImages
    ){


      if(
        image &&
        image.size > 0
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


    }






    return product;



  }
  catch(error){


    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );


    throw error;


  }


}