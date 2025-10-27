import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

// GET - Get all companies
export async function GET(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const { searchParams } = new URL(req.url);
      const sortBy = searchParams.get("sortBy") || "name";
      const sortOrder = searchParams.get("sortOrder") || "asc";

      // Define allowed sort fields for security
      const allowedSortFields = ["name", "createdAt", "updatedAt"];
      const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
      const safeSortOrder = sortOrder === "desc" ? "desc" : "asc";

      const companies = await prisma.company.findMany({
        orderBy: {
          [safeSortBy]: safeSortOrder,
        },
        include: {
          _count: {
            select: { clients: true, products: true }
        }
      }
      });

      return NextResponse.json(companies);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Something went wrong" },
        { status: 500 },
      );
    }
  }, "companies", "view");
}

// POST - Create a new company
export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
      const { name, address } = await req.json();

      if (!name || !address) {
        return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
      }

      const existingCompany = await prisma.company.findFirst({ where: { name } });
      if (existingCompany) {
        return NextResponse.json({ error: "Company with this name already exists" }, { status: 400 });
      }

      const company = await prisma.company.create({
        data: { name, address },
        include: {
          _count: {
            select: { clients: true, products: true }
          }
        }
      });

      return NextResponse.json({ data: company, message: "Company created successfully" }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Something went wrong couldn't create company" }, { status: 500 });
    }
  }, "companies", "create");
}