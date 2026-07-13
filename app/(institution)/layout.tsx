'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { getAuthUser } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

/**
 * Layout for all institution admin pages.
 *
 * Guards that run before any institution page renders:
 *   1. User must be logged in
 *   2. User must have role = institution_admin
 *   3. User must have completed forced password change
 *
 * Each guard redirects to the appropriate place if violated.
 */
export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const user = getAuthUser();

    // Not logged in
    if (!user) {
      router.replace(ROUTES.login);
      return;
    }

    // Wrong role — bounce students out of admin area
    if (user.role !== 'institution_admin') {
      router.replace(ROUTES.dashboard);
      return;
    }

    // Must change password first — block all admin pages
    if (user.must_change_password) {
      router.replace(ROUTES.changePassword);
      return;
    }

    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  return <AppShell variant="institution">{children}</AppShell>;
}