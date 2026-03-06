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

    // Debug logging
    console.log('Total permissions found:', permissions.length);
    const analyticsPermissions = permissions.filter(p => p.resource === 'analytics');
    console.log('Analytics permissions found:', analyticsPermissions.length);
    console.log('Analytics permissions:', analyticsPermissions.map(p => `${p.resource}.${p.action}`));

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

    const response = NextResponse.json({ 
      permissions,
      groupedPermissions 
    });
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}