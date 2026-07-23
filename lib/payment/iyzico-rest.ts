import crypto from "crypto";

export function generateIyzipayAuthorization(
  uri: string,
  body: string
) {
  const apiKey = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;

  const randomKey = crypto.randomBytes(16).toString("hex");

  const payload =
    randomKey +
    uri +
    body;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("base64");

  const authorization = Buffer.from(
    `${apiKey}:${randomKey}:${signature}`
  ).toString("base64");

  return {
    Authorization: `IYZWSv2 ${authorization}`,
    "x-iyzi-rnd": randomKey,
    "Content-Type": "application/json",
  };
}