import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

// PUT /api/products/[id] — Update a product
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productId = Number(id);

    // Update basic product fields
    const product = await prisma.product.update({
      where: { id: productId },
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
        videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
      },
    });

    // If variants are provided, replace them safely
    if (body.variants && Array.isArray(body.variants)) {
      // First, unlink any orderItems from variants of this product so foreign key doesn't fail
      await prisma.orderItem.updateMany({
        where: { productId: productId },
        data: { variantId: null },
      });
      await prisma.productVariant.deleteMany({ where: { productId: productId } });
      if (body.variants.length > 0) {
        await prisma.productVariant.createMany({
          data: body.variants.map((v: any) => ({
            productId: productId,
            size: v.size || 'L',
            color: v.color,
            colorHex: v.colorHex || '#222222',
            stock: v.stock || 10,
          })),
        });
      }
    }

    // If images are provided, replace them
    if (body.images && Array.isArray(body.images)) {
      await prisma.productImage.deleteMany({ where: { productId: productId } });
      if (body.images.length > 0) {
        await prisma.productImage.createMany({
          data: body.images.map((img: any) => ({
            productId: productId,
            imageUrl: img.imageUrl || img,
          })),
        });
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, images: true, variants: true },
    });

    // Trigger static page cache revalidation
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/product/${productId}`);

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
    const productId = Number(id);

    // Safely delete in order so foreign key constraints never fail
    await prisma.$transaction([
      prisma.orderItem.deleteMany({ where: { productId: productId } }),
      prisma.productImage.deleteMany({ where: { productId: productId } }),
      prisma.productVariant.deleteMany({ where: { productId: productId } }),
      prisma.product.delete({ where: { id: productId } }),
    ]);

    // Trigger static page cache revalidation
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/product/${productId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
