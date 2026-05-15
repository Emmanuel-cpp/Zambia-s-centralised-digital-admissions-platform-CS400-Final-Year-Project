import Link from 'next/link';
import {
  ClipboardList, ArrowRight, Plus, Search,
} from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import { getMyApplications } from '@/lib/data';
import type { Application } from '@/types/domain';

export const metadata: Metadata = {
  title: 'My applications',
};

export default function ApplicationsPage() {
  const all = getMyApplications();

  const submitted = all.filter(a => a.status !== 'draft');
  const drafts    = all.filter(a => a.status === 'draft');

  return (
    <div>
      <PageHeader
        eyebrow="My applications"
        title="Applications"
        description="Every application you've started or submitted, in one place."
        actions={
          <Button asChild>
            <Link href={ROUTES.institutions}>
              <Plus className="size-4" />
              New application
            </Link>
          </Button>
        }
      />

      {/* Submitted */}
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
            description="When you submit an application, it will appear here so you can track its status."
            ctaLabel="Browse institutions"
            ctaHref={ROUTES.institutions}
          />
        ) : (
          <ul className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border">
            {submitted.map(app => <ApplicationRow key={app.id} application={app} />)}
          </ul>
        )}
      </section>

      {/* Drafts */}
      {drafts.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg font-semibold text-ink">
              Drafts{' '}
              <span className="text-ink-50 font-normal">({drafts.length})</span>
            </h2>
            <p className="text-xs text-ink-50">Saved on this device</p>
          </div>

          <ul className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border">
            {drafts.map(app => <ApplicationRow key={app.id} application={app} />)}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ─────────────────────────────────
   Row
───────────────────────────────── */

function ApplicationRow({ application }: { application: Application }) {
  const isDraft = application.status === 'draft';
  const href = isDraft
    ? ROUTES.institutions   // drafts don't have a real detail page yet
    : ROUTES.application(application.id);

  return (
    <li>
      <Link
        href={href}
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

/* ─────────────────────────────────
   Empty state
───────────────────────────────── */

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