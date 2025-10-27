import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { isAuthorizedAdmin } from '@/lib/utils';

// GET /api/admin/permissions - Get all permissions
export async function GET() {
  try {
    const session = await getServerSession(auth);
    
    if (!isAuthorizedAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await prisma.systemPermission.findMany({
      include: {
        _count: {
          select: {
            roles: true
          }
        }
      },
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' }
      ]
    });

    // Group permissions by resource for easier frontend handling
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const resource = permission.resource;
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
        roleCount: permission._count.roles,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({ 
      permissions,
      groupedPermissions 
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}