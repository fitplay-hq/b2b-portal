"use client";

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { sessionPermissionPreloader } from '@/lib/session-permission-preloader';
import type { UserSession } from '@/lib/utils';

interface SessionProviderProps {
  children: React.ReactNode;
  session?: any;
}

function SessionWarmupComponent() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Immediately warmup permissions when session is authenticated
      sessionPermissionPreloader.warmupUserPermissions(session as UserSession);
    }
  }, [session, status]);

  return null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      <SessionWarmupComponent />
      {children}
    </NextAuthSessionProvider>
  );
}