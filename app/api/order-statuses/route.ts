import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get distinct status values from orders
    const statuses = await prisma.order.findMany({
      select: {
        status: true,
      },
      distinct: ['status'],
      orderBy: {
        status: 'asc',
      },
    });

    // Extract just the status values
    const statusValues = statuses.map(s => s.status);

    return NextResponse.json(statusValues);
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    return NextResponse.json({ error: 'Failed to fetch order statuses' }, { status: 500 });
  }
}
