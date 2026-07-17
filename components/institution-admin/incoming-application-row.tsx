import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/lib/routes';
import { formatRelativeTime } from '@/lib/format';
import type { IncomingApplication } from '@/types/domain';
import { cn } from '@/lib/utils';

interface IncomingApplicationRowProps {
  application: IncomingApplication;
  /** When true, uses the dark institution theme styles */
  dark?: boolean;
  /** Hide the "View" chevron — useful inside cards that are themselves links */
  hideChevron?: boolean;
}

/** Initials extracted from a name */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '')).toUpperCase();
}

/**
 * Requirements-match badge.
 * Colour bands communicate eligibility at a glance:
 *   ≥70  green  — meets/exceeds the published requirements
 *   40–69 amber — borderline (near-misses in the mix)
 *   <40  red    — substantially below requirements
 *   null grey — programme has no requirements to rank against
 */
function MatchBadge({ score, dark }: { score?: number | null; dark?: boolean }) {
  if (score === null || score === undefined) {
    return (
      <span
        className={cn(
          'hidden sm:inline-flex items-center justify-center min-w-[44px] rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
          dark ? 'bg-white/10 text-white/40' : 'bg-ink-5 text-ink-30',
        )}
        title="No requirements to rank against"
      >
        —
      </span>
    );
  }

  const band =
    score >= 70 ? 'bg-success-soft text-success'
    : score >= 40 ? 'bg-warning-soft text-warning'
    : 'bg-danger-soft text-danger';

  return (
    <span
      className={cn(
        'hidden sm:inline-flex items-center justify-center min-w-[44px] rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
        band,
      )}
      title={`Meets ${score}% of entry requirements`}
    >
      {score}%
    </span>
  );
}

export function IncomingApplicationRow({
  application, dark = false, hideChevron = false,
}: IncomingApplicationRowProps) {
  const initials = initialsFrom(application.applicant.fullName);

  return (
    <Link
      href={ROUTES.institutionApplicant(application.id)}
      className={cn(
        'flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0 transition-colors group',
        dark
          ? 'border-white/10 hover:bg-white/5'
          : 'border-border hover:bg-ink-5/60',
      )}
    >
      <div className="grid place-items-center size-10 rounded-md bg-brand-600 text-white font-display text-base shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-semibold truncate',
          dark ? 'text-white' : 'text-ink',
        )}>
          {application.applicant.fullName}
        </p>
        <p className={cn(
          'text-xs truncate',
          dark ? 'text-white/55' : 'text-ink-50',
        )}>
          {application.programmeName}
        </p>
      </div>
      <MatchBadge score={application.matchScore} dark={dark} />
      <span className={cn(
        'hidden sm:inline text-xs mr-1 tabular-nums',
        dark ? 'text-white/40' : 'text-ink-30',
      )}>
        {formatRelativeTime(application.submittedAt)}
      </span>
      <StatusBadge status={application.status} />
      {!hideChevron && (
        <ChevronRight className={cn(
          'size-4 hidden sm:block',
          dark ? 'text-white/30 group-hover:text-white/55' : 'text-ink-30 group-hover:text-ink-50',
        )} />
      )}
    </Link>
  );
}