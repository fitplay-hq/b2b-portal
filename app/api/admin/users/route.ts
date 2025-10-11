import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { isAuthorizedAdmin } from "@/lib/utils";

// GET /api/admin/users - Get all users
export async function GET() {
  try {
    const session = await getServerSession(auth);
    
    if (!isAuthorizedAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.systemUser.findMany({
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(auth);
    
    if (!isAuthorizedAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, roleId } = body;

    // Validate required fields
    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Verify role exists
    const role = await prisma.systemRole.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return NextResponse.json(
        { error: "Selected role does not exist" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = await prisma.systemUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    // Return user without password
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isActive: newUser.isActive,
      role: {
        id: newUser.role.id,
        name: newUser.role.name,
        description: newUser.role.description
      },
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}