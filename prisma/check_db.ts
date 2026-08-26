import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log('Products in DB:', count);
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
