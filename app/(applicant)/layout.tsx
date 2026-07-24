'use client';

import { AppShell } from '@/components/layout/app-shell';
import { RoleGuard } from '@/components/layout/role-guard';

/**
 * Applicant portal. Students only — admins and platform staff are
 * redirected to their own portals.
 */
export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={['student']}>
      <AppShell variant="applicant">{children}</AppShell>
    </RoleGuard>
  );
}