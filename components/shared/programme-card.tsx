import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import type { Programme } from '@/types/domain';
import { cn } from '@/lib/utils';

interface ProgrammeCardProps {
  programme: Programme;
  /** Display variant — 'list' is denser, 'card' has more whitespace */
  variant?: 'list' | 'card';
  /**
   * Whether the institution offering this programme is currently accepting
   * applications. When provided, a status badge is shown on the card.
   */
  isOpen?: boolean;
}

export function ProgrammeCard({ programme, variant = 'list', isOpen }: ProgrammeCardProps) {
  const { slug, name, qualification, faculty, durationYears, studyMode, intake, tags } = programme;

  return (
    <Link
      href={ROUTES.programme(slug)}
      className={cn(
        'group block border border-border bg-white rounded-lg transition-all',
        'hover:border-brand-200 hover:shadow-card hover:-translate-y-0.5',
        variant === 'list' ? 'p-5' : 'p-6',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-700">
              {qualification} · {faculty}
            </p>
            {/* Open/closed status badge (shown only when isOpen is provided) */}
            {isOpen === true && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-soft border border-success/30 text-success text-[10px] font-bold px-2 py-0.5">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Open
              </span>
            )}
            {isOpen === false && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink-5 border border-border text-ink-50 text-[10px] font-bold px-2 py-0.5">
                Closed
              </span>
            )}
          </div>

          <h3 className="font-display text-lg sm:text-xl text-ink leading-tight">
            {name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-50">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-ink-30" />
              {durationYears} years · {studyMode}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-ink-30" />
              {intake}
            </span>
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold text-ink-50 bg-ink-5 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <ArrowRight className="size-4 text-ink-30 mt-1 shrink-0 transition-all group-hover:text-brand-600 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}