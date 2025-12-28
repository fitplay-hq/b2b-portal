import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/api/auth/[...nextauth]/route';

// PUT - Update category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SYSTEM_USER') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { name, displayName, description, shortCode, isActive, sortOrder } = body;

    // Check if category exists
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Validation
    if (!name || !displayName || !shortCode) {
      return NextResponse.json(
        { success: false, error: 'Name, display name, and short code are required' },
        { status: 400 }
      );
    }

    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    const normalizedShortCode = shortCode.toUpperCase().substring(0, 10);

    // Check for duplicates (excluding current category)
    const duplicateCategory = await prisma.productCategory.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name: normalizedName },
              { shortCode: normalizedShortCode },
            ],
          },
        ],
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { success: false, error: 'Category name or short code already exists' },
        { status: 409 }
      );
    }

    const updatedCategory = await prisma.productCategory.update({
      where: { id },
      data: {
        name: normalizedName,
        displayName: displayName.trim(),
        description: description?.trim() || null,
        shortCode: normalizedShortCode,
        isActive: isActive ?? existingCategory.isActive,
        sortOrder: sortOrder ?? existingCategory.sortOrder,
      },
      include: {
        _count: {
          select: { products: true, subCategories: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SYSTEM_USER') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if category exists
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, subCategories: true },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has subcategories
    if (existingCategory._count.subCategories > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. It has ${existingCategory._count.subCategories} subcategory(ies). Please delete the subcategories first.` 
        },
        { status: 400 }
      );
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete category. It is currently used by ${existingCategory._count.products} product(s). Please move or delete those products first.` 
        },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.productCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}