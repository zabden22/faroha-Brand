import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/orders/[id] — Update order status
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: body.status },
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
