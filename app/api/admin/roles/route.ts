import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkPermission } from '@/lib/auth-middleware';
import { RESOURCES } from '@/lib/utils';

// GET /api/admin/roles - Get all roles
export async function GET() {
  try {
    // Check permissions - only ADMIN should access roles
    const permissionCheck = await checkPermission(RESOURCES.ROLES, 'view');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error || "Unauthorized - Admin access required" },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const roles = await prisma.systemRole.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match frontend expectations
    const transformedRoles = roles.map(role => ({
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
    }));

    return NextResponse.json(transformedRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/roles - Create a new role
export async function POST(request: NextRequest) {
  try {
    // Check permissions - only ADMIN should create roles
    const permissionCheck = await checkPermission(RESOURCES.ROLES, 'create');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error || "Unauthorized - Admin access required" },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const { name, description, permissionIds } = await request.json();

    if (!name || !Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'Name and permissionIds are required' },
        { status: 400 }
      );
    }

    // Check if role name already exists
    const existingRole = await prisma.systemRole.findUnique({
      where: { name }
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 409 }
      );
    }

    // Verify all permission IDs exist
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

    // Create the role with permissions
    const role = await prisma.systemRole.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissionIds.map((id: string) => ({ id }))
        }
      },
      include: {
        permissions: true,
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
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    return NextResponse.json({ 
      role: transformedRole,
      message: 'Role created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}