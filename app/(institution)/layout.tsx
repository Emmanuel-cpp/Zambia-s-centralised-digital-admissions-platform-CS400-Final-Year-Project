import { AppShell } from '@/components/layout/app-shell';

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return <AppShell variant="institution">{children}</AppShell>;
}
