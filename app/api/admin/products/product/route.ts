import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/lib/generated/prisma";
import {z} from "zod";

const CreateProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    images: z.array(z.string().url()),
    price: z.number().min(0),
    sku: z.string().min(2).max(100),
    availableStock: z.number().min(0),
    description: z.string().min(10).max(1000),
    specification: z.record(z.string(), z.any()),
    categories: z.enum(Category),
    avgRating: z.number().min(0).optional(),
    noOfReviews: z.number().min(0).optional(),
    brand: z.string().min(2).max(100),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Invalid Product ID" }, { status: 400 });
        }
        const product = await prisma.product.findUnique({
            where: { id: id },
        });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }


        const body = await req.json();
        const result = CreateProductSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.format() },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: result.data,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const result = CreateProductSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.format() },
                { status: 400 }
            );
        }

        const product = await prisma.product.update({
            where: { id: result.data.id },
            data: result.data,
        });

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session?.user || session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Invalid Product ID" }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}

