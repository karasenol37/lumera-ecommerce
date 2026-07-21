import Iyzipay from "iyzipay";

export function getIyzipay() {
  if (!process.env.IYZICO_API_KEY) {
    throw new Error("IYZICO_API_KEY bulunamadı.");
  }

  if (!process.env.IYZICO_SECRET_KEY) {
    throw new Error("IYZICO_SECRET_KEY bulunamadı.");
  }

  if (!process.env.IYZICO_BASE_URL) {
    throw new Error("IYZICO_BASE_URL bulunamadı.");
  }

  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL,
  });
}