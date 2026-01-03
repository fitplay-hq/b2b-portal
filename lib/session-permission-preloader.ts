import { permissionCache, permissionPreloader } from '@/lib/permission-cache';
import { getUserPermissions, getAccessibleNavItems, type UserSession } from '@/lib/utils';

/**
 * Session Permission Preloader - Warmup permissions when user logs in
 */
export class SessionPermissionPreloader {
  private static instance: SessionPermissionPreloader;
  private isWarming = false;

  static getInstance(): SessionPermissionPreloader {
    if (!SessionPermissionPreloader.instance) {
      SessionPermissionPreloader.instance = new SessionPermissionPreloader();
    }
    return SessionPermissionPreloader.instance;
  }

  /**
   * Warmup permissions immediately when session starts
   */
  async warmupUserPermissions(session: UserSession): Promise<void> {
    if (this.isWarming) return;
    if (!session?.user?.id) return;
    if (session.user.role === 'ADMIN') return; // Admins don't need permission loading

    this.isWarming = true;

    try {
      const userId = session.user.id;
      const roleId = session.user.systemRoleId;
      const cacheKey = permissionCache.getUserCacheKey(userId, roleId);

      // Check if already cached
      if (permissionCache.get(cacheKey)) {
        this.isWarming = false;
        return;
      }

      // Load permissions in background
      const permissions = getUserPermissions(session);
      const permissionData = {
        permissions,
        pageAccess: this.computePageAccess(permissions),
        actions: this.computeActions(permissions),
        navItems: getAccessibleNavItems(session),
        timestamp: Date.now()
      };

      // Cache the warmed permissions
      permissionCache.set(cacheKey, permissionData);
      
      // Queue additional preloading for future sessions
      permissionPreloader.queuePreload(userId, roleId);


    } catch (error) {
      console.error('[SessionPreloader] Failed to warmup permissions:', error);
    } finally {
      this.isWarming = false;
    }
  }

  /**
   * Preload permissions for multiple users (admin feature)
   */
  async preloadMultipleUsers(userSessions: UserSession[]): Promise<void> {
    const preloadPromises = userSessions
      .filter(session => session.user.role !== 'ADMIN')
      .map(session => this.warmupUserPermissions(session));

    await Promise.allSettled(preloadPromises);
  }

  /**
   * Clear all user permissions from cache
   */
  clearUserPermissions(userId: string, roleId?: string): void {
    const cacheKey = permissionCache.getUserCacheKey(userId, roleId);
    permissionCache.invalidate(cacheKey);
  }

  /**
   * Check cache health for diagnostics
   */
  getCacheHealth() {
    return {
      isWarming: this.isWarming,
      cacheSize: permissionCache.size(),
      queueSize: permissionPreloader.getQueueSize(),
      timestamp: Date.now()
    };
  }

  private computePageAccess(permissions: any[]) {
    // Import resources dynamically to avoid circular dependencies
    const RESOURCES = {
      PRODUCTS: 'products',
      ORDERS: 'orders', 
      CLIENTS: 'clients',
      COMPANIES: 'companies',
      INVENTORY: 'inventory',
      USERS: 'users',
      ROLES: 'roles'
    };

    return {
      dashboard: true,
      products: this.canAccessPage(permissions, RESOURCES.PRODUCTS),
      orders: this.canAccessPage(permissions, RESOURCES.ORDERS),
      clients: this.canAccessPage(permissions, RESOURCES.CLIENTS),
      companies: this.canAccessPage(permissions, RESOURCES.COMPANIES),
      inventory: this.canAccessPage(permissions, RESOURCES.INVENTORY),
      users: this.canAccessPage(permissions, RESOURCES.USERS),
      roles: this.canAccessPage(permissions, RESOURCES.ROLES),
    };
  }

  private computeActions(permissions: any[]) {
    const RESOURCES = {
      PRODUCTS: 'products',
      ORDERS: 'orders', 
      CLIENTS: 'clients',
      COMPANIES: 'companies',
      INVENTORY: 'inventory',
      USERS: 'users',
      ROLES: 'roles'
    };

    const PERMISSIONS = {
      VIEW: 'view',
      CREATE: 'create',
      EDIT: 'edit',
      DELETE: 'delete'
    };

    return {
      products: {
        view: this.canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.EDIT),
        delete: this.canPerformAction(permissions, RESOURCES.PRODUCTS, PERMISSIONS.DELETE),
      },
      orders: {
        view: this.canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.ORDERS, PERMISSIONS.EDIT),
      },
      clients: {
        view: this.canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.EDIT),
        delete: this.canPerformAction(permissions, RESOURCES.CLIENTS, PERMISSIONS.DELETE),
      },
      companies: {
        view: this.canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.EDIT),
        delete: this.canPerformAction(permissions, RESOURCES.COMPANIES, PERMISSIONS.DELETE),
      },
      inventory: {
        view: this.canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.INVENTORY, PERMISSIONS.EDIT),
      },
      users: {
        view: this.canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.EDIT),
        delete: this.canPerformAction(permissions, RESOURCES.USERS, PERMISSIONS.DELETE),
      },
      roles: {
        view: this.canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.VIEW),
        create: this.canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.CREATE),
        edit: this.canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.EDIT),
        delete: this.canPerformAction(permissions, RESOURCES.ROLES, PERMISSIONS.DELETE),
      },
    };
  }

  private canAccessPage(permissions: any[], resource: string): boolean {
    return permissions.some(p => 
      p.resource.toLowerCase() === resource.toLowerCase() && 
      ['view', 'read', 'access'].includes(p.action.toLowerCase())
    );
  }

  private canPerformAction(permissions: any[], resource: string, action: string): boolean {
    return permissions.some(p => 
      p.resource.toLowerCase() === resource.toLowerCase() && 
      p.action.toLowerCase() === action.toLowerCase()
    );
  }
}

// Export singleton instance
export const sessionPermissionPreloader = SessionPermissionPreloader.getInstance();