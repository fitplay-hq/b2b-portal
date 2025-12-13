import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";

// GET /api/admin/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    // Check permissions - only ADMIN should access users
    const permissionCheck = await checkPermission(RESOURCES.USERS, 'view');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error || "Unauthorized - Admin access required" },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const user = await prisma.systemUser.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        permissions: user.role.permissions
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    // Check permissions - only ADMIN should update users
    const permissionCheck = await checkPermission(RESOURCES.USERS, 'update');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error || "Unauthorized - Admin access required" },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, roleId, isActive } = body;

    // Check if user exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.systemUser.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
    }

    // Verify role exists if roleId is provided
    if (roleId) {
      const role = await prisma.systemRole.findUnique({
        where: { id: roleId }
      });

      if (!role) {
        return NextResponse.json(
          { error: "Selected role does not exist" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (roleId) updateData.roleId = roleId;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    // Hash password if provided
    if (password) {
      updateData.password = await hash(password, 12);
    }

    // Update user
    const updatedUser = await prisma.systemUser.update({
      where: { id },
      data: updateData,
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
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isActive: updatedUser.isActive,
      role: {
        id: updatedUser.role.id,
        name: updatedUser.role.name,
        description: updatedUser.role.description
      },
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    // Validate that id exists
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("DELETE user request - ID:", id);

    // Check permissions - only ADMIN should delete users
    const permissionCheck = await checkPermission(RESOURCES.USERS, 'delete');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error || "Unauthorized - Admin access required" },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    // Get current user session to prevent self-deletion
    const session = permissionCheck.session;
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Deleting user:", { id, name: existingUser.name });

    // Delete user
    await prisma.systemUser.delete({
      where: { id }
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    // Log detailed error for server-side debugging
    console.error("Error deleting user:", error);
    console.error("Error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
      userId: id
    });
    
    // Return generic error message to frontend
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}