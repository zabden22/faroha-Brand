import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/orders — Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderNumber = `FAR-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount: Number(body.totalAmount),
        deliveryFee: Number(body.deliveryFee),
        status: 'pending',
        paymentMethod: body.paymentMethod || 'الدفع عند الاستلام',
        customerName: body.customerName,
        phone: body.phone,
        governorate: body.governorate,
        city: body.city,
        address: body.address,
        notes: body.notes || null,
        items: {
          create: (body.items || []).map((item: any) => ({
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
