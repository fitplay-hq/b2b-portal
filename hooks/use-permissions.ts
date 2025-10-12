import { useSession } from 'next-auth/react';
import { 
  hasPermission, 
  canAccessPage, 
  canPerformAction, 
  getUserPermissions,
  getAccessibleNavItems,
  PERMISSIONS,
  RESOURCES,
  type UserSession
} from '@/lib/utils';

/**
 * Custom hook for permission management
 */
export function usePermissions() {
  const { data: session, status } = useSession();
  const permissions = getUserPermissions(session as UserSession);
  const isLoading = status === 'loading';
  const isAdmin = session?.user?.role === 'ADMIN';
  const isSystemUser = session?.user?.role === 'SYSTEM_USER';

  /**
   * Check if user has specific permission
   */
  const hasUserPermission = (resource: string, action: string): boolean => {
    // ADMIN has all permissions (except handled separately for users/roles)
    if (isAdmin) return true;
    return hasPermission(permissions, resource, action);
  };

  /**
   * Check if user can access a page
   */
  const canUserAccessPage = (resource: string): boolean => {
    if (isAdmin) return true;
    return canAccessPage(permissions, resource);
  };

  /**
   * Check if user can perform specific action
   */
  const canUserPerformAction = (resource: string, action: string): boolean => {
    if (isAdmin) return true;
    return canPerformAction(permissions, resource, action);
  };

  /**
   * Check if user can access admin-only features (users/roles)
   */
  const canAccessAdminOnly = (): boolean => {
    return isAdmin;
  };

  /**
   * Get accessible navigation items for current user
   */
  const getNavItems = () => {
    return getAccessibleNavItems(session as UserSession);
  };

  /**
   * Check access to specific pages
   */
  const pageAccess = {
    dashboard: true, // Always accessible
    products: canUserAccessPage(RESOURCES.PRODUCTS),
    orders: canUserAccessPage(RESOURCES.ORDERS),
    clients: canUserAccessPage(RESOURCES.CLIENTS),
    companies: canUserAccessPage(RESOURCES.COMPANIES),
    inventory: canUserAccessPage(RESOURCES.INVENTORY),
    users: isAdmin, // Admin only
    roles: isAdmin, // Admin only
  };

  /**
   * Check specific actions for resources
   */
  const actions = {
    products: {
      view: canUserPerformAction(RESOURCES.PRODUCTS, PERMISSIONS.VIEW),
      create: canUserPerformAction(RESOURCES.PRODUCTS, PERMISSIONS.CREATE),
      edit: canUserPerformAction(RESOURCES.PRODUCTS, PERMISSIONS.EDIT),
      delete: canUserPerformAction(RESOURCES.PRODUCTS, PERMISSIONS.DELETE),
    },
    orders: {
      view: canUserPerformAction(RESOURCES.ORDERS, PERMISSIONS.VIEW),
      create: canUserPerformAction(RESOURCES.ORDERS, PERMISSIONS.CREATE),
      edit: canUserPerformAction(RESOURCES.ORDERS, PERMISSIONS.EDIT),
      // Note: No delete for orders as per requirements
    },
    clients: {
      view: canUserPerformAction(RESOURCES.CLIENTS, PERMISSIONS.VIEW),
      create: canUserPerformAction(RESOURCES.CLIENTS, PERMISSIONS.CREATE),
      edit: canUserPerformAction(RESOURCES.CLIENTS, PERMISSIONS.EDIT),
      delete: canUserPerformAction(RESOURCES.CLIENTS, PERMISSIONS.DELETE),
    },
    companies: {
      view: canUserPerformAction(RESOURCES.COMPANIES, PERMISSIONS.VIEW),
      create: canUserPerformAction(RESOURCES.COMPANIES, PERMISSIONS.CREATE),
      edit: canUserPerformAction(RESOURCES.COMPANIES, PERMISSIONS.EDIT),
      delete: canUserPerformAction(RESOURCES.COMPANIES, PERMISSIONS.DELETE),
    },
    inventory: {
      view: canUserPerformAction(RESOURCES.INVENTORY, PERMISSIONS.VIEW),
      create: canUserPerformAction(RESOURCES.INVENTORY, PERMISSIONS.CREATE),
      edit: canUserPerformAction(RESOURCES.INVENTORY, PERMISSIONS.EDIT),
      // Note: No delete for inventory as per requirements
    },
  };

  return {
    // Session info
    session,
    isLoading,
    isAdmin,
    isSystemUser,
    permissions,
    
    // Permission checking functions
    hasPermission: hasUserPermission,
    canAccessPage: canUserAccessPage,
    canPerformAction: canUserPerformAction,
    canAccessAdminOnly,
    
    // Navigation
    getNavItems,
    
    // Convenient access checkers
    pageAccess,
    actions,
    
    // Constants for easy reference
    PERMISSIONS,
    RESOURCES,
  };
}

export default usePermissions;