'use client';

import { usePathname } from 'next/navigation';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/welcome';

  // Auth pages render full-bleed without navbar or footer
  if (isAuthPage) {
    return <>{children}</>;
  }
  return (
    <>
      <PublicNavbar transparent={isLanding} />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}