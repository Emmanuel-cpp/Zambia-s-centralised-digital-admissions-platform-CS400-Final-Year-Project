'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles, MapPin, ArrowRight, Check, Settings,
  Loader2, AlertCircle, RefreshCw, Bot,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { api } from '@/lib/api';
import { getToken, getAuthUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

/* Shape returned by /api/recommendations */
interface ApiRecommendation {
  match_score: number;
  reasons: string[];
  programme: {
    id:             number;
    slug:           string;
    name:           string;
    qualification:  string;
    school:         string;
    duration_years: number;
    study_mode:     string;
  };
  institution: {
    id:         number;
    slug:       string;
    name:       string;
    short_name: string;
    city:       string;
    province:   string;
  };
}

interface ApiResponse {
  recommendations: ApiRecommendation[];
  reasoning_note:  string | null;
}

export default function RecommendationsPage() {
  const [data, setData]       = React.useState<ApiResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);
  const [profileIncomplete, setProfileIncomplete] = React.useState(false);

  async function loadRecommendations() {
    setLoading(true);
    setError(null);
    setProfileIncomplete(false);

    try {
      const token = getToken();
      const response = await api.get<ApiResponse>('/recommendations', token ?? undefined);
      setData(response);
    } catch (err: any) {
      // If the backend says profile incomplete, show a dedicated CTA
      if (err?.message?.toLowerCase().includes('profile')) {
        setProfileIncomplete(true);
      } else {
        setError(err.message || 'Could not load recommendations.');
      }
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadRecommendations();
  }, []);

  const user = getAuthUser();

  return (
    <div>
      <PageHeader
        eyebrow="Your matches"
        title="Recommended for you"
        description="AI-powered programme matches based on your grades and profile."
        actions={
          !loading && (
            <Button variant="outline" onClick={loadRecommendations}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          )
        }
      />

      {/* AI explainer banner */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-5 sm:p-6 mb-7 flex items-start gap-4">
        <div className="grid place-items-center size-10 rounded-lg bg-brand-600 text-white shrink-0">
          <Bot className="size-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink mb-1">How recommendations work</p>
        <p className="text-sm text-ink-70 leading-relaxed">
          ZamAdmit&apos;s AI advisor analyzes your ECZ Grade 12 results,
          declared interests, and academic strengths against every currently open programme.
          It ranks the best fits and explains why each one suits you personally.
        </p>
          <Link
            href={ROUTES.profile}
            className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-brand-700 hover:underline"
          >
            <Settings className="size-3" />
            Update your profile for better matches
          </Link>
        </div>
      </div>

      {/* States */}
      {loading && <LoadingState />}

      {!loading && profileIncomplete && <ProfileIncompleteState />}

      {!loading && error && <ErrorState message={error} onRetry={loadRecommendations} />}

      {!loading && !error && !profileIncomplete && data && (
        <>
          {data.reasoning_note && (
            <div className="rounded-lg border border-border bg-white p-4 mb-5 flex items-start gap-3">
              <Sparkles className="size-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="text-sm text-ink-70 italic leading-relaxed">
                {data.reasoning_note}
              </p>
            </div>
          )}

          {data.recommendations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {data.recommendations.map((r, i) => (
                <RecommendationCard
                  key={r.programme.slug}
                  recommendation={r}
                  rank={i + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────
   Recommendation card
───────────────────────────────── */

function RecommendationCard({
  recommendation, rank,
}: { recommendation: ApiRecommendation; rank: number }) {
  const { programme, institution, match_score, reasons } = recommendation;

  return (
    <article className="rounded-xl border border-border bg-white overflow-hidden transition-all hover:border-brand-200 hover:shadow-card">
      <div className="grid sm:grid-cols-[120px_1fr_auto] gap-5 p-5 sm:p-6 items-start">
        {/* Match score ring */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
          <MatchRing score={match_score} />
          <div className="sm:mt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-50">Rank</p>
            <p className="font-display text-lg text-ink leading-none mt-0.5">#{rank}</p>
          </div>
        </div>

        {/* Programme info */}
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 bg-brand-50 inline-block rounded-full px-2 py-0.5 mb-2">
            {programme.qualification} · {programme.school}
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
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-ink-70">
                <Check className="size-4 text-brand-600 shrink-0 mt-0.5" strokeWidth={3} />
                <span>{reason}</span>
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
   Match ring
───────────────────────────────── */

function MatchRing({ score }: { score: number }) {
  const SIZE = 64;
  const STROKE = 6;
  const radius = (SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  const stroke =
    score >= 85 ? 'stroke-brand-600' :
    score >= 70 ? 'stroke-brand-500' :
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
   States
───────────────────────────────── */

function LoadingState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
      <div className="flex items-center justify-center gap-2.5 mb-3">
        <Bot className="size-5 text-brand-600 animate-pulse" />
        <Loader2 className="size-5 text-brand-600 animate-spin" />
      </div>
      <p className="font-display text-lg text-ink">Analyzing your profile…</p>
      <p className="text-sm text-ink-50 mt-2 max-w-sm mx-auto">
        Our AI is reviewing your grades against every open programme to find your best matches.
      </p>
    </div>
  );
}

function ProfileIncompleteState() {
  return (
    <div className="rounded-xl border border-warning/30 bg-warning-soft p-8 text-center">
      <AlertCircle className="size-7 text-warning mx-auto mb-3" />
      <h3 className="font-display text-xl text-ink mb-2">Complete your profile first</h3>
      <p className="text-sm text-ink-70 max-w-md mx-auto mb-5">
        We need your Grade 12 results and basic info to generate personalized recommendations.
      </p>
      <Button asChild>
        <Link href={ROUTES.profileComplete}>Complete profile</Link>
      </Button>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger-soft p-8 text-center">
      <AlertCircle className="size-7 text-danger mx-auto mb-3" />
      <h3 className="font-display text-xl text-ink mb-2">Could not load recommendations</h3>
      <p className="text-sm text-ink-70 max-w-md mx-auto mb-5">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-12 text-center">
      <Sparkles className="size-8 text-ink-30 mx-auto mb-3" />
      <h3 className="font-display text-xl text-ink mb-2">No matches yet</h3>
      <p className="text-sm text-ink-50 max-w-sm mx-auto mb-5">
        There aren&apos;t any programmes currently accepting applications that match your profile.
        Check back during the next admission cycle.
      </p>
      <Button asChild variant="outline">
        <Link href={ROUTES.programmes}>Browse all programmes</Link>
      </Button>
    </div>
  );
}