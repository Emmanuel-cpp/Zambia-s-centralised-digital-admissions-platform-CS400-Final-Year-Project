'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { AppTopbar } from './app-topbar';

interface AppShellProps {
  variant?: 'applicant' | 'institution';
  children: React.ReactNode;
}

/**
 * AppShell — wraps any portal page in the standard layout.
 *
 * Above lg: permanent sidebar + topbar + main content.
 * Below lg: sidebar collapses to a slide-in drawer, hamburger lives in the topbar.
 *
 * Shell owns the drawer-open state and passes it to both Sidebar and AppTopbar
 * so the hamburger button can open the drawer.
 */
export function AppShell({ variant = 'applicant', children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        variant={variant}
        drawerOpen={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <AppTopbar
          variant={variant}
          onMenuClick={() => setDrawerOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 animate-fade-in-up">
          <div className="mx-auto w-full max-w-[1280px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   PageHeader — standard page intro
───────────────────────────────── */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
  variant?: 'applicant' | 'institution';
}

export function PageHeader({
  title, description, actions, eyebrow,
}: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-600 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-ink-50">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}