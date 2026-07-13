'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ClipboardList, ArrowRight, Plus, Search, Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

/**
 * Shape Laravel returns from /api/applications:
 * {
 *   id, user_id, programme_id, status, personal_statement,
 *   submitted_at, decision_at, created_at, updated_at,
 *   programme: { id, name, slug, institution: { id, name, slug, ... } }
 * }
 */
interface ApiApplication {
  id: number;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  submitted_at: string | null;
  decision_at:  string | null;
  created_at:   string;
  updated_at:   string;
  programme: {
    id:   number;
    name: string;
    slug: string;
    institution: {
      id:    number;
      name:  string;
      slug:  string;
      short_name: string;
    };
  };
}

/**
 * UI-flattened shape used by the row component.
 */
interface UiApplication {
  id: string;
  programmeName:   string;
  institutionName: string;
  status:          ApiApplication['status'];
  submittedAt:     string | null;
  decisionAt:      string | null;
}

function mapApplication(api: ApiApplication): UiApplication {
  return {
    id:              String(api.id),
    programmeName:   api.programme?.name ?? 'Unknown programme',
    institutionName: api.programme?.institution?.name ?? 'Unknown institution',
    status:          api.status,
    submittedAt:     api.submitted_at,
    decisionAt:      api.decision_at,
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState<UiApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data  = await api.get<ApiApplication[]>('/applications', token ?? undefined);
        setApplications(data.map(mapApplication));
      } catch (err: any) {
        setError(err.message || 'Could not load your applications.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const submitted = applications.filter(a => a.status !== 'draft');
  const drafts    = applications.filter(a => a.status === 'draft');

  return (
    <div>
      <PageHeader
        eyebrow="My applications"
        title="Applications"
        description="Every application you've submitted, in one place."
      actions={
        <Button asChild>
          <Link href={ROUTES.programmes}>
            <Plus className="size-4" />
            Browse programmes
          </Link>
        </Button>
      }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 text-brand-600 animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-5">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="mb-8">
            <div className="flex items-end justify-between mb-3">
              <h2 className="text-lg font-semibold text-ink">
                Submitted{' '}
                <span className="text-ink-50 font-normal">({submitted.length})</span>
              </h2>
            </div>

            {submitted.length === 0 ? (
        <EmptyCard
          title="No applications yet"
          description="Browse programmes to find one that fits you. Once you submit an application, it will appear here."
          ctaLabel="Browse programmes"
          ctaHref={ROUTES.programmes}
        />
            ) : (
              <ul className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border">
                {submitted.map(app => <ApplicationRow key={app.id} application={app} />)}
              </ul>
            )}
          </section>

          {drafts.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-3">
                <h2 className="text-lg font-semibold text-ink">
                  Drafts{' '}
                  <span className="text-ink-50 font-normal">({drafts.length})</span>
                </h2>
              </div>

              <ul className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border">
                {drafts.map(app => <ApplicationRow key={app.id} application={app} />)}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────
   Row
───────────────────────────────── */

function ApplicationRow({ application }: { application: UiApplication }) {
  return (
    <li>
      <Link
        href={ROUTES.application(application.id)}
        className="flex items-center gap-4 px-5 py-4 hover:bg-ink-5/60 transition-colors group"
      >
        <div className="grid place-items-center size-10 rounded-md bg-brand-50 text-brand-600 shrink-0">
          <ClipboardList className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate group-hover:text-brand-700 transition-colors">
            {application.programmeName}
          </p>
          <p className="text-xs text-ink-50 truncate mt-0.5">
            {application.institutionName}
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-0.5 text-xs text-ink-50 mr-2">
          {application.submittedAt && (
            <span>Submitted {formatDate(application.submittedAt)}</span>
          )}
          {application.decisionAt && (
            <span className="text-ink-30">Decided {formatDate(application.decisionAt)}</span>
          )}
        </div>

        <StatusBadge status={application.status} />

        <ArrowRight className="size-4 text-ink-30 group-hover:text-ink-50 transition-colors hidden sm:block" />
      </Link>
    </li>
  );
}

function EmptyCard({
  title, description, ctaLabel, ctaHref,
}: { title: string; description: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-10 sm:p-12 text-center">
      <div className="grid place-items-center size-12 rounded-full bg-white border border-border mx-auto mb-4">
        <Search className="size-5 text-ink-50" />
      </div>
      <h3 className="font-display text-xl text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-50 max-w-sm mx-auto">{description}</p>
      <Button asChild className="mt-6">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}