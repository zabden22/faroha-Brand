import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FarOha Brand database...');

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'إسدالات', image: '/images/category_esdals.jpg' } }),
    prisma.category.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: 'دريسات', image: '/images/category_dresses.jpg' } }),
    prisma.category.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: 'ملابس واسعة', image: '/images/category_loose.jpg' } }),
    prisma.category.upsert({ where: { id: 4 }, update: {}, create: { id: 4, name: 'تشكيلة جديدة', image: '/images/category_new.jpg' } }),
    prisma.category.upsert({ where: { id: 5 }, update: {}, create: { id: 5, name: 'عروض', image: '/images/category_offers.jpg' } }),
  ]);
  console.log(`✅ ${categories.length} categories seeded`);

  // Clear existing products to prevent duplicate seeding
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  // Seed Products
  const product1 = await prisma.product.create({
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

  const product2 = await prisma.product.create({
    data: {
      id: 2,
      name: 'دريس فروحة الكلاسيكي — موف هادئ',
      description: 'دريس أنيق بياقة كلاسيكية وحزام خصر رقيق، مناسب للخروج اليومي والمناسبات البسيطة.',
      price: 890,
      discountPrice: 790,
      categoryId: 2,
      stock: 8,
      material: 'كركستال روزالين عالي الجودة',
      fit: 'مريح ونازل بسلاسة',
      careInstructions: 'كي بالبخار أو على درجة حرارة خفيفة',
      isNew: true,
      isFeatured: true,
      images: {
        create: [{ imageUrl: '/images/category_dresses.jpg' }],
      },
      variants: {
        create: [
          { size: 'M', color: 'موف', colorHex: '#A3798A', stock: 3 },
          { size: 'L', color: 'موف', colorHex: '#A3798A', stock: 5 },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      id: 3,
      name: 'طقم كاجوال واسع — زيتي ملكي',
      description: 'بلوزة واسعة مع بنطال عريض مريح، مناسب للعمل والجامعة والخروجات اليومية.',
      price: 950,
      discountPrice: null,
      categoryId: 3,
      stock: 12,
      material: 'كتان طبيعي (Linen)',
      fit: 'Loose / فضفاض',
      careInstructions: 'غسيل بارد مع عدم استخدام المبيضات',
      isNew: false,
      isFeatured: true,
      images: {
        create: [{ imageUrl: '/images/category_loose.jpg' }],
      },
      variants: {
        create: [
          { size: 'L', color: 'زيتي', colorHex: '#6B8E7B', stock: 6 },
          { size: 'XL', color: 'زيتي', colorHex: '#6B8E7B', stock: 6 },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      id: 4,
      name: 'دريس الخريف الدافئ — بني شوكولاتة',
      description: 'تصميم راقٍ ومحتشم بأكمام طويلة وثنيات خفيفة تعطي حرية كاملة في الحركة.',
      price: 1100,
      discountPrice: 920,
      categoryId: 5,
      stock: 6,
      material: 'صوف خفيف وناعم',
      fit: 'مستقيم واسع',
      careInstructions: 'تنظيف جاف أو غسيل يدوي',
      isNew: true,
      isFeatured: true,
      images: {
        create: [{ imageUrl: '/images/category_new.jpg' }],
      },
      variants: {
        create: [
          { size: 'L', color: 'بني', colorHex: '#5C4033', stock: 3 },
          { size: 'XL', color: 'بني', colorHex: '#5C4033', stock: 3 },
        ],
      },
    },
  });

  const product5 = await prisma.product.create({
    data: {
      id: 5,
      name: 'فستان السهرة البسيط — نبيذي فاخر',
      description: 'قطعة مميزة ذات طابع أنيق وغير متكلف للمناسبات الخاصة والزيارات العائلية.',
      price: 1250,
      discountPrice: 990,
      categoryId: 5,
      stock: 4,
      material: 'حرير مغسول وفاخر',
      fit: 'واسع ومتهدل',
      careInstructions: 'تنظيف جاف فقط',
      isNew: false,
      isFeatured: false,
      images: {
        create: [{ imageUrl: '/images/category_offers.jpg' }],
      },
      variants: {
        create: [
          { size: 'XL', color: 'نبيذي', colorHex: '#6B1D2F', stock: 4 },
        ],
      },
    },
  });

  console.log(`✅ 5 products seeded with images and variants`);

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
  console.log(`✅ ${fees.length} delivery fees seeded`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
