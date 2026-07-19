import Iyzipay from "iyzipay";


export function getIyzipay(){


  return new Iyzipay({

    apiKey:
      process.env.IYZICO_API_KEY!,


    secretKey:
      process.env.IYZICO_SECRET_KEY!,


    uri:
      process.env.IYZICO_BASE_URL!

  });


}