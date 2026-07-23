import Iyzipay from "iyzipay";


let iyzipayInstance: any = null;


export function getIyzipay() {

  if (!iyzipayInstance) {

    iyzipayInstance = new Iyzipay({

      apiKey:
        process.env.IYZICO_API_KEY!,


      secretKey:
        process.env.IYZICO_SECRET_KEY!,


      uri:
        process.env.IYZICO_BASE_URL!

    });

  }


  return iyzipayInstance;

}