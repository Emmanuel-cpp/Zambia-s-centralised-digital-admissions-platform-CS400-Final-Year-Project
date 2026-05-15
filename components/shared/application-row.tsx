import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { ROUTES } from '@/lib/routes';
import { formatShortDate } from '@/lib/format';
import type { Application } from '@/types/domain';

interface ApplicationRowProps {
  application: Application;
}

export function ApplicationRow({ application }: ApplicationRowProps) {
  const { id, programmeName, institutionName, status, lastUpdated } = application;
  const initial = institutionName.charAt(0);

  return (
    <Link
      href={ROUTES.application(id)}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-b-0 hover:bg-ink-5/60 transition-colors group"
    >
      <div className="grid place-items-center size-10 rounded-md bg-brand-600 text-white font-display text-base shrink-0">
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{programmeName}</p>
        <p className="text-xs text-ink-50 truncate">{institutionName}</p>
      </div>

      <span className="hidden sm:inline text-xs text-ink-30 mr-1">
        {formatShortDate(lastUpdated)}
      </span>

      <StatusBadge status={status} />

      <ChevronRight className="size-4 text-ink-30 group-hover:text-ink-50 hidden sm:block" />
    </Link>
  );
}
