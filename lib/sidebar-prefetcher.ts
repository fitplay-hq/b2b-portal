/**
 * SIDEBAR-SPECIFIC PREFETCHING STRATEGY
 * Ensures sidebar renders instantly by prefetching navigation permissions
 */

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';
import { permissionCache } from '@/lib/permission-cache';
import { RESOURCES, PERMISSIONS } from '@/lib/utils';

interface SidebarPrefetchData {
  permissions: any[];
  pageAccess: Record<string, boolean>;
  actions: Record<string, Record<string, boolean>>;
  navItems: any[];
  timestamp: number;
}

export class SidebarPrefetcher {
  private static instance: SidebarPrefetcher;
  private prefetchedUsers = new Set<string>();

  static getInstance(): SidebarPrefetcher {
    if (!SidebarPrefetcher.instance) {
      SidebarPrefetcher.instance = new SidebarPrefetcher();
    }
    return SidebarPrefetcher.instance;
  }

  /**
   * CRITICAL: Prefetch sidebar data immediately on login
   * This ensures the NavItems component has instant access to permissions
   */
  async prefetchSidebarData(session: any): Promise<void> {
    if (!session?.user || this.prefetchedUsers.has(session.user.id)) return;

    const userId = session.user.id;
    const roleId = session.user.systemRoleId;

    try {
      // Mark as prefetched to avoid duplicates
      this.prefetchedUsers.add(userId);

      // 1. IMMEDIATE: Store permissions from session
      if (session.user.permissions && session.user.role === 'SYSTEM_USER') {
        const sidebarData: SidebarPrefetchData = {
          permissions: session.user.permissions,
          pageAccess: this.computePageAccess(session.user.permissions),
          actions: this.computeActions(session.user.permissions),
          navItems: this.computeNavItems(session.user.permissions, session.user.role),
          timestamp: Date.now()
        };

        // Store in all cache layers for instant sidebar access
        await this.storeInAllCaches(userId, roleId, sidebarData);
      }

      // 2. For admins, prefetch all navigation items
      if (session.user.role === 'ADMIN') {
        const adminSidebarData: SidebarPrefetchData = {
          permissions: [],
          pageAccess: this.getAdminPageAccess(),
          actions: this.getAdminActions(),
          navItems: this.getAdminNavItems(),
          timestamp: Date.now()
        };

        await this.storeInAllCaches(userId, roleId, adminSidebarData);
      }

      console.log('[SidebarPrefetch] Sidebar data prefetched for user:', userId);
    } catch (error) {
      console.error('[SidebarPrefetch] Failed to prefetch sidebar data:', error);
    }
  }

