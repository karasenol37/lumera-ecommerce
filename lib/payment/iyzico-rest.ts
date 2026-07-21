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
.toString();


const signature =
CryptoJS.HmacSHA256(
randomString +
uri +
requestBody,
secretKey
)
.toString(
CryptoJS.enc.Base64
);



return {

Authorization:
`IYZWSv2 ${apiKey}:${randomString}:${signature}`,

"Content-Type":
"application/json"

};


}