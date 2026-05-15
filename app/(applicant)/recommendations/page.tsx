import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Sparkles, MapPin, ArrowRight, Check, Settings,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { getMyRecommendations, currentUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Recommendation } from '@/types/domain';

export const metadata: Metadata = {
  title: 'Recommendations',
};

export default function RecommendationsPage() {
  const recs = getMyRecommendations();

  return (
    <div>
      <PageHeader
        title="Recommended for you"
        description={`${recs.length} programmes match your grades and interests.`}
        eyebrow="Your matches"
      />

      {/* Explainer */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-5 sm:p-6 mb-7 flex items-start gap-4">
        <div className="grid place-items-center size-10 rounded-lg bg-brand-600 text-white shrink-0">
          <Sparkles className="size-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink mb-1">How recommendations work</p>
          <p className="text-sm text-ink-70 leading-relaxed">
            We compare your ECZ grades against every programme&apos;s minimum requirements,
            then rank by your declared interests:{' '}
            {currentUser.interests.map((int, i) => (
              <span key={int} className="text-ink font-medium">
                {int}{i < currentUser.interests.length - 1 ? ', ' : ''}
              </span>
            ))}.
          </p>
          <Link
            href={ROUTES.profile}
            className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-brand-700 hover:underline"
          >
            <Settings className="size-3" />
            Edit grades or interests
          </Link>
        </div>
      </div>

      {/* Recommendations list */}
      {recs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {recs.map((r, i) => (
            <RecommendationCard key={r.programme.id} recommendation={r} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────
   Recommendation card
───────────────────────────────── */

function RecommendationCard({
  recommendation, rank,
}: { recommendation: Recommendation; rank: number }) {
  const { programme, institution, matchScore, reasons } = recommendation;

  return (
    <article className="rounded-xl border border-border bg-white overflow-hidden transition-all hover:border-brand-200 hover:shadow-card">
      <div className="grid sm:grid-cols-[120px_1fr_auto] gap-5 p-5 sm:p-6 items-start">
        {/* Match score */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
          <MatchRing score={matchScore} />
          <div className="sm:mt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-50">Rank</p>
            <p className="font-display text-lg text-ink leading-none mt-0.5">#{rank}</p>
          </div>
        </div>

        {/* Programme info */}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 bg-brand-50 inline-block rounded-full px-2 py-0.5 mb-2">
            {programme.qualification}
          </p>
          <h3 className="font-display text-xl text-ink leading-tight">
            <Link href={ROUTES.programme(programme.slug)} className="hover:text-brand-700 transition-colors">
              {programme.name}
            </Link>
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-50">
            <MapPin className="size-3.5 text-ink-30" />
            <Link
              href={ROUTES.institution(institution.slug)}
              className="hover:text-ink transition-colors"
            >
              {institution.name}
            </Link>
            <span>·</span>
            <span>{institution.city}</span>
          </p>

          <ul className="mt-4 space-y-1.5">
            {reasons.map(reason => (
              <li key={reason} className="flex items-start gap-2 text-sm text-ink-70">
                <Check className="size-4 text-brand-600 shrink-0 mt-0.5" strokeWidth={3} />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Apply CTA */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <Button asChild>
            <Link href={ROUTES.apply(programme.slug)}>
              Apply
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.programme(programme.slug)}>Learn more</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────
   Match ring (visual score indicator)
───────────────────────────────── */

function MatchRing({ score }: { score: number }) {
  const SIZE = 64;
  const STROKE = 6;
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Colour shifts based on score band
  const stroke =
    score >= 90 ? 'stroke-brand-600' :
    score >= 80 ? 'stroke-brand-500' :
                  'stroke-brand-400';

  return (
    <div className="relative inline-grid place-items-center" style={{ width: SIZE, height: SIZE }}>
      <svg className="absolute inset-0 -rotate-90" width={SIZE} height={SIZE}>
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={radius}
          strokeWidth={STROKE} fill="none"
          className="stroke-ink-10"
        />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={radius}
          strokeWidth={STROKE} fill="none" strokeLinecap="round"
          className={cn('transition-all', stroke)}
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-lg leading-none text-brand-700">{score}<span className="text-xs">%</span></p>
        <p className="text-[8px] font-bold text-ink-50 uppercase tracking-wider mt-0.5">Match</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   Empty state
───────────────────────────────── */

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
      <Sparkles className="size-8 text-ink-30 mx-auto mb-3" />
      <h3 className="font-display text-xl text-ink mb-2">No recommendations yet</h3>
      <p className="text-sm text-ink-50 max-w-sm mx-auto mb-5">
        Add your Grade 12 results and declare your interests to start seeing personalised matches.
      </p>
      <Button asChild>
        <Link href={ROUTES.profile}>Complete your profile</Link>
      </Button>
    </div>
  );
}
