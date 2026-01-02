'use client';

import { useEffect, useRef } from 'react';
import { useSession } from '@/lib/auth-client';
import { usePresenceStore } from '@/lib/store/presenceStore';

interface PresenceProviderProps {
  children: React.ReactNode;
}

export function PresenceProvider({ children }: PresenceProviderProps) {
  const { data: session, isPending } = useSession();
  const status = isPending
    ? 'loading'
    : session
      ? 'authenticated'
      : 'unauthenticated';
  const { initializePresence, cleanup } = usePresenceStore();
  const inititalizedRef = useRef(false);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.id &&
      !inititalizedRef.current
    ) {
      inititalizedRef.current = true;
      initializePresence(session);
    } else if (status === 'unauthenticated') {
      inititalizedRef.current = false;
      cleanup();
    }
  }, [session, status, initializePresence, cleanup, session?.user?.id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [cleanup]);

  return <>{children}</>;
}
