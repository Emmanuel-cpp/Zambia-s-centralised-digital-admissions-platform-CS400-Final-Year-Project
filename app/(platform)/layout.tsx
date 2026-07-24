'use client';

import { AppShell } from '@/components/layout/app-shell';
import { RoleGuard } from '@/components/layout/role-guard';

/**
 * ZamAdmit platform administration portal.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={['platform_admin']}>
      <AppShell variant="platform">{children}</AppShell>
    </RoleGuard>
  );
}