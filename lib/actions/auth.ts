"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "./session";


export async function registerUser(
  data:{
    name:string;
    email:string;
    password:string;
  }
){


const existingUser =
await prisma.user.findUnique({

  where:{
    email:data.email,
  },

});



if(existingUser){

  return {

    success:false,

    message:"Bu email zaten kayıtlı."

  };

}





const hashedPassword =
await bcrypt.hash(
  data.password,
  10
);






const user =
await prisma.user.create({

data:{


name:data.name,


email:data.email,


password:hashedPassword,


},


});






return {

success:true,

userId:user.id

};


}
export async function loginUser(
data:{
email:string;
password:string;
}
){


const user =
await prisma.user.findUnique({

where:{
email:data.email
}

});


if(!user){

return {

success:false,

message:"Email veya şifre hatalı."

};

}



const valid =
await bcrypt.compare(
data.password,
user.password
);



if(!valid){

return {

success:false,

message:"Email veya şifre hatalı."

};

}



await createSession(user.id);



return {

success:true

};


}