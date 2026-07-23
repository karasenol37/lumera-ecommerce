import crypto from "crypto";


export function generateIyzipayAuthorization(
  body: string
) {


  const randomKey =
    Date.now().toString()
    +
    Math.random()
      .toString(36)
      .substring(2);



  const signature =
    crypto
      .createHmac(
        "sha256",
        process.env.IYZICO_SECRET_KEY!
      )
      .update(
        randomKey + body
      )
      .digest("hex");



  const authorization =
    Buffer
      .from(
        process.env.IYZICO_API_KEY!
        +
        ":"
        +
        signature
      )
      .toString("base64");



  return {

    Authorization:
      `IYZWS ${authorization}`,

    "x-iyzi-rnd":
      randomKey,

    "Content-Type":
      "application/json"

  };

}






export async function iyzicoRequest(
  endpoint: string,
  data: any
) {


  const body =
    JSON.stringify(data);



  const response =
    await fetch(

      process.env.IYZICO_BASE_URL! + endpoint,

      {
        method:"POST",

        headers:
          generateIyzipayAuthorization(body),

        body

      }

    );



  return await response.json();

}