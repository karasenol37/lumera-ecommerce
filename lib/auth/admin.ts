import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/actions/session";


export async function requireAdmin(){

const user =
await getSessionUser();



if(!user){

redirect("/login");

}



if(user.role !== "ADMIN"){

redirect("/");

}



return user;


}