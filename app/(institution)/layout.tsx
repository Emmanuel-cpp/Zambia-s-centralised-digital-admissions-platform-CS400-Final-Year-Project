'use client';

import { AppShell } from '@/components/layout/app-shell';
import { RoleGuard } from '@/components/layout/role-guard';

/**
 * Institution admin portal. Access is limited to institution_admin
 * accounts that have completed their forced password change.
 */
export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={['institution_admin']}>
      <AppShell variant="institution">{children}</AppShell>
    </RoleGuard>
  );
}