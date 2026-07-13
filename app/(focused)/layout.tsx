'use client';

import { usePathname } from 'next/navigation';
import { PublicNavbar } from '@/components/layout/public-navbar';

/**
 * (focused) route group — for full-attention tasks like the apply wizard.
 *
 * Most focused routes (like apply) include the public navbar so the user
 * keeps brand context and a way out. The change-password route is an
 * exception — it's a forced security action and should have zero distractions
 * (no nav, no escape routes other than the form itself).
 */
export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav  = pathname === '/change-password';

  return (
    <div className="min-h-screen bg-surface">
      {!hideNav && <PublicNavbar transparent={false} />}
      {children}
    </div>
  );
}