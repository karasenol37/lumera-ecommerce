import { prisma } from "@/lib/prisma";


type ProductFilter = {

  category?: string;

  sort?: string;

};




export async function getProducts(
  filters?: ProductFilter
) {


const where:any = {

  isActive:true

};




// Kategori filtresi

if(
  filters?.category &&
  filters.category !== "Tümü"
){

  where.category = filters.category;

}





let orderBy:any = {

  createdAt:"desc"

};





if(filters?.sort === "price-asc"){

  orderBy = {

    price:"asc"

  };

}





if(filters?.sort === "price-desc"){

  orderBy = {

    price:"desc"

  };

}






return await prisma.product.findMany({

  where,

  orderBy,

});



}









export async function getProductBySlug(
  slug:string
){


return await prisma.product.findUnique({

where:{

  slug,

  },

});



}