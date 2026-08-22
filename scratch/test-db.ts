import { prisma } from "../lib/prisma";

async function main() {
  const contactModel = (prisma as any).contactMessage;
  if (contactModel) {
    const messages = await contactModel.findMany();
    console.log("MESSAGES IN DB:", JSON.stringify(messages, null, 2));
  } else {
    console.log("contactMessage model not found");
  }
}

main().catch(console.error);
