import Link from 'next/link';
import { Inbox, Eye, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/app-shell';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/lib/routes';
import { formatRelativeTime } from '@/lib/format';
import { getIncomingApplications } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { IncomingApplication } from '@/types/domain';

export const metadata: Metadata = { title: 'Decisions pipeline' };

export default function DecisionsPage() {
  const all = getIncomingApplications();

  const toReview = all.filter(a => a.status === 'submitted');
  const reviewed = all.filter(a => a.status === 'under_review');
  const decided  = all.filter(a => ['accepted', 'rejected', 'waitlisted'].includes(a.status));

  return (
    <>
      <PageHeader
        eyebrow="Workflow"
        title="Decisions pipeline"
        description="Process applications by stage. Click any card to review and decide."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Column
          title="To review"
          subtitle="Newly submitted"
          icon={<Inbox className="size-5" />}
          accent="bg-info-soft text-info"
          items={toReview}
        />
        <Column
          title="Under review"
          subtitle="Being evaluated"
          icon={<Eye className="size-5" />}
          accent="bg-warning-soft text-warning"
          items={reviewed}
        />
        <Column
          title="Decided"
          subtitle="Accepted, rejected, or waitlisted"
          icon={<CheckCircle2 className="size-5" />}
          accent="bg-success-soft text-success"
          items={decided}
        />
      </div>
    </>
  );
}

function Column({
  title, subtitle, icon, accent, items,
}: {
  title: string; subtitle: string; icon: React.ReactNode;
  accent: string; items: IncomingApplication[];
}) {
  return (
    <div className="flex flex-col">
      <div className="rounded-xl border border-border bg-white p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('grid place-items-center size-9 rounded-md shrink-0', accent)}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              {title} <span className="text-ink-30 font-normal">({items.length})</span>
            </p>
            <p className="text-xs text-ink-50">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-xs text-ink-30">No applications here.</p>
          </div>
        ) : (
          items.map(app => <PipelineCard key={app.id} application={app} />)
        )}
      </div>
    </div>
  );
}

function PipelineCard({ application }: { application: IncomingApplication }) {
  const initials = application.applicant.fullName
    .trim().split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Link href={ROUTES.institutionApplicant(application.id)} className="block group">
      <div className="rounded-xl border border-border bg-white p-4 hover:border-brand-200 hover:shadow-card transition-all">
        <div className="flex items-start gap-3">
          <div className="grid place-items-center size-9 rounded-md bg-brand-600 text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate group-hover:text-brand-700 transition-colors">
              {application.applicant.fullName}
            </p>
            <p className="text-xs text-ink-50 truncate mt-0.5">{application.programmeName}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-ink-30">{formatRelativeTime(application.submittedAt)}</span>
          <StatusBadge status={application.status} />
        </div>

        {application.internalNote && (
          <p className="mt-3 pt-3 border-t border-border text-xs text-ink-50 italic line-clamp-2">
            "{application.internalNote}"
          </p>
        )}
      </div>
    </Link>
  );
}
