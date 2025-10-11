import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { hash } from 'bcryptjs';

// GET /api/admin/system-users/[id] - Get a specific system user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.systemUser.findUnique({
      where: { id: params.id },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: {
              select: {
                id: true,
                resource: true,
                action: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the response (exclude password)
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error('Error fetching system user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/system-users/[id] - Update a system user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, roleId, isActive } = await request.json();

    // Check if user exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if email is being changed and if it conflicts
    if (email && email !== existingUser.email) {
      const emailConflict = await prisma.systemUser.findUnique({
        where: { email }
      });

      if (emailConflict) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // Verify role exists if provided
    if (roleId) {
      const role = await prisma.systemRole.findUnique({
        where: { id: roleId }
      });

      if (!role) {
        return NextResponse.json(
          { error: 'Invalid role ID' },
          { status: 400 }
        );
      }
    }

    // Validate password if provided
    let hashedPassword;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      hashedPassword = await hash(password, 12);
    }

    // Update the user
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (hashedPassword) updateData.password = hashedPassword;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await prisma.systemUser.update({
      where: { id: params.id },
      data: updateData,
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: {
              select: {
                id: true,
                resource: true,
                action: true,
                description: true
              }
            }
          }
        }
      }
    });

    // Transform the response (exclude password)
    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({ 
      user: transformedUser,
      message: 'User updated successfully' 
    });
  } catch (error) {
    console.error('Error updating system user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/system-users/[id] - Delete a system user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the user
    await prisma.systemUser.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting system user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}