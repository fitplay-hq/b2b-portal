import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

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
        const { name, categoryId, shortCode } = body;

        // Validation
        if (!name || !categoryId || !shortCode) {
            return NextResponse.json(
                { success: false, error: 'Name, category ID, and short code are required' },
                { status: 400 }
            );
        }

        // Create new subcategory
        const newSubcategory = await prisma.subCategory.create({
            data: {
                name,
                categoryId,
                shortCode,
            },
        });

        return NextResponse.json({
            success: true,
            data: newSubcategory,
        });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create subcategory' },
            { status: 500 }
        );
    }
}

// GET - Fetch all subcategories
export async function GET() {
    try {
        const subcategories = await prisma.subCategory.findMany({
            orderBy: {
                name: 'asc',
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: subcategories,
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch subcategories' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
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

        const { searchParams } = new URL(req.url);
        const subcategoryId = searchParams.get('id');

        if (!subcategoryId) {
            return NextResponse.json(
                { success: false, error: 'Subcategory ID is required' },
                { status: 400 }
            );
        }

        await prisma.subCategory.delete({
            where: { id: subcategoryId },
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

export async function PATCH(req: NextRequest) {
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
        const { id, name, categoryId, shortCode } = body;

        // Validation
        if (!id || !name || !categoryId || !shortCode) {
            return NextResponse.json(
                { success: false, error: 'ID, name, category ID, and short code are required' },
                { status: 400 }
            );
        }

        // Update subcategory
        const updatedSubcategory = await prisma.subCategory.update({
            where: { id },
            data: {
                name,
                categoryId,
                shortCode,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedSubcategory,
            message: 'Subcategory updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating subcategory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update subcategory' },
            { status: 500 }
        );
    }
}