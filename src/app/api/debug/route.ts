import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envKeys = Object.keys(process.env);
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const hasDirectUrl = !!process.env.DIRECT_URL;
  const databaseUrlStart = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL.substring(0, 30) + '...'
    : 'not set';

  let connectionSuccess = false;
  let errorDetails = '';

  const prisma = new PrismaClient();
  try {
    // Try a simple raw query
    await prisma.$queryRaw`SELECT 1`;
    connectionSuccess = true;
  } catch (err: any) {
    connectionSuccess = false;
    errorDetails = err?.message || String(err);
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({
    envKeys,
    hasDatabaseUrl,
    hasDirectUrl,
    databaseUrlStart,
    connectionSuccess,
    errorDetails,
  });
}
