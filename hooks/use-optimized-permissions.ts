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
import { permissionCache, permissionPreloader } from '@/lib/permission-cache';

/**
 * High-performance permissions hook with aggressive caching
 */
export function useOptimizedPermissions() {
  const { data: session, status } = useSession();
  const [cachedPermissions, setCachedPermissions] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';
  const isSystemUser = session?.user?.role === 'SYSTEM_USER';
  const userId = session?.user?.id;
  const roleId = session?.user?.systemRoleId;

  // Ultra-fast loading state for better UX
  const isLoading = useMemo(() => {
    if (status === 'loading') return true;
    if (status === 'unauthenticated') return false;
    if (isAdmin) return false; // Admins don't need permission loading
    if (!isHydrated) return true;
    return !cachedPermissions && isSystemUser;
  }, [status, isAdmin, isHydrated, cachedPermissions, isSystemUser]);

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load and cache permissions - OPTIMIZED to use session permissions directly
  useEffect(() => {
    if (!isHydrated || !userId || isAdmin) return;

    const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
    
    // Try to get from cache first
    const cached = permissionCache.get(cacheKey);
    if (cached) {
      setCachedPermissions(cached);
      return;
    }

    // Use permissions directly from session (already cached in JWT)
    const loadPermissions = () => {
      try {
        // Get permissions directly from session - NO database calls!
        const permissions = session?.user?.permissions || [];
        
        const permissionData = {
          permissions,
          pageAccess: computePageAccess(permissions, isAdmin),
          actions: computeActions(permissions, isAdmin),
          navItems: getAccessibleNavItems(session as UserSession),
          timestamp: Date.now()
        };
        
        // Cache the computed permissions
        permissionCache.set(cacheKey, permissionData);
        setCachedPermissions(permissionData);
        
        // Queue background preload for future sessions
        permissionPreloader.queuePreload(userId, roleId);
      } catch (error) {
        console.error('Permission loading error:', error);
        // Fallback to basic permissions
        setCachedPermissions({
          permissions: [],
          pageAccess: { dashboard: true },
          actions: {},
          navItems: [],
          timestamp: Date.now()
        });
      }
    };

    // Load synchronously since permissions are in session
    loadPermissions();
  }, [session, userId, roleId, isAdmin, isHydrated]);

  // Memoized permission functions for admin (instant access)
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
        users: true,
        roles: true,
      },
      actions: {
        products: { view: true, create: true, edit: true, delete: true },
        orders: { view: true, create: true, edit: true },
        clients: { view: true, create: true, edit: true, delete: true },
        companies: { view: true, create: true, edit: true, delete: true },
        inventory: { view: true, create: true, edit: true },
        users: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
      },
      navItems: getAccessibleNavItems(session as UserSession),
      timestamp: Date.now()
    };
  }, [isAdmin, session]);

  // Use cached or admin permissions
  const currentPermissions = isAdmin ? adminPermissions : cachedPermissions;

  // Optimized permission check functions
  const hasUserPermission = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (isAdmin) return true;
      if (!currentPermissions) return false;
      return hasPermission(currentPermissions.permissions, resource, action);
    };
  }, [isAdmin, currentPermissions]);

  const canUserAccessPage = useMemo(() => {
    return (resource: string): boolean => {
      if (isAdmin) return true;
      if (!currentPermissions) return false;
      return currentPermissions.pageAccess[resource.toLowerCase()] || false;
    };
  }, [isAdmin, currentPermissions]);

  const canUserPerformAction = useMemo(() => {
    return (resource: string, action: string): boolean => {
      if (isAdmin) return true;
      if (!currentPermissions) return false;
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
    invalidateCache: () => {
      if (userId) {
        const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
        permissionCache.invalidate(cacheKey);
        setCachedPermissions(null);
      }
    }
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
  };
}