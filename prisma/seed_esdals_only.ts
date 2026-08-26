import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database: Keeping ONLY "إسدالات" category...');

  // 1. Get Esdals category or create it if missing
  let esdalsCategory = await prisma.category.findFirst({
    where: { name: { contains: 'إسدال' } },
  });

  if (!esdalsCategory) {
    esdalsCategory = await prisma.category.create({
      data: {
        name: 'إسدالات',
        image: '/images/category_esdals.jpg',
      },
    });
  }

  // 2. Delete all categories that are NOT Esdals
  const otherCategories = await prisma.category.findMany({
    where: { id: { not: esdalsCategory.id } },
  });

  const otherCatIds = otherCategories.map((c) => c.id);

  if (otherCatIds.length > 0) {
    // Delete products under other categories
    await prisma.productImage.deleteMany({
      where: { product: { categoryId: { in: otherCatIds } } },
    });
    await prisma.productVariant.deleteMany({
      where: { product: { categoryId: { in: otherCatIds } } },
    });
    await prisma.product.deleteMany({
      where: { categoryId: { in: otherCatIds } },
    });
    await prisma.category.deleteMany({
      where: { id: { in: otherCatIds } },
    });
  }

  // Update remaining products under Esdals
  const esdalsProducts = await prisma.product.findMany({
    where: { categoryId: esdalsCategory.id },
  });

  console.log(`✅ Cleaned database! Remaining category: "${esdalsCategory.name}" (#${esdalsCategory.id}) with ${esdalsProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
