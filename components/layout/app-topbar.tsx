'use client';

import Link from 'next/link';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';

interface AppTopbarProps {
  variant?: 'applicant' | 'institution';
  /** Called when the user taps the hamburger (mobile/tablet) */
  onMenuClick?: () => void;
}

/**
 * AppTopbar — top bar across every portal page.
 *
 * Layout:
 *   [hamburger* + logo*]    [search (md+)]    [notifications]
 *
 *   * hamburger and logo are only visible below lg — at lg+ the sidebar
 *     handles branding, so this side of the topbar is empty.
 *
 * The avatar/account dropdown was intentionally removed — profile and sign-out
 * already live in the sidebar, and removing the avatar gives more breathing
 * room on small screens.
 */
export function AppTopbar({
  variant = 'applicant',
  onMenuClick,
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-white/85 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">

        {/* Left cluster — hamburger + logo (mobile/tablet only) */}
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

        {/* Search (md+ only) */}
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

        {/* Right cluster — notifications only */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <Link
            href={variant === 'applicant' ? ROUTES.notifications : '#'}
            aria-label="Notifications"
            className="relative grid place-items-center size-10 rounded-md text-ink-50 hover:bg-ink-5 hover:text-ink transition-colors"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-warning" />
          </Link>
        </div>
      </div>
    </header>
  );
}