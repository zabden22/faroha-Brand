import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/products/[id] — Update a product
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update basic product fields
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        description: body.description,
        price: body.price !== undefined ? Number(body.price) : undefined,
        discountPrice: body.discountPrice !== undefined ? (body.discountPrice ? Number(body.discountPrice) : null) : undefined,
        categoryId: body.categoryId !== undefined ? Number(body.categoryId) : undefined,
        material: body.material,
        fit: body.fit,
        isNew: body.isNew,
        isFeatured: body.isFeatured,
      },
    });

    // If variants are provided, replace them
    if (body.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: Number(id) } });
      await prisma.productVariant.createMany({
        data: body.variants.map((v: any) => ({
          productId: Number(id),
          size: v.size || 'L',
          color: v.color,
          colorHex: v.colorHex || '#222222',
          stock: v.stock || 10,
        })),
      });
    }

    // If images are provided, replace them
    if (body.images) {
      await prisma.productImage.deleteMany({ where: { productId: Number(id) } });
      await prisma.productImage.createMany({
        data: body.images.map((img: any) => ({
          productId: Number(id),
          imageUrl: img.imageUrl || img,
        })),
      });
    }

    const updated = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true, images: true, variants: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Delete a product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
