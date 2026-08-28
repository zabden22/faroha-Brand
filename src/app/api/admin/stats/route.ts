import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      ordersCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      totalSalesAgg,
      recentOrders,
      productsCount,
      categories,
      totalVisits,
      todayVisits,
      thisMonthVisits,
      uniqueVisitorsGroup,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'delivered' } }),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
          deliveryFee: true,
        },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          phone: true,
          totalAmount: true,
          deliveryFee: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.product.count(),
      prisma.category.findMany({
        orderBy: { id: 'asc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.siteVisit.count(),
      prisma.siteVisit.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.siteVisit.count({
        where: { createdAt: { gte: monthStart } },
      }),
      prisma.siteVisit.groupBy({
        by: ['visitorId'],
        where: { visitorId: { not: null } },
      }),
    ]);

    const totalSales =
      (totalSalesAgg._sum.totalAmount || 0) + (totalSalesAgg._sum.deliveryFee || 0);

    const uniqueVisitors = Math.max(
      uniqueVisitorsGroup.length,
      totalVisits > 0 ? 1 : 0
    );

    const response = NextResponse.json({
      ordersCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      totalSales,
      recentOrders,
      productsCount,
      categories,
      visitorStats: {
        totalVisits,
        todayVisits,
        thisMonthVisits,
        uniqueVisitors,
      },
    });

    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, max-age=0'
    );
    return response;
  } catch (error) {
    console.error('Error in /api/admin/stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
