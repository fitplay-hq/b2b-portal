import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a status string to be human-friendly by replacing underscores with spaces
 * and capitalizing the first character of each word
 */
export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Checks if a user has admin privileges (ADMIN or SYSTEM_USER)
 */
export function hasAdminAccess(userRole?: string): boolean {
  return userRole === "ADMIN" || userRole === "SYSTEM_USER";
}

/**
 * Checks if a user session has admin privileges
 */
export function isAuthorizedAdmin(session: { user?: { role?: string } } | null): boolean {
  return session?.user && hasAdminAccess(session.user.role) || false;
}

/**
 * Checks if a user has ADMIN role only (not SYSTEM_USER)
 */
export function isAdminOnly(userRole?: string): boolean {
  return userRole === "ADMIN";
}

/**
 * Checks if a user session has ADMIN role only
 */
export function isAuthorizedAdminOnly(session: { user?: { role?: string } } | null): boolean {
  return session?.user && isAdminOnly(session.user.role) || false;
}

// ===== PERMISSION SYSTEM =====

/**
 * Standard permission actions
 */
export const PERMISSIONS = {
  VIEW: 'view',
  CREATE: 'create', 
  EDIT: 'edit',
  DELETE: 'delete',
  READ: 'read',    // Legacy support
  UPDATE: 'update', // Legacy support
  EXPORT: 'export'
} as const;

/**
 * System resources
 */
export const RESOURCES = {
  USERS: 'users',
  ROLES: 'roles',
  PRODUCTS: 'products', 
  ORDERS: 'orders',
  CLIENTS: 'clients',
  COMPANIES: 'companies',
  INVENTORY: 'inventory',
  ANALYTICS: 'analytics'
} as const;

/**
 * Permission interface
 */
export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string | null;
}

/**
 * User session with permissions
 */
export interface UserSession {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    systemRole?: string;
    permissions?: Permission[];
  };
}

/**
 * Checks if a user has permission for a specific resource and action
 */
export function hasPermission(
  userPermissions: Permission[] | undefined,
  resource: string,
  action: string
): boolean {
  if (!userPermissions) return false;
  
  return userPermissions.some(permission => 
    permission.resource === resource && 
    (permission.action === action || 
     (permission.action === "read" && action === "view") ||
     (permission.action === "update" && action === "edit"))
  );
}

/**
 * Checks if user can access a specific page (requires view permission)
 */
export function canAccessPage(userPermissions: Permission[] | undefined, resource: string): boolean {
  // ADMIN can access everything except users/roles (handled separately)
  return hasPermission(userPermissions, resource, PERMISSIONS.VIEW);
}

/**
 * Checks if user can perform an action on a resource
 */
export function canPerformAction(
  userPermissions: Permission[] | undefined, 
  resource: string, 
  action: string
): boolean {
  return hasPermission(userPermissions, resource, action);
}

/**
 * Gets all permissions for a specific resource
 */
export function getResourcePermissions(
  userPermissions: Permission[] | undefined, 
  resource: string
): string[] {
  if (!userPermissions) return [];
  
  return userPermissions
    .filter(permission => permission.resource === resource)
    .map(permission => permission.action);
}

/**
 * Checks if user has any permissions for a resource
 */
export function hasAnyPermissionForResource(
  userPermissions: Permission[] | undefined,
  resource: string
): boolean {
  if (!userPermissions) return false;
  return userPermissions.some(permission => permission.resource === resource);
}

/**
 * Gets user permissions from session
 */
export function getUserPermissions(session: UserSession | null): Permission[] {
  return session?.user?.permissions || [];
}

/**
 * Navigation items with required permissions
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    path: '/admin',
    label: 'Dashboard',
    icon: 'BarChart3',
    permission: null // Always accessible
  },
  {
    id: 'products',
    path: '/admin/products',
    label: 'Products',
    icon: 'Package',
    permission: { resource: RESOURCES.PRODUCTS, action: PERMISSIONS.VIEW }
  },
  {
    id: 'orders',
    path: '/admin/orders',
    label: 'Orders',
    icon: 'ShoppingCart',
    permission: { resource: RESOURCES.ORDERS, action: PERMISSIONS.VIEW }
  },
  {
    id: 'clients',
    path: '/admin/clients',
    label: 'Clients',
    icon: 'Users',
    permission: { resource: RESOURCES.CLIENTS, action: PERMISSIONS.VIEW }
  },
  {
    id: 'companies',
    path: '/admin/companies',
    label: 'Companies', 
    icon: 'Building2',
    permission: { resource: RESOURCES.COMPANIES, action: PERMISSIONS.VIEW }
  },
  {
    id: 'inventory',
    path: '/admin/inventory',
    label: 'Inventory',
    icon: 'Package2',
    permission: { resource: RESOURCES.INVENTORY, action: PERMISSIONS.VIEW }
  },
  {
    id: 'users',
    path: '/admin/users',
    label: 'Users',
    icon: 'UserCog',
    adminOnly: true // Special case - ADMIN only
  },
  {
    id: 'roles',
    path: '/admin/roles', 
    label: 'Roles',
    icon: 'Shield',
    adminOnly: true // Special case - ADMIN only
  }
];

/**
 * Filters navigation items based on user permissions
 */
export function getAccessibleNavItems(session: UserSession | null): typeof NAVIGATION_ITEMS {
  if (!session?.user) return [];

  const { role } = session.user;

  // ADMIN should see all navigation items (admin-only items included)
  if (role === 'ADMIN') return NAVIGATION_ITEMS;

  const permissions = getUserPermissions(session);

  return NAVIGATION_ITEMS.filter(item => {
    // Always show dashboard
    if (!item.permission && !item.adminOnly) return true;

    // Admin-only items (users, roles) are not visible to non-admins
    if (item.adminOnly) return false;

    // Permission-based items
    if (item.permission) {
      return hasPermission(permissions, item.permission.resource, item.permission.action);
    }

    return false;
  });
}