  /**
   * Store sidebar data in ALL cache layers for instant access
   */
  private async storeInAllCaches(userId: string, roleId: string, data: SidebarPrefetchData): Promise<void> {
    // 1. Permanent storage (survives browser restart)
    permanentPermissionStorage.storeUserPermissions(userId, roleId, data.permissions);

    // 2. Memory cache (fastest access)
    const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
    permissionCache.set(cacheKey, data);

    // 3. SessionStorage (fast access, session-persistent)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`sidebar_data_${userId}`, JSON.stringify(data));
      } catch (error) {
        // SessionStorage might be full, ignore
      }
    }

    // 4. Prefetch actual navigation API if needed
    await this.prefetchNavigationAPI(userId, roleId);
  }

  /**
   * Get sidebar data instantly (no loading time)
   */
  getSidebarDataInstantly(userId: string): SidebarPrefetchData | null {
    if (typeof window === 'undefined') return null;

    try {
      // 1. Try sessionStorage first (fastest for sidebar data)
      const sessionData = sessionStorage.getItem(`sidebar_data_${userId}`);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < 10 * 60 * 1000) {
          return parsed;
        }
      }

      // 2. Fallback to permanent storage
      const stored = permanentPermissionStorage.getStoredPermissions(userId);
      if (stored) {
        return {
          permissions: stored.permissions,
          pageAccess: stored.pageAccess,
          actions: stored.actions,
          navItems: [],
          timestamp: stored.timestamp
        };
      }
    } catch (error) {
      console.error('[SidebarPrefetch] Failed to get instant sidebar data:', error);
    }

    return null;
  }

  /**
   * Prefetch navigation API endpoints
   */
  private async prefetchNavigationAPI(userId: string, roleId: string): Promise<void> {
    try {
      const apiEndpoints = [
        `/api/admin/permissions`,
        `/api/admin/users/${userId}`,
        `/api/admin/roles/${roleId}`,
        `/api/admin/navigation`,
      ];

      // Prefetch in background (don't block sidebar rendering)
      Promise.allSettled(
        apiEndpoints.map(async (endpoint) => {
          try {
            await fetch(endpoint, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              // Use cache for faster subsequent requests
              cache: 'force-cache',
            });
          } catch (error) {
            // Ignore prefetch errors
          }
        })
      );
    } catch (error) {
      // Ignore API prefetch errors
    }
  }

  private computePageAccess(permissions: any[]) {
    return {
      dashboard: true,
      products: this.hasPermission(permissions, RESOURCES.PRODUCTS, PERMISSIONS.VIEW),
      orders: this.hasPermission(permissions, RESOURCES.ORDERS, PERMISSIONS.VIEW),
      clients: this.hasPermission(permissions, RESOURCES.CLIENTS, PERMISSIONS.VIEW),
      companies: this.hasPermission(permissions, RESOURCES.COMPANIES, PERMISSIONS.VIEW),
      inventory: this.hasPermission(permissions, RESOURCES.INVENTORY, PERMISSIONS.VIEW),
      users: false,
      roles: false,
    };
  }

  private computeActions(permissions: any[]) {
    return {
      products: {
        view: this.hasPermission(permissions, RESOURCES.PRODUCTS, PERMISSIONS.VIEW),
        create: this.hasPermission(permissions, RESOURCES.PRODUCTS, PERMISSIONS.CREATE),
        edit: this.hasPermission(permissions, RESOURCES.PRODUCTS, PERMISSIONS.EDIT),
        delete: this.hasPermission(permissions, RESOURCES.PRODUCTS, PERMISSIONS.DELETE),
      },
      orders: {
        view: this.hasPermission(permissions, RESOURCES.ORDERS, PERMISSIONS.VIEW),
        create: this.hasPermission(permissions, RESOURCES.ORDERS, PERMISSIONS.CREATE),
        edit: this.hasPermission(permissions, RESOURCES.ORDERS, PERMISSIONS.EDIT),
      },
      clients: {
        view: this.hasPermission(permissions, RESOURCES.CLIENTS, PERMISSIONS.VIEW),
        create: this.hasPermission(permissions, RESOURCES.CLIENTS, PERMISSIONS.CREATE),
        edit: this.hasPermission(permissions, RESOURCES.CLIENTS, PERMISSIONS.EDIT),
        delete: this.hasPermission(permissions, RESOURCES.CLIENTS, PERMISSIONS.DELETE),
      },
      companies: {
        view: this.hasPermission(permissions, RESOURCES.COMPANIES, PERMISSIONS.VIEW),
        create: this.hasPermission(permissions, RESOURCES.COMPANIES, PERMISSIONS.CREATE),
        edit: this.hasPermission(permissions, RESOURCES.COMPANIES, PERMISSIONS.EDIT),
        delete: this.hasPermission(permissions, RESOURCES.COMPANIES, PERMISSIONS.DELETE),
      },
      inventory: {
        view: this.hasPermission(permissions, RESOURCES.INVENTORY, PERMISSIONS.VIEW),
        create: this.hasPermission(permissions, RESOURCES.INVENTORY, PERMISSIONS.CREATE),
        edit: this.hasPermission(permissions, RESOURCES.INVENTORY, PERMISSIONS.EDIT),
      },
    };
  }

  private computeNavItems(permissions: any[], role: string) {
    // Return navigation items user can access
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', href: '/admin', permission: null },
      { id: 'products', label: 'Products', href: '/admin/products', permission: { resource: RESOURCES.PRODUCTS, action: PERMISSIONS.VIEW } },
      { id: 'orders', label: 'Orders', href: '/admin/orders', permission: { resource: RESOURCES.ORDERS, action: PERMISSIONS.VIEW } },
      { id: 'clients', label: 'Clients', href: '/admin/clients', permission: { resource: RESOURCES.CLIENTS, action: PERMISSIONS.VIEW } },
      { id: 'companies', label: 'Companies', href: '/admin/companies', permission: { resource: RESOURCES.COMPANIES, action: PERMISSIONS.VIEW } },
    ];

    return allItems.filter(item => {
      if (!item.permission) return true;
      if (role === 'ADMIN') return true;
      return this.hasPermission(permissions, item.permission.resource, item.permission.action);
    });
  }

  private getAdminPageAccess() {
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

  private getAdminActions() {
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

  private getAdminNavItems() {
    return [
      { id: 'dashboard', label: 'Dashboard', href: '/admin' },
      { id: 'products', label: 'Products', href: '/admin/products' },
      { id: 'orders', label: 'Orders', href: '/admin/orders' },
      { id: 'clients', label: 'Clients', href: '/admin/clients' },
      { id: 'companies', label: 'Companies', href: '/admin/companies' },
      { id: 'users', label: 'Users', href: '/admin/users' },
      { id: 'roles', label: 'Roles', href: '/admin/roles' },
    ];
  }

  private hasPermission(permissions: any[], resource: string, action: string): boolean {
    if (!permissions) return false;
    
    return permissions.some(permission => 
      permission.resource === resource && 
      (permission.action === action || 
       (permission.action === "read" && action === "view") ||
       (permission.action === "update" && action === "edit"))
    );
  }
}

/**
 * React Hook for Sidebar Prefetching
 */
export function useSidebarPrefetch() {
  const { data: session, status } = useSession();
  const prefetcher = SidebarPrefetcher.getInstance();
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !prefetchedRef.current) {
      // IMMEDIATELY prefetch sidebar data
      prefetcher.prefetchSidebarData(session);
      prefetchedRef.current = true;
    }
  }, [session, status, prefetcher]);

  return {
    getSidebarData: () => {
      if (session?.user?.id) {
        return prefetcher.getSidebarDataInstantly(session.user.id);
      }
      return null;
    },
    isPrefetched: prefetchedRef.current
  };
}

export const sidebarPrefetcher = SidebarPrefetcher.getInstance();