import type { ApplicationStatus } from '@/types/domain';

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft:        'Draft',
  submitted:    'Submitted',
  under_review: 'Under review',
  accepted:     'Accepted',
  rejected:     'Rejected',
  waitlisted:   'Waitlisted',
};

export const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  draft:        'bg-ink-10 text-ink-70',
  submitted:    'bg-info-soft text-info',
  under_review: 'bg-warning-soft text-warning',
  accepted:     'bg-success-soft text-success',
  rejected:     'bg-danger-soft text-danger',
  waitlisted:   'bg-warning-soft text-warning',
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  });
}

/**
 * Casual relative time, suitable for notification timestamps.
 * Examples: "just now", "12 minutes ago", "3 hours ago", "2 days ago", "1 May 2025"
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now  = new Date();
  const diffMs = now.getTime() - date.getTime();
  const sec  = Math.floor(diffMs / 1000);
  const min  = Math.floor(sec / 60);
  const hr   = Math.floor(min / 60);
  const day  = Math.floor(hr  / 24);

  if (sec < 30)        return 'just now';
  if (min < 1)         return `${sec}s ago`;
  if (min < 60)        return `${min} minute${min === 1 ? '' : 's'} ago`;
  if (hr  < 24)        return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  if (day < 7)         return `${day} day${day === 1 ? '' : 's'} ago`;
  return formatDate(iso);
}
