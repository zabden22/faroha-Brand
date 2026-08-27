import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/delivery-fees — Get all delivery fees
export async function GET() {
  try {
    const fees = await prisma.deliveryFee.findMany({
      orderBy: { governorate: 'asc' },
    });
    return NextResponse.json(fees, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching delivery fees:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery fees' }, { status: 500 });
  }
}
