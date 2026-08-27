import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/products — Get all products with images, variants, category
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products — Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'اسم المنتج والسعر مطلوبان' },
        { status: 400 }
      );
    }

    // Ensure valid categoryId or fallback
    let categoryId = Number(body.categoryId);
    if (!categoryId || isNaN(categoryId)) {
      const firstCat = await prisma.category.findFirst({ orderBy: { id: 'asc' } });
      categoryId = firstCat ? firstCat.id : 1;
    } else {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        const firstCat = await prisma.category.findFirst({ orderBy: { id: 'asc' } });
        categoryId = firstCat ? firstCat.id : 1;
      }
    }

    const product = await prisma.product.create({
      data: {
        name: String(body.name).trim(),
        description:
          body.description || 'منتج جديد أنيق ومميز من FarOha_Brand',
        price: Number(body.price),
        discountPrice: body.discountPrice ? Number(body.discountPrice) : null,
        categoryId: categoryId,
        stock: body.stock ? Number(body.stock) : 15,
        material: body.material || null,
        fit: body.fit || null,
        careInstructions: body.careInstructions || 'غسيل يدوي أو ماكينة بارد',
        isNew: body.isNew !== undefined ? body.isNew : true,
        isFeatured: body.isFeatured || false,
        videoUrl: body.videoUrl ? String(body.videoUrl).trim() : null,
        images: {
          create: (body.images && body.images.length > 0
            ? body.images
            : [{ imageUrl: '/images/category_dresses.jpg' }]
          ).map((img: any) => ({ imageUrl: img.imageUrl || img })),
        },
        variants: {
          create: (body.variants && body.variants.length > 0
            ? body.variants
            : [{ size: 'L', color: 'أسود', colorHex: '#1A1A1A', stock: 15 }]
          ).map((v: any) => ({
            size: v.size || 'L',
            color: v.color || 'أسود',
            colorHex: v.colorHex || '#1A1A1A',
            stock: v.stock ? Number(v.stock) : 10,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
