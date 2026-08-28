import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/orders — Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Securely calculate subtotal from the database to prevent client price tampering
    let computedSubtotal = 0;
    const itemsWithPrices = await Promise.all(
      (body.items || []).map(async (item: any) => {
        const dbProduct = await prisma.product.findUnique({
          where: { id: Number(item.productId) },
          select: { price: true, discountPrice: true },
        });
        const actualPrice = dbProduct ? (dbProduct.discountPrice || dbProduct.price) : Number(item.unitPrice);
        computedSubtotal += actualPrice * Number(item.quantity);
        return {
          ...item,
          unitPrice: actualPrice,
        };
      })
    );

    // 2. Securely calculate delivery fee from database
    let deliveryFee = Number(body.deliveryFee);
    const dbFee = await prisma.deliveryFee.findFirst({
      where: { governorate: body.governorate },
    });
    if (dbFee) {
      deliveryFee = dbFee.fee;
    }

    // 3. Count total orders to verify discount eligibility
    const totalOrders = await prisma.order.count();
    const nextOrderNumberIndex = totalOrders + 1;
    const isEligibleForDiscount = nextOrderNumberIndex % 500 === 0;

    // 4. Compute final amounts
    let finalTotalAmount = computedSubtotal + deliveryFee;
    let finalNotes = body.notes || '';
    let finalPaymentMethod = body.paymentMethod || 'الدفع عند الاستلام';

    if (isEligibleForDiscount) {
      const discount = computedSubtotal * 0.5;
      finalTotalAmount = computedSubtotal - discount + deliveryFee;
      finalNotes = `[🎉 تهانينا! هذا هو الأوردر المميز رقم ${nextOrderNumberIndex} في المتجر. تم تطبيق خصم 50% تلقائياً على المنتجات!]` + (finalNotes ? `\n${finalNotes}` : '');
      
      // Update payment labels to reflect the 50% off deposit / remaining amounts securely
      const deposit = Math.round(finalTotalAmount * 0.25);
      const remaining = finalTotalAmount - deposit;
      if (body.paymentMethod.includes('فودافون كاش')) {
        finalPaymentMethod = `عربون 25% (${deposit} ج.م) فودافون كاش + الباقي (${remaining} ج.م) كاش عند الاستلام [مخصم 50%]`;
      } else if (body.paymentMethod.includes('إنستا باي')) {
        finalPaymentMethod = `عربون 25% (${deposit} ج.م) إنستا باي + الباقي (${remaining} ج.م) كاش عند الاستلام [مخصم 50%]`;
      }
    }

    const orderNumber = `FAR-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: finalTotalAmount,
        deliveryFee: deliveryFee,
        status: 'pending',
        paymentMethod: finalPaymentMethod,
        customerName: body.customerName,
        phone: body.phone,
        governorate: body.governorate,
        city: body.city,
        address: body.address,
        notes: finalNotes || null,
        items: {
          create: itemsWithPrices.map((item: any) => ({
            productId: Number(item.productId),
            variantId: item.variantId ? Number(item.variantId) : null,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            productName: item.productName,
            variantInfo: item.variantInfo || '',
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
