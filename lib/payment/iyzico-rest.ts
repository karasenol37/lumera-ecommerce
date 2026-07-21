import CryptoJS from "crypto-js";


export function generateIyzipayAuthorization(
  uri:string,
  requestBody:string
){

  const apiKey =
    process.env.IYZICO_API_KEY!;


  const secretKey =
    process.env.IYZICO_SECRET_KEY!;



  const randomString =
    CryptoJS.lib.WordArray.random(16)
    .toString(
      CryptoJS.enc.Hex
    );



  const payload =
    randomString +
    uri +
    requestBody;



  const signature =
    CryptoJS.HmacSHA256(
      payload,
      secretKey
    )
    .toString(
      CryptoJS.enc.Base64
    );



  return {

    Authorization:
      `IYZWSv2 ${apiKey}:${signature}`,

    "x-iyzi-rnd":
      randomString,

    "Content-Type":
      "application/json"

  };

}