import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { hasPermission, type Permission } from '@/lib/utils';

/**
 * Permission-based API middleware
 */
export async function withPermissions(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  requiredResource: string,
  requiredAction: string
): Promise<NextResponse> {
  try {
    // Get the current session
    const session = await getServerSession(auth);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { user } = session;

    // ADMIN has access to everything
    if (user.role === 'ADMIN') {
      return handler(request);
    }

    // For SYSTEM_USER, check permissions
    if (user.role === 'SYSTEM_USER') {
      // Load user permissions if not already in session
      let userPermissions: Permission[] = user.permissions || [];

      if (!userPermissions.length && user.systemRoleId) {
        try {
          const systemRole = await prisma.systemRole.findUnique({
            where: { id: user.systemRoleId },
            include: {
              permissions: {
                select: {
                  id: true,
                  resource: true,
                  action: true,
                  description: true,
                }
              }
            }
          });

          userPermissions = systemRole?.permissions || [];
        } catch (error) {
          console.error('Error loading user permissions:', error);
          return NextResponse.json(
            { error: 'Failed to verify permissions' },
            { status: 500 }
          );
        }
      }

      // Check if user has the required permission
      const hasRequiredPermission = hasPermission(
        userPermissions,
        requiredResource,
        requiredAction
      );

      if (!hasRequiredPermission) {
        return NextResponse.json(
          { 
            error: 'Insufficient permissions',
            required: `${requiredResource}.${requiredAction}`,
            message: `You need ${requiredAction} permission for ${requiredResource}`
          },
          { status: 403 }
        );
      }

      return handler(request);
    }

    // Unknown role
    return NextResponse.json(
      { error: 'Invalid user role' },
      { status: 403 }
    );

  } catch (error) {
    console.error('Permission middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper to create permission-protected API handlers
 */
export function createPermissionHandler(
  resource: string,
  actions: {
    GET?: string;
    POST?: string;
    PUT?: string;
    PATCH?: string;
    DELETE?: string;
  }
) {
  return {
    async GET(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
      if (!actions.GET) {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
      return withPermissions(request, handler, resource, actions.GET);
    },

    async POST(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
      if (!actions.POST) {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
      return withPermissions(request, handler, resource, actions.POST);
    },

    async PUT(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
      if (!actions.PUT) {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
      return withPermissions(request, handler, resource, actions.PUT);
    },

    async PATCH(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
      if (!actions.PATCH) {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
      return withPermissions(request, handler, resource, actions.PATCH);
    },

    async DELETE(request: NextRequest, handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
      if (!actions.DELETE) {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
      return withPermissions(request, handler, resource, actions.DELETE);
    },
  };
}

/**
 * Quick permission check for existing API routes
 */
export async function checkPermission(
  resource: string,
  action: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const session = await getServerSession(auth);

    if (!session?.user) {
      return { success: false, error: 'Authentication required' };
    }

    const { user } = session;

    // ADMIN has access to everything
    if (user.role === 'ADMIN') {
      return { success: true, user };
    }

    // For SYSTEM_USER, check permissions
    if (user.role === 'SYSTEM_USER') {
      let userPermissions: Permission[] = user.permissions || [];

      if (!userPermissions.length && user.systemRoleId) {
        try {
          const systemRole = await prisma.systemRole.findUnique({
            where: { id: user.systemRoleId },
            include: {
              permissions: {
                select: {
                  id: true,
                  resource: true,
                  action: true,
                  description: true,
                }
              }
            }
          });

          userPermissions = systemRole?.permissions || [];
        } catch (error) {
          return { success: false, error: 'Failed to verify permissions' };
        }
      }

      const hasRequiredPermission = hasPermission(
        userPermissions,
        resource,
        action
      );

      if (!hasRequiredPermission) {
        return { 
          success: false, 
          error: `Insufficient permissions: need ${action} permission for ${resource}`
        };
      }

      return { success: true, user };
    }

    return { success: false, error: 'Invalid user role' };
  } catch (error) {
    console.error('Permission check error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export default withPermissions;