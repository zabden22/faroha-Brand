import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/categories/[id] — Update a category
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        image: body.image,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/categories/[id] — Delete a category
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const catId = Number(id);

    // Find all products in this category
    const products = await prisma.product.findMany({
      where: { categoryId: catId },
      select: { id: true },
    });
    const productIds = products.map((p) => p.id);

    if (productIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { productId: { in: productIds } } });
      await prisma.productImage.deleteMany({ where: { productId: { in: productIds } } });
      await prisma.productVariant.deleteMany({ where: { productId: { in: productIds } } });
      await prisma.product.deleteMany({ where: { id: { in: productIds } } });
    }

    await prisma.category.delete({ where: { id: catId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
