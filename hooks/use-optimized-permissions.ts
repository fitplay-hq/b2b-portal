import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { 
  hasPermission, 
  canAccessPage, 
  canPerformAction, 
  getAccessibleNavItems,
  PERMISSIONS,
  RESOURCES,
  type UserSession,
  type Permission
} from '@/lib/utils';
import { permissionCache } from '@/lib/permission-cache';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';
import { sidebarPrefetcher } from '@/lib/sidebar-prefetcher';

/**
 * High-performance permissions hook with aggressive caching
 */
export function useOptimizedPermissions() {
  const { data: session, status } = useSession();
  const [cachedPermissions, setCachedPermissions] = useState<unknown>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SYSTEM_USER';
  const isSystemUser = session?.user?.role === 'SYSTEM_USER';
  const userId = session?.user?.id;
  const roleId = session?.user?.systemRoleId;

  // INSTANT loading - never show loading for more than 1 second
  const isLoading = useMemo(() => {
    // Never show loading for admins (check session directly too)
    if (session?.user?.role === 'ADMIN' || isAdmin || !isSystemUser) return false;
    
    // Only show loading briefly during initial authentication
    if (status === 'loading') return true;
    if (status === 'unauthenticated') return false;
    
    // Always show as loaded after hydration - permissions load in background
    return false;
  }, [status, isAdmin, isSystemUser, session]);

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // INSTANT permissions loading - no delays, load from session immediately
  useEffect(() => {
    if (!isHydrated || !userId || isAdmin) return;

    // INSTANT: Load permissions immediately from session (no async operations)
    const loadPermissionsInstantly = () => {
      try {
        // Get permissions directly from session - should be available immediately
        const permissions = session?.user?.permissions || [];
        
        const permissionData = {
          permissions,
          pageAccess: computePageAccess(permissions, isAdmin),
          actions: computeActions(permissions, isAdmin),
          navItems: getAccessibleNavItems(session as UserSession),
          timestamp: Date.now()
        };
        
        // Set immediately - no async caching delays
        setCachedPermissions(permissionData);
        
        // Background caching (non-blocking)
        setTimeout(() => {
          if (permissions.length > 0 && userId && roleId) {
            try {
              permanentPermissionStorage.storeUserPermissions(userId, roleId, permissions);
              sidebarPrefetcher.prefetchSidebarData(session);
              
              const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
              permissionCache.set(cacheKey, permissionData);
            } catch (error) {
              console.warn('Background caching failed:', error);
            }
          }
        }, 100); // Small delay for background caching
        
      } catch (error) {
        console.error('Permission loading error:', error);
        // Always provide fallback - never leave sidebar empty
        setCachedPermissions({
          permissions: [],
          pageAccess: { dashboard: true },
          actions: {},
          navItems: [],
          timestamp: Date.now()
        });
      }
    };

    // Execute immediately - no delays or async operations for sidebar
    loadPermissionsInstantly();
  }, [session, userId, roleId, isAdmin, isHydrated]);

  // Memoized permission functions for admin (instant access)
  const adminPermissions = useMemo(() => {
    // Check both current session role and potential admin role during loading
    const isAdminUser = session?.user?.role === 'ADMIN' || session?.user?.role === 'SYSTEM_USER' || isAdmin;
    
    if (!isAdminUser) return null;
    
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
        orders: { view: true, create: true, edit: true, export: true },
        clients: { view: true, create: true, edit: true, delete: true },
        companies: { view: true, create: true, edit: true, delete: true },
        inventory: { view: true, create: true, edit: true, export: true },
        users: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
      },
      navItems: getAccessibleNavItems(session as UserSession),
      timestamp: Date.now()
    };
  }, [isAdmin, session]);

  // Use cached or admin permissions (check session directly for immediate access)
  const currentPermissions = (session?.user?.role === 'ADMIN' || isAdmin) ? adminPermissions : cachedPermissions;

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
function computePageAccess(permissions: unknown[], isAdmin: boolean) {
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
    users: canAccessPage(permissions, RESOURCES.USERS),
    roles: canAccessPage(permissions, RESOURCES.ROLES),
  };
}

/**
 * Compute action permissions
 */
function computeActions(permissions: unknown[], isAdmin: boolean) {
  if (isAdmin) {
    return {
      products: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true, export: true },
      clients: { view: true, create: true, edit: true, delete: true },
      companies: { view: true, create: true, edit: true, delete: true },
      inventory: { view: true, create: true, edit: true, export: true },
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
      export: canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.EXPORT),
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
      export: canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.EXPORT),
    },
    users: {
      view: canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.EDIT),
      delete: canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.DELETE),
    },
    roles: {
      view: canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.VIEW),
      create: canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.CREATE),
      edit: canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.EDIT),
      delete: canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.DELETE),
    },
  };
}