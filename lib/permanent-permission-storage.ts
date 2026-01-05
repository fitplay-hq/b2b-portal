/**
 * URGENT PRODUCTION FIX - Store permissions permanently on login
 * No more 25-second loading times!
 */

interface StoredPermissions {
  permissions: any[];
  pageAccess: Record<string, boolean>;
  actions: Record<string, Record<string, boolean>>;
  timestamp: number;
  userId: string;
  roleId: string;
  expiresAt: number;
}

const PERMISSION_STORAGE_KEY = 'user_permissions_v2';
const PERMISSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export class PermanentPermissionStorage {
  private static instance: PermanentPermissionStorage;

  static getInstance(): PermanentPermissionStorage {
    if (!PermanentPermissionStorage.instance) {
      PermanentPermissionStorage.instance = new PermanentPermissionStorage();
    }
    return PermanentPermissionStorage.instance;
  }

  /**
   * Store permissions permanently when user logs in
   */
  storeUserPermissions(userId: string, roleId: string, permissions: any[]): void {
    if (typeof window === 'undefined') return;

    const permissionData: StoredPermissions = {
      permissions,
      pageAccess: this.computePageAccess(permissions),
      actions: this.computeActions(permissions),
      timestamp: Date.now(),
      userId,
      roleId,
      expiresAt: Date.now() + PERMISSION_EXPIRY
    };

    try {
      // Store in localStorage (survives browser restart)
      localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(permissionData));
      
      // Store in sessionStorage (faster access)
      sessionStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(permissionData));
      
      // Store in IndexedDB for larger storage (optional fallback)
      this.storeInIndexedDB(permissionData);
      
      // Permissions stored successfully
    } catch (error) {
      // Failed to store permissions
    }
  }

  /**
   * Get stored permissions instantly (no API calls)
   */
  getStoredPermissions(userId?: string): StoredPermissions | null {
    if (typeof window === 'undefined') return null;

    try {
      // 1. Try sessionStorage first (fastest)
      let stored = sessionStorage.getItem(PERMISSION_STORAGE_KEY);
      if (!stored) {
        // 2. Fallback to localStorage
        stored = localStorage.getItem(PERMISSION_STORAGE_KEY);
      }

      if (stored) {
        const parsed: StoredPermissions = JSON.parse(stored);
        
        // Check if expired
        if (parsed.expiresAt < Date.now()) {
          this.clearStoredPermissions();
          return null;
        }

        // Check if same user (if userId provided)
        if (userId && parsed.userId !== userId) {
          this.clearStoredPermissions();
          return null;
        }

        // Update sessionStorage if we got it from localStorage
        if (!sessionStorage.getItem(PERMISSION_STORAGE_KEY)) {
          sessionStorage.setItem(PERMISSION_STORAGE_KEY, stored);
        }

        return parsed;
      }
    } catch (error) {
      console.error('[PermanentStorage] Failed to get permissions:', error);
      this.clearStoredPermissions();
    }

    return null;
  }

  /**
   * Clear all stored permissions (on logout)
   */
  clearStoredPermissions(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(PERMISSION_STORAGE_KEY);
      sessionStorage.removeItem(PERMISSION_STORAGE_KEY);
      this.clearIndexedDB();
    } catch (error) {
      // Failed to clear permissions
    }
  }

  /**
   * Check if permissions are already stored for user
   */
  hasValidPermissions(userId: string): boolean {
    const stored = this.getStoredPermissions(userId);
    return stored !== null && stored.permissions.length > 0;
  }

  private computePageAccess(permissions: any[]) {
    return {
      dashboard: true,
      products: this.canAccessPage(permissions, 'products'),
      orders: this.canAccessPage(permissions, 'orders'),
      clients: this.canAccessPage(permissions, 'clients'),
      companies: this.canAccessPage(permissions, 'companies'),
      inventory: this.canAccessPage(permissions, 'inventory'),
      users: false,
      roles: false,
    };
  }

  private computeActions(permissions: any[]) {
    return {
      products: {
        view: this.canPerformAction(permissions, 'products', 'view'),
        create: this.canPerformAction(permissions, 'products', 'create'),
        edit: this.canPerformAction(permissions, 'products', 'edit'),
        delete: this.canPerformAction(permissions, 'products', 'delete'),
      },
      orders: {
        view: this.canPerformAction(permissions, 'orders', 'view'),
        create: this.canPerformAction(permissions, 'orders', 'create'),
        edit: this.canPerformAction(permissions, 'orders', 'edit'),
      },
      clients: {
        view: this.canPerformAction(permissions, 'clients', 'view'),
        create: this.canPerformAction(permissions, 'clients', 'create'),
        edit: this.canPerformAction(permissions, 'clients', 'edit'),
        delete: this.canPerformAction(permissions, 'clients', 'delete'),
      },
      companies: {
        view: this.canPerformAction(permissions, 'companies', 'view'),
        create: this.canPerformAction(permissions, 'companies', 'create'),
        edit: this.canPerformAction(permissions, 'companies', 'edit'),
        delete: this.canPerformAction(permissions, 'companies', 'delete'),
      },
      inventory: {
        view: this.canPerformAction(permissions, 'inventory', 'view'),
        create: this.canPerformAction(permissions, 'inventory', 'create'),
        edit: this.canPerformAction(permissions, 'inventory', 'edit'),
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

  private storeInIndexedDB(data: StoredPermissions): void {
    // Optional: Store in IndexedDB for even more persistent storage
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('PermissionDB', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as any).result;
          if (!db.objectStoreNames.contains('permissions')) {
            db.createObjectStore('permissions');
          }
        };
        
        request.onsuccess = (event) => {
          const db = (event.target as any).result;
          const transaction = db.transaction(['permissions'], 'readwrite');
          const store = transaction.objectStore('permissions');
          store.put(data, 'user_permissions');
        };
      }
    } catch (error) {
      // IndexedDB is optional, don't fail if it doesn't work
    }
  }

  private clearIndexedDB(): void {
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('PermissionDB', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as any).result;
          if (!db.objectStoreNames.contains('permissions')) {
            db.createObjectStore('permissions');
          }
        };
        
        request.onsuccess = (event) => {
          const db = (event.target as any).result;
          const transaction = db.transaction(['permissions'], 'readwrite');
          const store = transaction.objectStore('permissions');
          store.delete('user_permissions');
        };
      }
    } catch (error) {
      // IndexedDB is optional, don't fail if it doesn't work
    }
  }
}

export const permanentPermissionStorage = PermanentPermissionStorage.getInstance();