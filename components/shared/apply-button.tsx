'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

interface ApplyButtonProps {
  programmeSlug: string;
  /** When true renders a full-width button (e.g. inside a card) */
  fullWidth?: boolean;
  size?: 'md' | 'lg' | 'sm';
  className?: string;
}

/**
 * Apply button with auth + profile-completion gate.
 *
 * Three states:
 *   - Not logged in  → "Sign in to apply" → /login
 *   - Logged in, profile incomplete → "Complete profile to apply" → /profile/complete
 *   - Logged in, profile complete   → "Apply now" → /apply/{slug}
 *
 * This is the single source of truth for apply-gating. Use this component
 * everywhere an "Apply" action is needed.
 */
export function ApplyButton({
  programmeSlug, fullWidth, size = 'md', className,
}: ApplyButtonProps) {
  const { user, loading } = useAuth();

  // Loading state — wait until we know who the user is
  if (loading) {
    return (
      <Button
        size={size}
        disabled
        className={cn(fullWidth && 'w-full', className)}
      >
        <Loader2 className="size-4 animate-spin" />
        Loading…
      </Button>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Button
        asChild
        size={size}
        variant="outline"
        className={cn(fullWidth && 'w-full', className)}
      >
        <Link href={ROUTES.login}>
          <LogIn className="size-4" />
          Sign in to apply
        </Link>
      </Button>
    );
  }

  // Logged in but profile incomplete
  if (!user.profile_complete) {
    return (
      <div className={cn(fullWidth && 'w-full')}>
        <Button
          asChild
          size={size}
          variant="outline"
          className={cn(
            'w-full border-warning/40 text-warning hover:bg-warning-soft hover:text-warning hover:border-warning/40',
            className,
          )}
        >
          <Link href={ROUTES.profileComplete}>
            <AlertCircle className="size-4" />
            Complete profile to apply
          </Link>
        </Button>
        <p className="text-xs text-ink-50 mt-2 text-center leading-relaxed">
          Your profile needs to be complete before you can apply.{' '}
          <Link href={ROUTES.profileComplete} className="text-brand-700 font-semibold hover:underline">
            Complete it now →
          </Link>
        </p>
      </div>
    );
  }

  // Logged in + profile complete — show normal apply button
  return (
    <Button
      asChild
      size={size}
      className={cn(fullWidth && 'w-full', className)}
    >
      <Link href={ROUTES.apply(programmeSlug)}>
        Apply now
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}