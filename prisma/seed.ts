import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FarOha Brand database with Esdals only...');

  // Seed Category: Esdals
  const esdalsCategory = await prisma.category.upsert({
    where: { id: 1 },
    update: { name: 'إسدالات', image: '/images/category_esdals.jpg' },
    create: { id: 1, name: 'إسدالات', image: '/images/category_esdals.jpg' },
  });

  // Clear existing products to prevent duplicate seeding
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany({ where: { id: { not: 1 } } });

  // Seed Esdal product
  await prisma.product.create({
    data: {
      id: 1,
      name: 'إسدال الصلاة المريح — بيج ناعم',
      description: 'إسدال صلاة واسع ومريح مصنوع من أجود خامات القطن والفيزكوز الناعم على البشرة، مزود بطرحة متصلة وتطريز أكمام رقيق.',
      price: 650,
      discountPrice: 550,
      categoryId: 1,
      stock: 15,
      material: 'قطن ناعم 100%',
      fit: 'واسع / Oversized',
      careInstructions: 'غسيل يدوي أو ماكينة على درجة حرارة 30 مئوية',
      isNew: true,
      isFeatured: true,
      images: {
        create: [
          { imageUrl: '/images/category_esdals.jpg' },
          { imageUrl: '/images/hero_image.jpg' },
        ],
      },
      variants: {
        create: [
          { size: 'L', color: 'بيج', colorHex: '#D4B9A7', stock: 5 },
          { size: 'XL', color: 'بيج', colorHex: '#D4B9A7', stock: 5 },
          { size: 'XXL', color: 'أسود', colorHex: '#222222', stock: 5 },
        ],
      },
    },
  });

  // Seed Delivery Fees
  const fees = [
    { governorate: 'القاهرة', fee: 50 },
    { governorate: 'الجيزة', fee: 50 },
    { governorate: 'الإسكندرية', fee: 65 },
    { governorate: 'الدقهلية', fee: 75 },
    { governorate: 'البحيرة', fee: 75 },
    { governorate: 'الفيوم', fee: 75 },
    { governorate: 'الغربية', fee: 75 },
    { governorate: 'الإسماعيلية', fee: 70 },
    { governorate: 'المنوفية', fee: 75 },
    { governorate: 'الشرقية', fee: 75 },
    { governorate: 'القليوبية', fee: 55 },
    { governorate: 'السويس', fee: 70 },
    { governorate: 'بورسعيد', fee: 70 },
    { governorate: 'دمياط', fee: 75 },
    { governorate: 'كفر الشيخ', fee: 75 },
    { governorate: 'بني سويف', fee: 85 },
    { governorate: 'المنيا', fee: 90 },
    { governorate: 'أسيوط', fee: 95 },
    { governorate: 'سوهاج', fee: 100 },
    { governorate: 'قنا', fee: 105 },
    { governorate: 'الأقصر', fee: 110 },
    { governorate: 'أسوان', fee: 120 },
    { governorate: 'مطروح', fee: 100 },
    { governorate: 'الوادي الجديد', fee: 120 },
    { governorate: 'البحر الأحمر', fee: 110 },
    { governorate: 'جنوب سيناء', fee: 110 },
    { governorate: 'شمال سيناء', fee: 110 },
  ];

  for (const f of fees) {
    await prisma.deliveryFee.upsert({
      where: { governorate: f.governorate },
      update: { fee: f.fee },
      create: f,
    });
  }

  console.log('🎉 Database updated with Esdals category only!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
