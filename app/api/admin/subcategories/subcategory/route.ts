import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

        const subcategory = await prisma.subCategory.findUnique({
            where: { id: subcategoryId },
        });

        if (!subcategory) {
            return NextResponse.json(
                { success: false, error: 'Subcategory not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: subcategory,
            message: 'Subcategory fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch subcategory' },
            { status: 500 }
        );
    }
}