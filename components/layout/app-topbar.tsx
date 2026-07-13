'use client';

import Link from 'next/link';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks/use-auth';

interface AppTopbarProps {
  variant?: 'applicant' | 'institution';
  onMenuClick?: () => void;
}

export function AppTopbar({
  variant = 'applicant',
  onMenuClick,
}: AppTopbarProps) {
  const { user } = useAuth();

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
          <Link
            href={variant === 'applicant' ? ROUTES.notifications : '#'}
            aria-label="Notifications"
            className="relative grid place-items-center size-10 rounded-md text-ink-50 hover:bg-ink-5 hover:text-ink transition-colors"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-warning" />
          </Link>

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