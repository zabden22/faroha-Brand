import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();
    const nextOrderNumberIndex = totalOrders + 1;
    const isEligibleForDiscount = nextOrderNumberIndex % 500 === 0;

    const response = NextResponse.json({
      nextOrderNumberIndex,
      isEligibleForDiscount,
    });

    // Disable caching entirely so it is fresh on every checkout page view
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    console.error('Error checking discount eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check discount eligibility', nextOrderNumberIndex: 1, isEligibleForDiscount: false },
      { status: 500 }
    );
  }
}
