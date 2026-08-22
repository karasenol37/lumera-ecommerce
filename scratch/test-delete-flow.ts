import { prisma } from "../lib/prisma";

async function main() {
  const products = await prisma.product.findMany({ take: 5 });
  console.log("Existing products:", products.map(p => ({ id: p.id, name: p.name })));

  const orders = await prisma.orderItem.findMany({ select: { productId: true, orderId: true } });
  console.log("Order items referencing products:", orders);
}

main().catch(console.error);
