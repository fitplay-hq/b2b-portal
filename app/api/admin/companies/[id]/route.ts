import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Get a specific company by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = params.id;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: { clients: true, products: true }
        },
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            categories: true,
            availableStock: true
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ data: company }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong couldn't fetch company" }, { status: 500 });
  }
}

// PATCH - Update a company
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = params.id;
    const { name, address } = await req.json();

    if (!name || !address) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
    }

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { name, address },
      include: {
        _count: {
          select: { clients: true, products: true }
        },
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
            categories: true,
            availableStock: true
          }
        }
      }
    });

    return NextResponse.json({ data: company, message: "Company updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong couldn't update company" }, { status: 500 });
  }
}

// DELETE - Delete a company
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = params.id;

    // Check if company has clients
    const companyWithClients = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: { clients: true }
        }
      }
    });

    if (!companyWithClients) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    if (companyWithClients._count.clients > 0) {
      return NextResponse.json({
        error: "Cannot delete company with existing clients. Please reassign or delete clients first."
      }, { status: 400 });
    }

    const company = await prisma.company.delete({
      where: { id: companyId },
    });

    return NextResponse.json({ data: company, message: "Company deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong couldn't delete company" }, { status: 500 });
  }
}