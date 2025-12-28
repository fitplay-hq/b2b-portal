import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: { products: true, subCategories: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to manage categories
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SYSTEM_USER') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, displayName, description, shortCode } = body;

    // Validation
    if (!name || !displayName || !shortCode) {
      return NextResponse.json(
        { success: false, error: 'Name, display name, and short code are required' },
        { status: 400 }
      );
    }

    // Convert name to lowercase and remove spaces for consistency
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    const normalizedShortCode = shortCode.toUpperCase().substring(0, 10);

    // Check for duplicates
    const existingCategory = await prisma.productCategory.findFirst({
      where: {
        OR: [
          { name: normalizedName },
          { shortCode: normalizedShortCode },
        ],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category name or short code already exists' },
        { status: 409 }
      );
    }

    // Get the next sort order
    const lastCategory = await prisma.productCategory.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const newSortOrder = (lastCategory?.sortOrder || 0) + 1;

    const category = await prisma.productCategory.create({
      data: {
        name: normalizedName,
        displayName: displayName.trim(),
        description: description?.trim() || null,
        shortCode: normalizedShortCode,
        sortOrder: newSortOrder,
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true, subCategories: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}