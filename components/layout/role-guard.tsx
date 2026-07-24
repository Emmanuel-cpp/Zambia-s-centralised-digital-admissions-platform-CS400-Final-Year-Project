'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAuthUser } from '@/lib/auth';
import { ROUTES, homeRouteFor } from '@/lib/routes';

type Role = 'student' | 'institution_admin' | 'platform_admin';

/**
 * Portal entry guard. Runs before any page in a portal renders:
 *   1. Signed out           → login
 *   2. Wrong portal         → the user's own home
 *   3. Forced password change pending → change-password
 *
 * The API middleware is the actual authorization control; this exists so
 * users never land on a page whose every request would 403.
 */
export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const user = getAuthUser();

    if (!user) {
      router.replace(ROUTES.login);
      return;
    }

    if (!allow.includes(user.role as Role)) {
      router.replace(homeRouteFor(user.role));
      return;
    }

    if (user.must_change_password) {
      router.replace(ROUTES.changePassword);
      return;
    }

    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}