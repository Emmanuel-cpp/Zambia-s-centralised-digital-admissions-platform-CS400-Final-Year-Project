'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface AppTopbarProps {
  variant?: 'applicant' | 'institution' | 'platform';
  onMenuClick?: () => void;
}

const POLL_INTERVAL = 60_000;

export function AppTopbar({
  variant = 'applicant',
  onMenuClick,
}: AppTopbarProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = React.useState(0);

  /* Poll unread notifications (student-facing only). */
  React.useEffect(() => {
    if (variant !== 'applicant') return;

    let timer: ReturnType<typeof setInterval> | null = null;

    async function fetchUnread() {
      try {
        const token = getToken();
        if (!token) return;
        const data = await api.get<{ unread_count: number }>('/notifications', token);
        setUnreadCount(data.unread_count ?? 0);
      } catch { /* silent */ }
    }

    function startPolling() { fetchUnread(); timer = setInterval(fetchUnread, POLL_INTERVAL); }
    function stopPolling()  { if (timer) clearInterval(timer); timer = null; }
    function handleVisibility() { document.hidden ? stopPolling() : startPolling(); }

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [variant]);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center gap-3 sm:gap-4">

        {/* MOBILE: logo on the left */}
        <div className="flex items-center lg:hidden shrink-0">
          <Logo />
        </div>

        {/* DESKTOP: search + public browsing pills (applicant only) */}
        <div className="hidden md:flex items-center flex-1 gap-5 min-w-0">
          <div className="relative w-full max-w-xs shrink">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
            <Input
              placeholder={
                variant === 'institution'
                  ? 'Search applicants, programmes…'
                  : 'Search programmes, institutions…'
              }
              className="pl-9 h-10"
            />
          </div>

          {variant === 'applicant' && (
            <nav className="hidden lg:flex items-center gap-2 shrink-0">
              <TopbarPill href={ROUTES.institutions} label="Institutions" />
              <TopbarPill href={ROUTES.programmes}   label="Programmes" />
              <TopbarPill href="/#how-it-works"      label="How it works" />
              <TopbarPill href="/#faq"               label="FAQs" />
            </nav>
          )}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {/* Notification bell — student-facing only */}
          {variant === 'applicant' && user && (
            <Link
              href={ROUTES.notifications}
              aria-label={unreadCount > 0 ? `Notifications — ${unreadCount} unread` : 'Notifications'}
              className="relative grid place-items-center size-10 rounded-md text-ink-50 hover:bg-ink-5 hover:text-ink transition-colors"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-danger text-white text-[10px] font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* DESKTOP: user chip (identity, no menu — sign-out lives in the sidebar) */}
          {user && (
            <div className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-md">
              <div className="grid place-items-center size-8 rounded-md bg-brand-600 text-white text-xs font-bold">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <span className="text-sm font-medium text-ink hidden sm:inline">
                {user.first_name}
              </span>
            </div>
          )}

          {/* MOBILE: hamburger on the RIGHT (matches public navbar) */}
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="lg:hidden grid place-items-center size-10 rounded-md text-ink-50 hover:bg-ink-5 hover:text-ink transition-colors"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function TopbarPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 hover:border-brand-200 transition-colors whitespace-nowrap"
    >
      {label}
    </Link>
  );
}