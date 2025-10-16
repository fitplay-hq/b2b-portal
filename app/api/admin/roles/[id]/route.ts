import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withPermissions } from '@/lib/auth-middleware';

// GET /api/admin/roles/[id] - Get a specific role
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const handler = async (req: NextRequest) => {
    try {

    const role = await prisma.systemRole.findUnique({
      where: { id: params.id },
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Transform the response
    const transformedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      userCount: role._count.users,
      permissions: role.permissions.map(permission => ({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        description: permission.description
      })),
      users: role.users,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    return NextResponse.json({ role: transformedRole });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/roles/[id] - Update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, permissionIds, isActive } = await request.json();

    // Check if role exists
    const existingRole = await prisma.systemRole.findUnique({
      where: { id: params.id }
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingRole.name) {
      const nameConflict = await prisma.systemRole.findUnique({
        where: { name }
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Role name already exists' },
          { status: 409 }
        );
      }
    }

    // Verify all permission IDs exist if provided
    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = await prisma.systemPermission.findMany({
        where: {
          id: { in: permissionIds }
        }
      });

      if (permissions.length !== permissionIds.length) {
        return NextResponse.json(
          { error: 'Some permission IDs are invalid' },
          { status: 400 }
        );
      }
    }

    // Update the role
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle permissions update
    if (permissionIds && Array.isArray(permissionIds)) {
      updateData.permissions = {
        set: permissionIds.map((id: string) => ({ id }))
      };
    }

    const role = await prisma.systemRole.update({
      where: { id: params.id },
      data: updateData,
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    // Transform the response
    const transformedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      userCount: role._count.users,
      permissions: role.permissions.map(permission => ({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        description: permission.description
      })),
      users: role.users,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    return NextResponse.json({ 
      role: transformedRole,
      message: 'Role updated successfully' 
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/roles/[id] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(auth);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if role exists
    const existingRole = await prisma.systemRole.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Prevent deletion if role has users assigned
    if (existingRole._count.users > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete role with assigned users',
          details: `This role has ${existingRole._count.users} user(s) assigned. Please reassign or remove users before deleting the role.`
        },
        { status: 409 }
      );
    }

    // Delete the role
    await prisma.systemRole.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: 'Role deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}