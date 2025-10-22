"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  priority?: 'high' | 'low';
  onMouseEnter?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

/**
 * Enhanced Link component with intelligent prefetching
 */
export function PrefetchLink({ 
  href, 
  children, 
  className, 
  prefetch = true,
  priority = 'low',
  onMouseEnter,
  onClick,
  ...props 
}: PrefetchLinkProps) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefetchedRef = useRef(false);

  // Prefetch on mount if high priority
  useEffect(() => {
    if (priority === 'high' && prefetch && !prefetchedRef.current) {
      router.prefetch(href);
      prefetchedRef.current = true;
    }
  }, [href, priority, prefetch, router]);

  // Prefetch on intersection (lazy loading)
  useEffect(() => {
    if (!prefetch || priority === 'high') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetchedRef.current) {
            router.prefetch(href);
            prefetchedRef.current = true;
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' } // Prefetch when link is 100px away from viewport
    );

    if (linkRef.current) {
      observer.observe(linkRef.current);
    }

    return () => observer.disconnect();
  }, [href, prefetch, priority, router]);

  const handleMouseEnter = () => {
    // Prefetch on hover if not already done
    if (prefetch && !prefetchedRef.current) {
      router.prefetch(href);
      prefetchedRef.current = true;
    }
    onMouseEnter?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    // Instant navigation for prefetched pages
    if (prefetchedRef.current) {
      // Page should load instantly
    }
    onClick?.(e);
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      prefetch={false} // We handle prefetching manually
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Navigation Link with permission-aware prefetching
 */
interface NavLinkProps extends PrefetchLinkProps {
  hasPermission?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  isCollapsed?: boolean;
  label: string;
}

export function NavLink({
  href,
  hasPermission = true,
  icon: Icon,
  isActive = false,
  isCollapsed = false,
  label,
  className,
  ...props
}: NavLinkProps) {
  if (!hasPermission) return null;

  return (
    <PrefetchLink
      href={href}
      className={cn(
        "flex items-center rounded-lg transition-all duration-200 text-sm font-medium group relative",
        isCollapsed ? "px-2 py-2.5 justify-center" : "gap-3 px-3 py-2.5",
        isActive
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        className
      )}
      title={isCollapsed ? label : undefined}
      priority={isActive ? 'high' : 'low'} // Prefetch active/likely pages first
      {...props}
    >
      {Icon && (
        <Icon className={cn(
          "h-4 w-4 transition-colors flex-shrink-0",
          isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
        )} />
      )}
      {!isCollapsed && (
        <>
          <span>{label}</span>
          {isActive && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current"></div>
          )}
        </>
      )}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </PrefetchLink>
  );
}