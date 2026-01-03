"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { 
  hasPermission, 
  canAccessPage, 
  canPerformAction, 
  getAccessibleNavItems,
  PERMISSIONS,
  RESOURCES,
  type UserSession
} from '@/lib/utils';
import { redisPermissionCache } from '@/lib/redis-cache';

interface PermissionData {
  permissions: unknown[];
  pageAccess: Record<string, boolean>;
  actions: Record<string, Record<string, boolean>>;
  navItems: unknown[];
  timestamp: number;
}

/**
 * Ultra-fast permissions hook with Redis caching and instant sidebar loading
 */
export function useInstantPermissions() {
  const { data: session, status } = useSession();
  const [cachedPermissions, setCachedPermissions] = useState<PermissionData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';
  const isSystemUser = session?.user?.role === 'SYSTEM_USER';
  const userId = session?.user?.id;
  const roleId = session?.user?.systemRoleId;

  // INSTANT loading - no delays for sidebar
  const isLoading = useMemo(() => {
    // Never show loading for admins
    if (isAdmin) return false;
    
    // Show as loaded if we have any cached data or if user is not a system user
    if (cachedPermissions || !isSystemUser) return false;
    
    // Only show loading if we're still fetching and it's a system user
    return status === 'loading' || !isHydrated;
  }, [status, isAdmin, cachedPermissions, isSystemUser, isHydrated]);

  // Immediate hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // INSTANT sidebar loading with progressive enhancement
  useEffect(() => {
    if (!isHydrated || !userId || isAdmin || status !== 'authenticated') return;

    const loadPermissionsInstantly = async () => {
      try {
        // 1. INSTANT: Try to get sidebar data from cache (synchronous)
        const sidebarData = redisPermissionCache.getSidebarDataInstantly(userId);
        if (sidebarData) {
          console.log('[INSTANT] Using cached sidebar data');
          setCachedPermissions(sidebarData);
          return; // INSTANT LOAD - NO DELAYS!
        }

        // 2. FAST: Get from Redis/memory cache (async but very fast)
        const cachedPerms = await redisPermissionCache.getUserPermissions(userId, roleId || '');
        if (cachedPerms) {
          console.log('[FAST] Using cached permissions');
          const permissionData = computePermissionData(cachedPerms, isAdmin, session);
          setCachedPermissions(permissionData);
          
          // Cache for instant access next time
          await redisPermissionCache.cacheSidebarData(userId, permissionData);
          return;
        }

        // 3. FALLBACK: Use session permissions (should be immediate)
        const sessionPermissions = session?.user?.permissions || [];
        console.log('[FALLBACK] Using session permissions');
        
        const permissionData = computePermissionData(sessionPermissions, isAdmin, session);
        setCachedPermissions(permissionData);
        
        // Cache for future use
        if (sessionPermissions.length > 0) {
          await redisPermissionCache.cacheUserPermissions(userId, roleId || '', sessionPermissions);
          await redisPermissionCache.cacheSidebarData(userId, permissionData);
        }

      } catch (error) {
        console.warn('Permission loading error:', error);
        // Always provide basic fallback - never leave sidebar empty
        const fallbackData = {
          permissions: [],
          pageAccess: { dashboard: true },
          actions: {},
          navItems: [],
          timestamp: Date.now()
        };
        setCachedPermissions(fallbackData);
      }
    };

    // Execute immediately - no delays
    loadPermissionsInstantly();
  }, [session, userId, roleId, isAdmin, isHydrated, status]);

  // Admin permissions (always instant)
  const adminPermissions = useMemo(() => {
    if (!isAdmin) return null;
    
    return {
      permissions: [],
      pageAccess: {
        dashboard: true,
        products: true,
        orders: true,
        clients: true,
        companies: true,
        inventory: true,
        analytics: true,
        users: true,
        roles: true,
      },
      actions: {
        products: { view: true, create: true, edit: true, delete: true },
        orders: { view: true, create: true, edit: true },
        clients: { view: true, create: true, edit: true, delete: true },
        companies: { view: true, create: true, edit: true, delete: true },
        inventory: { view: true, create: true, edit: true },
        analytics: { read: true, export: true },
        users: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
      },
      navItems: getAccessibleNavItems(session as UserSession),
      timestamp: Date.now()
    };
  }, [isAdmin, session]);

  // Current permissions
  const currentPermissions = isAdmin ? adminPermissions : cachedPermissions;

  // Optimized permission functions
  const hasUserPermission = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (isAdmin) return true;
      if (!currentPermissions?.permissions) return false;
      return hasPermission(currentPermissions.permissions, resource, action);
    };
  }, [isAdmin, currentPermissions]);

  const canUserAccessPage = useMemo(() => {
    return (resource: string): boolean => {
      if (isAdmin) return true;
      if (!currentPermissions?.pageAccess) return false;
      return currentPermissions.pageAccess[resource.toLowerCase()] || false;
    };
  }, [isAdmin, currentPermissions]);

  const canUserPerformAction = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (isAdmin) return true;
      if (!currentPermissions?.actions) return false;
      const resourceActions = currentPermissions.actions[resource.toLowerCase()];
      return resourceActions?.[action.toLowerCase()] || false;
    };
  }, [isAdmin, currentPermissions]);

  return {
    // Permission data
    permissions: currentPermissions?.permissions || [],
    pageAccess: currentPermissions?.pageAccess || { dashboard: true },
    actions: currentPermissions?.actions || {},
    navItems: currentPermissions?.navItems || [],
    
    // Permission check functions
    hasUserPermission,
    canUserAccessPage,
    canUserPerformAction,
    canAccessAdminOnly: () => isAdmin,
    
    // State
    isLoading,
    isAdmin,
    isSystemUser,
    isHydrated,
    
    // Constants
    RESOURCES,
    PERMISSIONS,
    
    // Cache management
    invalidateCache: async () => {
      if (userId) {
        await redisPermissionCache.clearUserCache(userId);
        setCachedPermissions(null);
      }
    },

    // Cache stats
    getCacheStats: () => redisPermissionCache.getCacheStats()
  };
}

