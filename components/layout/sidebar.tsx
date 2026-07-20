'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ClipboardList, Sparkles, User,
  FileText, Bell, LogOut, GraduationCap, Settings, X, Users, ScrollText
} from 'lucide-react';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getToken, clearAuth, getAuthUser} from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const APPLICANT_NAV: NavGroup[] = [
  {
    label: 'Apply',
    items: [
      { label: 'Dashboard',       href: ROUTES.dashboard,       icon: LayoutDashboard },
      { label: 'Recommendations', href: ROUTES.recommendations, icon: Sparkles },
      { label: 'Applications',    href: ROUTES.applications,    icon: ClipboardList },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile',       href: ROUTES.profile,       icon: User },
      { label: 'Documents',     href: ROUTES.documents,     icon: FileText },
      { label: 'Notifications', href: ROUTES.notifications, icon: Bell },
    ],
  },
];

function institutionNavFor(adminRole: string | null | undefined): NavGroup[] {
  const items: NavItem[] = [
    { label: 'Dashboard',    href: ROUTES.institutionDashboard,    icon: LayoutDashboard },
    { label: 'Programmes',   href: ROUTES.institutionProgrammes,   icon: GraduationCap },
    { label: 'Applications', href: ROUTES.institutionApplications, icon: ClipboardList },
  ];

if (adminRole === 'owner') {
    items.push({ label: 'Activity', href: ROUTES.institutionActivity, icon: ScrollText });
    items.push({ label: 'Team',     href: ROUTES.institutionTeam,     icon: Users });
    items.push({ label: 'Settings', href: ROUTES.institutionSettings, icon: Settings });
  }

  return [{ label: 'Administration', items }];
}

interface SidebarProps {
  variant: 'applicant' | 'institution';
  /** Whether the mobile drawer is open (only meaningful below lg) */
  drawerOpen?: boolean;
  /** Called when the user dismisses the drawer */
  onDrawerClose?: () => void;
}

/**
 * Sidebar — shared across applicant and institution portals.
 *
 */
export function Sidebar({
  variant, drawerOpen = false, onDrawerClose,
}: SidebarProps) {
  const pathname = usePathname();
  const authUser = getAuthUser();
  const groups = variant === 'applicant'
    ? APPLICANT_NAV
    : institutionNavFor(authUser?.admin_role);

  // Close drawer on route change
  React.useEffect(() => {
    if (drawerOpen) onDrawerClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* Desktop sidebar — permanent above lg */}
      <aside className="hidden lg:flex flex-col w-[244px] shrink-0 border-r border-border bg-white sticky top-0 h-screen">
        <SidebarBranding />
        <SidebarNav groups={groups} pathname={pathname} />
        <SidebarSignOut />
      </aside>

      {/* Mobile drawer — visible below lg, controlled by drawerOpen */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-[60] transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          onClick={onDrawerClose}
        />

        {/* Drawer panel — slides in from LEFT (matches sidebar position) */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            'absolute left-0 top-0 bottom-0 w-[86%] max-w-[300px] bg-white shadow-elevate flex flex-col',
            'transition-transform duration-300 ease-out',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={onDrawerClose}
              className="grid place-items-center size-10 rounded-full bg-ink-5 text-ink hover:bg-ink-10 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          <SidebarNav groups={groups} pathname={pathname} />
          <SidebarSignOut />
        </aside>
      </div>
    </>
  );
}

/* ─────────────────────────────────
   Shared inner pieces
───────────────────────────────── */

function SidebarBranding() {
  return (
    <div className="h-16 px-5 flex items-center border-b border-border">
      <Logo />
    </div>
  );
}

function SidebarNav({
  groups, pathname,
}: { groups: NavGroup[]; pathname: string }) {
  return (
    <nav className="flex-1 px-3 py-5 overflow-y-auto">
      {groups.map(group => (
        <div key={group.label} className="mb-6">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-30">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href
                || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-50 hover:bg-ink-5 hover:text-ink',
                    )}
                  >
                    <Icon className={cn(
                      'size-[18px] shrink-0',
                      active ? 'text-brand-600' : 'text-ink-30',
                    )} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const token = getToken();
      if (token) {
        await api.post('/logout', {}, token);
      }
    } catch {
      // Ignore errors — clear local auth regardless
    } finally {
      clearAuth();
      router.push(ROUTES.home);
    }
  }

  return (
    <div className="p-3 border-t border-border">
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-ink-30 hover:bg-ink-5 hover:text-ink-70 transition-colors"
      >
        <LogOut className="size-[18px]" />
        Sign out
      </button>
    </div>
  );
}