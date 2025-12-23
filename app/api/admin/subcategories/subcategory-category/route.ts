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

        const body = await req.json();
        const { categoryId } = body;

        // Validation
        if (!categoryId) {
            return NextResponse.json(
                { success: false, error: 'Category ID is required' },
                { status: 400 }
            );
        }

        const subcategories = await prisma.subCategory.findMany({
            where: { categoryId },
            orderBy: { name: 'asc' },
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