import { AppShell } from '@/components/layout/app-shell';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return <AppShell variant="applicant">{children}</AppShell>;
}
