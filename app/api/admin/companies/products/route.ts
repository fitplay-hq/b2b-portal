import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST - Assign products to a company
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { companyId, productIds } = await req.json();

    if (!companyId || !Array.isArray(productIds) || productIds.length === 0)
      return NextResponse.json({ error: "companyId and productIds are required" }, { status: 400 });

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        products: {
          connect: productIds.map((id: string) => ({ id }))
        }
      },
      include: { products: true }
    });

    return NextResponse.json({ data: updatedCompany, message: "Products assigned successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const companyId = req.nextUrl.searchParams.get("companyId");
    const productIds = req.nextUrl.searchParams.getAll("productIds");

    if (!companyId || productIds.length === 0)
      return NextResponse.json({ error: "companyId and productIds are required" }, { status: 400 });

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        products: {
          disconnect: productIds.map((id) => ({ id }))
        }
      },
      include: { products: true }
    });

    return NextResponse.json({ data: updatedCompany, message: "Products removed successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

// GET - Get all products of a company
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const companyId = req.nextUrl.searchParams.get("companyId");
    if (!companyId)
      return NextResponse.json({ error: "companyId is required" }, { status: 400 });

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { products: true }
    });

    if (!company)
      return NextResponse.json({ error: "Company not found" }, { status: 404 });

    return NextResponse.json({ data: company.products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