/**
 * Compute permission data structure
 */
function computePermissionData(permissions: any, isAdmin: boolean, session: any) {
  return {
    permissions,
    pageAccess: computePageAccess(permissions, isAdmin),
    actions: computeActions(permissions, isAdmin),
    navItems: getAccessibleNavItems(session as UserSession),
    timestamp: Date.now()
  };
}

/**
 * Compute page access permissions
 */
function computePageAccess(permissions: any[], isAdmin: boolean) {
  if (isAdmin) {
    return {
      dashboard: true,
      products: true,
      orders: true,
      clients: true,
      companies: true,
      inventory: true,
      users: true,
      roles: true,
    };
  }

  return {
    dashboard: true, // Always accessible
    products: canAccessPage(permissions, RESOURCES.PRODUCTS),
    orders: canAccessPage(permissions, RESOURCES.ORDERS),
    clients: canAccessPage(permissions, RESOURCES.CLIENTS),
    companies: canAccessPage(permissions, RESOURCES.COMPANIES),
    inventory: canAccessPage(permissions, RESOURCES.INVENTORY),
    analytics: canAccessPage(permissions, RESOURCES.ANALYTICS),
    users: false, // Admin only
    roles: false, // Admin only
  };
}

/**
 * Compute action permissions
 */
function computeActions(permissions: any[], isAdmin: boolean) {
  if (isAdmin) {
    return {
      products: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true },
      clients: { view: true, create: true, edit: true, delete: true },
      companies: { view: true, create: true, edit: true, delete: true },
      inventory: { view: true, create: true, edit: true },
      analytics: { read: true, export: true },
      users: { view: true, create: true, edit: true, delete: true },
      roles: { view: true, create: true, edit: true, delete: true },
    };
  }

  return {
    products: {
      view: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.EDIT),
      delete: canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.DELETE),
    },
    orders: {
      view: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.EDIT),
    },
    clients: {
      view: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.EDIT),
      delete: canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.DELETE),
    },
    companies: {
      view: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.EDIT),
      delete: canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.DELETE),
    },
    inventory: {
      view: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.EDIT),
    },
    analytics: {
      read: canPerformAction(permissions, RESOURCES.ANALYTICS, PERMISSIONS.READ),
      export: canPerformAction(permissions, RESOURCES.ANALYTICS, PERMISSIONS.EXPORT),
    },
  };
}