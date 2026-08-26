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
      headers: { 'Cache-Control': 'no-store, max-age=0' },
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

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || 'منتج جديد أنيق ومميز من FarOha_Brand',
        price: Number(body.price),
        discountPrice: body.discountPrice ? Number(body.discountPrice) : null,
        categoryId: Number(body.categoryId),
        stock: body.stock || 15,
        material: body.material || null,
        fit: body.fit || null,
        careInstructions: body.careInstructions || 'غسيل يدوي أو ماكينة بارد',
        isNew: body.isNew !== undefined ? body.isNew : true,
        isFeatured: body.isFeatured || false,
        images: {
          create: (body.images || [{ imageUrl: '/images/category_dresses.jpg' }]).map(
            (img: any) => ({ imageUrl: img.imageUrl || img })
          ),
        },
        variants: {
          create: (body.variants || [{ size: 'L', color: 'أسود', colorHex: '#222222', stock: 15 }]).map(
            (v: any) => ({
              size: v.size || 'L',
              color: v.color,
              colorHex: v.colorHex || '#222222',
              stock: v.stock || 10,
            })
          ),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
