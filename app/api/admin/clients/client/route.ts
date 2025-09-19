import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { ClientUpdateInputObjectSchema } from "@/prisma/generated/schemas";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST - Create client and optionally company
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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

        return NextResponse.json({ data: client, message: "Client added successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong couldn't add client" }, { status: 500 });
    }
}

// GET - Get client by id
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clientId = req.nextUrl.searchParams.get("clientId");
        if (!clientId) {
            return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: { company: true }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({ data: client }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong couldn't fetch client" }, { status: 500 });
    }
}

// DELETE - Delete client
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clientId = req.nextUrl.searchParams.get("clientId");
        if (!clientId) {
            return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
        }

        const client = await prisma.client.delete({
            where: { id: clientId },
        });

        return NextResponse.json({ data: client, message: "Client deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong couldn't delete client" }, { status: 500 });
    }
}

// PATCH - Update client
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(auth);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong couldn't update client" }, { status: 500 });
    }
}
