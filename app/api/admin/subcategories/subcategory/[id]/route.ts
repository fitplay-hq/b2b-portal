import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SYSTEM_USER') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { name, categoryId, shortCode } = body;

    if (!name || !categoryId || !shortCode) {
      return NextResponse.json(
        { success: false, error: 'Name, category ID, and short code are required' },
        { status: 400 }
      );
    }

    // Check if subcategory exists
    const existingSubcategory = await prisma.subCategory.findUnique({
      where: { id },
    });

    if (!existingSubcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Check if category exists
    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Parent category not found' },
        { status: 404 }
      );
    }

    const updatedSubcategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name: name.trim(),
        categoryId,
        shortCode: shortCode.toUpperCase().substring(0, 10),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedSubcategory,
      message: 'Subcategory updated successfully',
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subcategory' },
      { status: 500 }
    );
  }
}

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

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SYSTEM_USER') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if subcategory exists
    const existingSubcategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingSubcategory) {
      return NextResponse.json(
        { success: false, error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    // Check if subcategory has products
    if (existingSubcategory._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete subcategory. It is currently used by ${existingSubcategory._count.products} product(s). Please move or delete those products first.`,
        },
        { status: 400 }
      );
    }

    // Delete the subcategory
    await prisma.subCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subcategory' },
      { status: 500 }
    );
  }
}
