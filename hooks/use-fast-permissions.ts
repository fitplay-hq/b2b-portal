import { useFastPermissions as useContextPermissions } from '@/contexts/fast-permission-context';

/**
 * Lightning-fast permission hook - no delays, no loading states
 * Always returns permissions instantly with intelligent defaults
 */
export function useFastPermissions() {
  return useContextPermissions();
}

/**
 * Backwards compatibility - replace existing usePermissions gradually
 */
export function useInstantPermissions() {
  const {
    isAdmin,
    isLoading,
    pageAccess,
    actions,
    userInfo,
    refresh
  } = useContextPermissions();

  return {
    // Session compatibility
    session: userInfo ? {
      user: userInfo
    } : null,
    
    // Status - never loading for instant UX
    isLoading: false,
    isAdmin,
    isSystemUser: userInfo?.role === 'SYSTEM_USER',
    
    // Permission functions - instant results
    hasPermission: (resource: string, action: string) => {
      if (isAdmin) return true;
      return actions[resource]?.[action] || false;
    },
    
    canAccessPage: (resource: string) => {
      if (isAdmin) return true;
      return pageAccess[resource] || false;
    },
    
    canPerformAction: (resource: string, action: string) => {
      if (isAdmin) return true;
      return actions[resource]?.[action] || false;
    },
    
    canAccessAdminOnly: () => isAdmin,
    
    // Direct access
    pageAccess,
    actions,
    
    // Navigation - never empty
    getNavItems: () => {
      const navItems = [
        {
          id: 'dashboard',
          path: '/admin',
          label: 'Dashboard',
          icon: 'BarChart3',
          show: true
        },
        {
          id: 'products',
          path: '/admin/products',
          label: 'Products',
          icon: 'Package',
          show: pageAccess.products
        },
        {
          id: 'orders',
          path: '/admin/orders',
          label: 'Orders',
          icon: 'ShoppingCart',
          show: pageAccess.orders
        },
        {
          id: 'clients',
          path: '/admin/clients',
          label: 'Clients',
          icon: 'Users',
          show: pageAccess.clients
        },
        {
          id: 'companies',
          path: '/admin/companies',
          label: 'Companies',
          icon: 'Building2',
          show: pageAccess.companies
        },
        {
          id: 'inventory',
          path: '/admin/inventory-logs',
          label: 'Inventory',
          icon: 'Package2',
          show: pageAccess.inventory
        },
        {
          id: 'users',
          path: '/admin/users',
          label: 'Users',
          icon: 'UserCog',
          show: isAdmin // Admin only
        },
        {
          id: 'roles',
          path: '/admin/roles',
          label: 'Roles',
          icon: 'Shield',
          show: isAdmin // Admin only
        }
      ];
      
      return navItems.filter(item => item.show);
    },
    
    // Utils
    refresh,
    
    // Constants for compatibility
    PERMISSIONS: {
      VIEW: 'view',
      CREATE: 'create',
      EDIT: 'edit',
      DELETE: 'delete',
      READ: 'read',
      UPDATE: 'update',
      EXPORT: 'export'
    },
    
    RESOURCES: {
      USERS: 'users',
      ROLES: 'roles',
      PRODUCTS: 'products',
      ORDERS: 'orders',
      CLIENTS: 'clients',
      COMPANIES: 'companies',
      INVENTORY: 'inventory',
      ANALYTICS: 'analytics'
    }
  };
}

export default useInstantPermissions;