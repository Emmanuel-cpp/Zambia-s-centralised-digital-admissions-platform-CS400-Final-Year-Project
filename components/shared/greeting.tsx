'use client';

import { useAuth } from '@/hooks/use-auth';

export function Greeting() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const name = user?.first_name || 'there';

  return (
    <h1 className="font-display text-display-sm text-ink leading-tight">
      Welcome, {name}!
    </h1>
  );
}