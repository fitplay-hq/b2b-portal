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
