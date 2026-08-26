import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categories — Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories — Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        image: body.image || '/images/category_dresses.jpg',
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
