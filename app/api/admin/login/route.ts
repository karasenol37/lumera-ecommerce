import { NextResponse } from "next/server";

import {
  checkAdminLogin
} from "@/lib/admin";

import {
  createSession
} from "@/lib/auth";



export async function POST(
  request:Request
){

  const body =
    await request.json();



  const {
    email,
    password
  } = body;



  const valid =
    checkAdminLogin(
      email,
      password
    );



  if(!valid){

    return NextResponse.json(
      {
        message:"Hatalı giriş"
      },
      {
        status:401
      }
    );

  }



  await createSession();



  return NextResponse.json({
    success:true
  });


}