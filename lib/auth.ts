import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";


const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);



export async function createSession(){

  const token = await new SignJWT({
    admin:true,
  })

  .setProtectedHeader({
    alg:"HS256",
  })

  .setIssuedAt()

  .setExpirationTime(
    "7d"
  )

  .sign(secret);



  const cookieStore = await cookies();


  cookieStore.set(
    "admin-session",
    token,
    {
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge:60*60*24*7,
    }
  );

}





export async function getSession(){

  const cookieStore = await cookies();


  const token =
    cookieStore.get(
      "admin-session"
    )?.value;



  if(!token){
    return null;
  }



  try{

    const verified =
      await jwtVerify(
        token,
        secret
      );


    return verified;

  }

  catch{

    return null;

  }

}





export async function logout(){

  const cookieStore = await cookies();


  cookieStore.delete(
    "admin-session"
  );

}