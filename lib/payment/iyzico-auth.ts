import Iyzipay from "iyzipay";

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || "",
  secretKey: process.env.IYZICO_SECRET_KEY || "",
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

export function initializeCheckoutForm(requestData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function retrieveCheckoutForm(requestData: any): Promise<any> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(requestData, (err: any, result: any) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}