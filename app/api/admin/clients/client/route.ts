import prisma from "@/lib/prisma";
import { ClientUpdateInputObjectSchema } from "@/lib/generated/zod/schemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";

// POST - Create client and optionally company
export async function POST(req: NextRequest) {
  return withPermissions(req, async () => {
    try {

        const body = await req.json();
        const { name, email, password, phone, address, isNewCompany, companyName, companyAddress, isShowPrice } = body;

        if (!name || !email || !password || !phone || !address || !companyName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingClient = await prisma.client.findUnique({ where: { email } });
        if (existingClient) {
            return NextResponse.json({ error: "Client with this email already exists" }, { status: 400 });
        }

        let companyId: string;

        if (isNewCompany) {
            if (!companyAddress) {
                return NextResponse.json({ error: "Company address is required for new company" }, { status: 400 });
            }

            const createdCompany = await prisma.company.create({
                data: {
                    name: companyName,
                    address: companyAddress
                }
            });
            companyId = createdCompany.id;
        } else {
            const existingCompany = await prisma.company.findFirst({
                where: { name: companyName }
            });
            if (!existingCompany) {
                return NextResponse.json({ error: "Company not found" }, { status: 404 });
            }
            companyId = existingCompany.id;
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        const client = await prisma.client.create({
            data: {
                name,
                email,
                password: passwordHash,
                phone,
                address,
                companyID: companyId,
                isShowPrice: isShowPrice || false
            },
        });

        // Fetch the created client with relationships
        const createdClient = await prisma.client.findUnique({
            where: { id: client.id },
            include: {
                company: true,
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return NextResponse.json({ data: createdClient, message: "Client added successfully" }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong couldn't add client";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }, "clients", "create");
}

// GET - Get client by id
export async function GET(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
        const clientId = req.nextUrl.searchParams.get("clientId");
        if (!clientId) {
            return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: { 
                company: true,
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({ data: client }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong couldn't fetch client";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }, "clients", "view");
}

// DELETE - Delete client
export async function DELETE(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
        const clientId = req.nextUrl.searchParams.get("clientId");
        if (!clientId) {
            return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
        }

        // Check if client has any orders first
        const existingOrders = await prisma.order.findFirst({
            where: { clientId: clientId }
        });

        if (existingOrders) {
            return NextResponse.json({ 
                error: "Cannot delete client with existing orders. Please remove orders first." 
            }, { status: 400 });
        }

        // Check if client exists
        const existingClient = await prisma.client.findUnique({
            where: { id: clientId }
        });

        if (!existingClient) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        const client = await prisma.client.delete({
            where: { id: clientId },
        });

        return NextResponse.json({ data: client, message: "Client deleted successfully" }, { status: 200 });
    } catch (error: unknown) {
        console.error("Client deletion error:", error);
        const errorMessage = error instanceof Error ? error.message : "Something went wrong couldn't delete client";
        return NextResponse.json({ 
            error: errorMessage 
        }, { status: 500 });
    }
  }, "clients", "delete");
}

// PATCH - Update client
export async function PATCH(req: NextRequest) {
  return withPermissions(req, async () => {
    try {
        const body = await req.json();
        const result = ClientUpdateInputObjectSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        if (result.data.password) {
            return NextResponse.json({ error: "Password cannot be updated by Admin" }, { status: 400 });
        }

        if (!result.data.id) {
            return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
        }

        const client = await prisma.client.update({
            where: { id: result.data.id.toString() },
            data: result.data
        });

        return NextResponse.json({ data: client, message: "Client updated successfully" }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong couldn't update client";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }, "clients", "edit");
}
