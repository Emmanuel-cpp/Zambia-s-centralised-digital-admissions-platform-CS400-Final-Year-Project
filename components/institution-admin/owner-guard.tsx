'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

/**
 * Wraps owner-only pages. Non-owners are redirected to the admin
 * dashboard before any owner UI (or its API calls) render.
 * The API middleware remains the actual control — this is UX.
 */
export function OwnerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const user = getAuthUser();
    if (user?.admin_role === 'owner') {
      setAllowed(true);
    } else {
      router.replace(ROUTES.institutionDashboard);
    }
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}