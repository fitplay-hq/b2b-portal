import { signOut } from 'next-auth/react';
import { permanentPermissionStorage } from '@/lib/permanent-permission-storage';
import { permissionCache } from '@/lib/permission-cache';

/**
 * Enhanced logout that clears all stored permissions
 */
export async function enhancedSignOut() {
  try {
    // Clear all stored permissions
    permanentPermissionStorage.clearStoredPermissions();
    
    // Clear memory cache
    permissionCache.clearAll();
    
    // Clear any other cached data
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      // Keep essential localStorage items, clear permission-related ones
      const keysToKeep = ['theme', 'language', 'sidebar-state'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // Sign out with NextAuth
    await signOut({ callbackUrl: '/login' });
  } catch (error) {
    console.error('Error during enhanced sign out:', error);
    // Fallback to regular sign out
    await signOut({ callbackUrl: '/login' });
  }
}

/**
 * Quick permission check without loading
 */
export function hasQuickPermission(resource: string, action: string): boolean {
  try {
    const stored = permanentPermissionStorage.getStoredPermissions();
    if (!stored) return false;
    
    return stored.permissions.some(p => 
      p.resource.toLowerCase() === resource.toLowerCase() && 
      p.action.toLowerCase() === action.toLowerCase()
    );
  } catch {
    return false;
  }
}

/**
 * Quick page access check without loading
 */
export function hasQuickPageAccess(page: string): boolean {
  try {
    const stored = permanentPermissionStorage.getStoredPermissions();
    if (!stored) return false;
    
    return stored.pageAccess[page.toLowerCase()] || false;
  } catch {
    return false;
  }
}