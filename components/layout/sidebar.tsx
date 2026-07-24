'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ClipboardList, Sparkles, User,
  FileText, Bell, LogOut, GraduationCap, Settings, X, Users, ScrollText, Building2, ShieldCheck, Plus
} from 'lucide-react';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { clearAuth, getAuthUser, type AuthUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface NavItem {
  label: string;
  href:  string;
  icon:  React.ComponentType<{ className?: string }>;
}
interface NavGroup {
  label: string;
  items: NavItem[];
}

/* Applicant nav (static) */
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

const PLATFORM_NAV: NavGroup[] = [
  {
    label: 'Platform',
    items: [
      { label: 'Overview',     href: ROUTES.platformDashboard,    icon: LayoutDashboard },
      { label: 'Institutions', href: ROUTES.platformInstitutions, icon: Building2 },
      { label: 'Activity',     href: ROUTES.platformActivity,     icon: ScrollText },
    ],
  },
];

/**
 * Institution nav — role-aware. Officers/viewers cannot see (or reach) the
 * owner-only sections. The API middleware is the actual control; this
 * simply hides what the user cannot use.
 */
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
  variant?: 'applicant' | 'institution' | 'platform';
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

export function Sidebar({
  variant = 'applicant',
  drawerOpen,
  onDrawerClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  React.useEffect(() => { setAuthUser(getAuthUser()); }, []);

  const groups =
    variant === 'applicant' ? APPLICANT_NAV
    : variant === 'platform' ? PLATFORM_NAV
    : institutionNavFor(authUser?.admin_role);

  const initials = authUser
    ? `${authUser.first_name?.[0] ?? ''}${authUser.last_name?.[0] ?? ''}`.toUpperCase()
    : '';

  async function handleSignOut() {
    // Best-effort server-side token invalidation, then always clear locally.
    try {
      const token = getToken();
      if (token) await api.post('/logout', {}, token);
    } catch {
      /* server logout is best-effort */
    }
    clearAuth();
    onDrawerClose();
    router.push(ROUTES.login);
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Desktop sidebar */}
<aside
        className="hidden lg:flex flex-col w-[244px] shrink-0 border-r border-border bg-white sticky top-0 h-screen"
        aria-label="Primary navigation"
      >
        <SidebarBody
          groups={groups}
          isActive={isActive}
          onSignOut={handleSignOut}
          desktop
        />
      </aside>

      {/* Mobile drawer */}
      <div
        aria-hidden={!drawerOpen}
        className={cn(
          'lg:hidden fixed inset-0 z-[60] transition-opacity duration-300',
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onDrawerClose}
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {/* Drawer header: user identity, replacing the old logo-only strip */}
          <div className="h-20 px-4 flex items-center gap-3 border-b border-border shrink-0">
            {authUser ? (
              <>
                <div className="grid place-items-center size-11 rounded-lg bg-brand-600 text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    {authUser.first_name} {authUser.last_name}
                  </p>
                  <p className="text-xs text-ink-50 truncate">{authUser.email}</p>
                </div>
              </>
            ) : (
              <Logo />
            )}
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={onDrawerClose}
              className="grid place-items-center size-9 rounded-md text-ink-50 hover:bg-ink-5 hover:text-ink shrink-0"
            >
              <X className="size-5" />
            </button>
          </div>

          <SidebarBody
            groups={groups}
            isActive={isActive}
            onSignOut={handleSignOut}
            onNavigate={onDrawerClose}
          />
        </div>
      </div>
    </>
  );
}

/* Shared body used by both desktop rail and mobile drawer */

function SidebarBody({
  groups, isActive, onSignOut, onNavigate, desktop,
}: {
  groups:      NavGroup[];
  isActive:    (href: string) => boolean;
  onSignOut:   () => void;
  onNavigate?: () => void;
  desktop?:    boolean;
}) {
  return (
    <>
      {desktop && (
        <div className="h-16 px-4 flex items-center border-b border-border">
          <Logo />
        </div>
      )}

      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && 'mt-6')}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-30">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        active
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-ink-70 hover:bg-ink-5 hover:text-ink',
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sign out — red, unambiguous, at the bottom */}
      <div className="mt-auto p-3 border-t border-border">
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-semibold text-danger hover:bg-danger-soft transition-colors"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </>
  );
}