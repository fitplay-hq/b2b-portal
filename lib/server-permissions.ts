import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { permissionCache } from "@/lib/permission-cache";

/**
 * Server-side permission utilities for immediate access
 */

/**
 * Get user permissions with aggressive caching for production
 */
export async function getServerUserPermissions(userId?: string, roleId?: string) {
  try {
    // Try to get from cache first
    if (userId && roleId) {
      const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
      const cached = permissionCache.get(cacheKey);
      if (cached) {
        return cached.permissions;
      }
    }

    // Get from current session
    const session = await getServerSession(auth);
    if (session?.user?.permissions) {
      // Cache the permissions from session
      if (userId && roleId) {
        const permissionData = {
          permissions: session.user.permissions,
          pageAccess: computePageAccess(session.user.permissions),
          actions: computeActions(session.user.permissions),
          navItems: [],
          timestamp: Date.now()
        };
        const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
        permissionCache.set(cacheKey, permissionData);
      }
      return session.user.permissions;
    }

    return [];
  } catch (error) {
    console.error('Error getting server permissions:', error);
    return [];
  }
}

/**
 * Preload permissions into cache from server session
 */
export async function preloadServerPermissions() {
  try {
    const session = await getServerSession(auth);
    if (session?.user && session.user.role === 'SYSTEM_USER') {
      const cacheKey = permissionCache.getUserCacheKey(session.user.id, session.user.systemRoleId);
      
      // Check if already cached
      if (permissionCache.get(cacheKey)) {
        return;
      }

      // Cache from session
      const permissionData = {
        permissions: session.user.permissions || [],
        pageAccess: computePageAccess(session.user.permissions || []),
        actions: computeActions(session.user.permissions || []),
        navItems: [],
        timestamp: Date.now()
      };
      
      permissionCache.set(cacheKey, permissionData);
      console.log('[ServerPreload] Permissions cached from session for user:', session.user.id);
    }
  } catch (error) {
    console.error('Error preloading server permissions:', error);
  }
}

function computePageAccess(permissions: any[]) {
  return {
    dashboard: true,
    products: canAccessPage(permissions, 'products'),
    orders: canAccessPage(permissions, 'orders'),
    clients: canAccessPage(permissions, 'clients'),
    companies: canAccessPage(permissions, 'companies'),
    inventory: canAccessPage(permissions, 'inventory'),
    users: false,
    roles: false,
  };
}

function computeActions(permissions: any[]) {
  return {
    products: {
      view: canPerformAction(permissions, 'products', 'view'),
      create: canPerformAction(permissions, 'products', 'create'),
      edit: canPerformAction(permissions, 'products', 'edit'),
      delete: canPerformAction(permissions, 'products', 'delete'),
    },
    orders: {
      view: canPerformAction(permissions, 'orders', 'view'),
      create: canPerformAction(permissions, 'orders', 'create'),
      edit: canPerformAction(permissions, 'orders', 'edit'),
    },
    clients: {
      view: canPerformAction(permissions, 'clients', 'view'),
      create: canPerformAction(permissions, 'clients', 'create'),
      edit: canPerformAction(permissions, 'clients', 'edit'),
      delete: canPerformAction(permissions, 'clients', 'delete'),
    },
    companies: {
      view: canPerformAction(permissions, 'companies', 'view'),
      create: canPerformAction(permissions, 'companies', 'create'),
      edit: canPerformAction(permissions, 'companies', 'edit'),
      delete: canPerformAction(permissions, 'companies', 'delete'),
    },
    inventory: {
      view: canPerformAction(permissions, 'inventory', 'view'),
      create: canPerformAction(permissions, 'inventory', 'create'),
      edit: canPerformAction(permissions, 'inventory', 'edit'),
    },
  };
}

function canAccessPage(permissions: any[], resource: string): boolean {
  return permissions.some(p => 
    p.resource.toLowerCase() === resource.toLowerCase() && 
    ['view', 'read', 'access'].includes(p.action.toLowerCase())
  );
}

function canPerformAction(permissions: any[], resource: string, action: string): boolean {
  return permissions.some(p => 
    p.resource.toLowerCase() === resource.toLowerCase() && 
    p.action.toLowerCase() === action.toLowerCase()
  );
}