import crypto from "crypto";


function generateRandomKey(){

  return (
    Date.now().toString()
    +
    Math.random()
      .toString(36)
      .substring(2,15)
  );

}




export function generateIyzipayAuthorization(
  body:string
){


  const apiKey =
    process.env.IYZICO_API_KEY!;


  const secretKey =
    process.env.IYZICO_SECRET_KEY!;



  const randomKey =
    generateRandomKey();



  const payload =
    randomKey +
    body;



  const signature =
    crypto
      .createHmac(
        "sha256",
        secretKey
      )
      .update(payload)
      .digest("hex");



  const authorizationString =
    `${apiKey}:${signature}`;



  const authorization =
    Buffer
      .from(
        authorizationString
      )
      .toString("base64");



  return {

    Authorization:
      `IYZWSv2 ${authorization}`,

    "x-iyzi-rnd":
      randomKey,

    "Content-Type":
      "application/json"

  };


}





export async function iyzicoRequest(

  endpoint:string,

  data:any

){


  const body =
    JSON.stringify(data);



  const response =
    await fetch(

      `${process.env.IYZICO_BASE_URL}${endpoint}`,

      {

        method:"POST",


        headers:
          generateIyzipayAuthorization(body),


        body

      }

    );



  return await response.json();


}