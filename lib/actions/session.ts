"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";


export async function createSession(
  userId:number
){

const cookieStore = await cookies();


cookieStore.set(
  "lumera-user",
  String(userId),
  {
    httpOnly:true,
    secure:false,
    sameSite:"lax",
    maxAge:60*60*24*7,
    path:"/",
  }
);


}



export async function getSessionUser(){

const cookieStore = await cookies();


const userId =
cookieStore.get("lumera-user")?.value;



if(!userId){

return null;

}



const user =
await prisma.user.findUnique({

where:{
id:Number(userId)
},

select:{
id:true,
name:true,
email:true,
role:true
}

});


return user;


}



export async function logout(){

const cookieStore = await cookies();


cookieStore.delete(
"lumera-user"
);


}