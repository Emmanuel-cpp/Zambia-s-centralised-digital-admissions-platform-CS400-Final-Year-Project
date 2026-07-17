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
  variant?: 'applicant' | 'institution';
  onMenuClick?: () => void;
}

/** How often the topbar re-checks for new notifications (ms). */
const POLL_INTERVAL = 60_000;

export function AppTopbar({
  variant = 'applicant',
  onMenuClick,
}: AppTopbarProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = React.useState(0);

  /* Poll unread notifications.
     Lightweight: a single indexed COUNT query server-side.
     Runs on mount + every POLL_INTERVAL, and stops when the tab
     is hidden (visibilitychange) to save requests. */
  React.useEffect(() => {
    // Notifications are student-facing for now
    if (variant !== 'applicant') return;

    let timer: ReturnType<typeof setInterval> | null = null;

    async function fetchUnread() {
      try {
        const token = getToken();
        if (!token) return;
        const data = await api.get<{ unread_count: number }>(
          '/notifications',
          token,
        );
        setUnreadCount(data.unread_count ?? 0);
      } catch {
        // Silent — a failed poll should never disturb the user
      }
    }

    function startPolling() {
      fetchUnread();
      timer = setInterval(fetchUnread, POLL_INTERVAL);
    }

    function stopPolling() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function handleVisibility() {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    }

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [variant]);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 lg:hidden shrink-0">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="grid place-items-center size-10 rounded-md text-ink-50 hover:bg-ink-5 hover:text-ink transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <Logo />
        </div>

        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
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
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {variant === 'applicant' && (
            <Link
              href={ROUTES.notifications}
              aria-label={
                unreadCount > 0
                  ? `Notifications — ${unreadCount} unread`
                  : 'Notifications'
              }
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

          {user && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
              <div className="grid place-items-center size-8 rounded-md bg-brand-600 text-white text-xs font-bold">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <span className="text-sm font-medium text-ink hidden sm:inline">
                {user.first_name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}