'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const NAV_LINKS = [
  { label: 'Institutions', href: ROUTES.institutions },
  { label: 'Programmes',   href: ROUTES.programmes },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'FAQs',         href: '/#faq' },
] as const;

interface PublicNavbarProps {
  /**
   * When true, the navbar overlays a dark hero with white text (landing page only).
   * When false (default), it renders as a solid white bar with ink text.
   */
  transparent?: boolean;
}

export function PublicNavbar({ transparent = false }: PublicNavbarProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [transparent]);

  React.useEffect(() => { setOpen(false); }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isOverHero  = transparent && !scrolled;
  const isLoggedIn  = !loading && !!user;
  const dashboardHref = user?.role === 'institution_admin'
    ? ROUTES.institutionDashboard
    : ROUTES.dashboard;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          isOverHero
            ? 'bg-transparent'
            : 'bg-white/85 backdrop-blur-md border-b border-border shadow-soft',
        )}
      >
        <div className="container flex h-16 lg:h-18 items-center justify-between gap-3">
          <Logo variant={isOverHero ? 'light' : 'default'} />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-all',
                    isOverHero
                      ? active
                        ? 'bg-white text-brand-700'
                        : 'text-white/85 hover:bg-white/15 hover:text-white'
                      : active
                        ? 'bg-brand-600 text-white'
                        : 'text-ink-70 hover:bg-brand-50 hover:text-brand-700',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs — depends on auth state */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              // Logged in — show user avatar + dashboard link
              <Link
                href={dashboardHref}
                className={cn(
                  'whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all shadow-soft',
                  isOverHero
                    ? 'bg-white text-brand-700 hover:bg-brand-50'
                    : 'bg-brand-600 text-white hover:bg-brand-700',
                )}
              >
                <span className={cn(
                  'grid place-items-center size-6 rounded-full text-xs font-bold',
                  isOverHero ? 'bg-brand-100 text-brand-700' : 'bg-white/20 text-white',
                )}>
                  {user!.first_name[0]}{user!.last_name[0]}
                </span>
                <span>Dashboard</span>
                <LayoutDashboard className="size-3.5" />
              </Link>
            ) : (
              // Logged out — show sign in + apply now
              <>
                <Link
                  href={ROUTES.login}
                  className={cn(
                    'whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors',
                    isOverHero
                      ? 'text-white hover:bg-white/15'
                      : 'text-ink-70 hover:text-ink hover:bg-ink-5',
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href={ROUTES.register}
                  className={cn(
                    'whitespace-nowrap inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full transition-all shadow-soft',
                    isOverHero
                      ? 'bg-white text-brand-700 hover:bg-brand-50'
                      : 'bg-brand-600 text-white hover:bg-brand-700',
                  )}
                >
                  Apply now
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={cn(
              'lg:hidden grid place-items-center size-10 rounded-full transition-colors shrink-0',
              isOverHero
                ? 'bg-white/15 text-white hover:bg-white/25'
                : 'bg-brand-600 text-white hover:bg-brand-700',
            )}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-[60] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className={cn(
            'absolute right-0 top-0 bottom-0 w-[86%] max-w-[360px] bg-white shadow-elevate flex flex-col',
            'transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-border">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid place-items-center size-10 rounded-full bg-ink-5 text-ink hover:bg-ink-10 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {isLoggedIn && (
              <div className="mx-3 mb-4 p-4 rounded-xl bg-brand-50 border border-brand-100">
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center size-10 rounded-full bg-brand-600 text-white font-bold text-sm">
                    {user!.first_name[0]}{user!.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {user!.first_name} {user!.last_name}
                    </p>
                    <p className="text-xs text-ink-50 truncate">{user!.email}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-30">
              Browse
            </p>
            <ul className="space-y-1">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between px-3 py-3.5 rounded-lg text-[15px] font-semibold text-ink hover:bg-brand-50 hover:text-brand-700 transition-colors group"
                  >
                    {link.label}
                    <ArrowRight className="size-4 text-ink-30 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-5 border-t border-border space-y-2.5 bg-surface-subtle">
            {isLoggedIn ? (
              <Link
                href={dashboardHref}
                className="flex items-center justify-center gap-1.5 w-full px-5 py-3.5 text-sm font-semibold rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-soft"
              >
                Go to dashboard
                <LayoutDashboard className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.register}
                  className="flex items-center justify-center gap-1.5 w-full px-5 py-3.5 text-sm font-semibold rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-soft"
                >
                  Apply now
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={ROUTES.login}
                  className="flex items-center justify-center w-full px-5 py-3.5 text-sm font-semibold rounded-full border border-border text-ink hover:bg-white transition-colors"
                >
                  Sign in
                </Link>
                <p className="text-[11px] text-ink-30 text-center pt-2">
                  Free for students · Always
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}