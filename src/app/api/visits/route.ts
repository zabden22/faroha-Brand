import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/visits — Return visitor statistics
export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalVisits, todayVisits, thisMonthVisits, uniqueVisitorsGroup, recentVisits] =
      await Promise.all([
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
        prisma.siteVisit.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    const uniqueVisitors = uniqueVisitorsGroup.length;

    const response = NextResponse.json({
      totalVisits,
      uniqueVisitors: Math.max(uniqueVisitors, totalVisits > 0 ? 1 : 0),
      todayVisits,
      thisMonthVisits,
      recentVisits,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json(
      { totalVisits: 0, uniqueVisitors: 0, todayVisits: 0, thisMonthVisits: 0, recentVisits: [] },
      { status: 500 }
    );
  }
}

// POST /api/visits — Record a new site visit
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const visitorId = body.visitorId ? String(body.visitorId).slice(0, 100) : null;
    const path = body.path ? String(body.path).slice(0, 200) : '/';

    // Avoid recording admin routes
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const visit = await prisma.siteVisit.create({
      data: {
        visitorId,
        path,
      },
    });

    return NextResponse.json({ ok: true, id: visit.id });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
