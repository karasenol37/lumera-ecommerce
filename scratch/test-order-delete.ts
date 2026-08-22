import { prisma } from "../lib/prisma";

async function main() {
  const orders = await prisma.order.findMany({
    select: { id: true, status: true, fullName: true, total: true },
  });
  console.log("Current orders in DB:", JSON.stringify(orders, null, 2));
}

main().catch(console.error);
