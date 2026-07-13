'use client';

import { getAuthUser, type AuthUser } from '@/lib/auth';
import { useState, useEffect } from 'react';

/**
 * Returns the currently logged-in user from localStorage.
 * Returns null if not logged in.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
    setLoading(false);
  }, []);

  return { user, loading };
}