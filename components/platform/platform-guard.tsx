'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

/**
 * Restricts the platform portal to ZamAdmit platform administrators.
 * The API middleware is the real control; this prevents non-platform
 * users from ever seeing the portal shell.
 */
export function PlatformGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.replace(ROUTES.login);
    } else if (user.role !== 'platform_admin') {
      router.replace(
        user.role === 'institution_admin'
          ? ROUTES.institutionDashboard
          : ROUTES.dashboard,
      );
    } else {
      setAllowed(true);
    }
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}