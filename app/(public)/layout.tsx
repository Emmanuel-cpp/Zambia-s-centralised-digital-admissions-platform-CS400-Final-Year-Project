'use client';

import { usePathname } from 'next/navigation';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';

/**
 * Public-side layout wrapper.
 *
 * - On `/`: navbar is transparent (overlaying the dark hero).
 * - On `/login` and `/register`: navbar + footer hidden entirely so the
 *   auth pages render as standalone, focused conversion screens.
 * - Everywhere else: solid white navbar with footer.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';

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