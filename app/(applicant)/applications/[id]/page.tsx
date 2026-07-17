'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2, Clock, MapPin, IdCard,
  Calendar, GraduationCap, Loader2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageBackLink } from '@/components/shared/page-back-link';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import { api } from '@/lib/api';
import { getToken, getAuthUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

/**
 * Shape from Laravel /api/applications/{id}
 */
interface ApiApplication {
  id: number;
  status: ApplicationStatus;
  personal_statement: string | null;
  submitted_at: string | null;
  decision_at:  string | null;
  student_number: string | null;
  created_at:   string;
  updated_at:   string;
  programme: {
    id:            number;
    name:          string;
    slug:          string;
    qualification: string;
    school:        string;
    duration_years: number;
    study_mode:    string;
    intake:        string;
    institution: {
      id:         number;
      name:       string;
      slug:       string;
      short_name: string;
      city:       string;
    };
  };
}

type ApplicationStatus =
  | 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id     = String(params.id);

  const [application, setApplication] = React.useState<ApiApplication | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiApplication>(`/applications/${id}`, token ?? undefined);
        setApplication(data);
      } catch (err: any) {
        setError(err.message || 'Could not load application.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <PageBackLink href={ROUTES.applications} label="All applications" />
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error || 'Application not found.'}</p>
        </div>
      </div>
    );
  }

  const user        = getAuthUser();
  const programme   = application.programme;
  const institution = programme?.institution;

  return (
    <div>
      <PageBackLink href={ROUTES.applications} label="All applications" />

      {/* Header */}
      <header className="mt-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={application.status} />
          {institution && (
            <span className="text-sm text-ink-50">{institution.short_name}</span>
          )}
        </div>

        <h1 className="font-display text-display-md text-ink leading-tight">
          {programme.name}
        </h1>

        {institution && (
          <p className="mt-2 flex items-center gap-1.5 text-base text-ink-50">
            <MapPin className="size-4 text-ink-30" />
            <Link
              href={ROUTES.institution(institution.slug)}
              className="hover:text-ink transition-colors"
            >
              {institution.name}
            </Link>
            <span>·</span>
            <span>{institution.city}</span>
          </p>
        )}
      </header>

      {/* Body */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">
        <div className="space-y-6">
          {/* Timeline */}
          <Section title="Application progress">
            <Timeline
              status={application.status}
              submittedAt={application.submitted_at}
              decisionAt={application.decision_at}
            />
          </Section>

          {/* What we sent */}
          {user && (
            <Section title="Applicant details">
              <div className="space-y-3 text-sm">
                <Row label="Name"     value={`${user.first_name} ${user.last_name}`} />
                <Row label="Email"    value={user.email} />
                <Row label="NRC"      value={user.nrc || '—'} />
                <Row label="Phone"    value={user.phone || '—'} />
                <Row label="Province" value={user.province || '—'} />
              </div>
            </Section>
          )}

          {/* Personal statement (if provided) */}
          {application.personal_statement && (
            <Section title="Personal statement">
              <p className="text-sm text-ink-70 leading-relaxed whitespace-pre-wrap">
                {application.personal_statement}
              </p>
            </Section>
          )}
        </div>

        {/* SIDE */}
        <aside className="space-y-5 lg:sticky lg:top-24 self-start">
          {/* Acceptance card — with the student's official number */}
          {application.status === 'accepted' && application.decision_at && (
            <div className="rounded-xl bg-gradient-to-br from-brand-700 to-brand-600 p-5 text-white shadow-elevate">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="size-5" />
                <p className="text-xs font-bold uppercase tracking-[0.08em]">Offer received</p>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">
                Congratulations! You&apos;ve been accepted to{' '}
                <strong>{programme.name}</strong>{' '}
                on {formatDate(application.decision_at)}.
              </p>

              {application.student_number && (
                <div className="mt-4 rounded-lg bg-white/10 border border-white/20 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <IdCard className="size-4 text-white/70" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70">
                      Your student number
                    </p>
                  </div>
                  <p className="font-display text-2xl tracking-wide tabular-nums">
                    {application.student_number}
                  </p>
                  <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                    Issued by {institution?.short_name ?? 'the institution'}. Keep it safe —
                    you&apos;ll use it for registration and all official correspondence.
                  </p>
                </div>
              )}
            </div>
          )}

          {application.status === 'rejected' && application.decision_at && (
            <div className="rounded-xl border border-danger/30 bg-danger-soft p-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-danger mb-2">
                Application closed
              </p>
              <p className="text-sm text-ink-70 leading-relaxed">
                This application was not successful. Don&apos;t give up — explore other programmes.
              </p>
            </div>
          )}

          {/* Programme link */}
          {programme && institution && (
            <div className="rounded-xl border border-border bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-50 mb-3">
                Programme details
              </p>
              <h3 className="font-display text-base text-ink leading-tight">{programme.name}</h3>
              <dl className="mt-3 space-y-2 text-xs text-ink-50">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-ink-30" />
                  {programme.duration_years} years · {programme.study_mode}
                </div>
                {programme.intake && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3 text-ink-30" />
                    Intake {programme.intake}
                  </div>
                )}
                {programme.school && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="size-3 text-ink-30" />
                    {programme.school}
                  </div>
                )}
              </dl>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href={ROUTES.programme(programme.slug)}>View programme</Link>
              </Button>
            </div>
          )}

          {/* Dates */}
          <div className="rounded-xl border border-border bg-white p-5 space-y-3 text-sm">
            <Row
              label="Submitted"
              value={application.submitted_at ? formatDate(application.submitted_at) : '—'}
            />
            {application.decision_at && (
              <Row label="Decision" value={formatDate(application.decision_at)} />
            )}
            <Row label="Last updated" value={formatDate(application.updated_at)} />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Helpers */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-ink mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">{label}</span>
      <span className="text-sm text-ink font-medium text-right">{value}</span>
    </div>
  );
}

/* Timeline */

interface TimelineProps {
  status:      ApplicationStatus;
  submittedAt: string | null;
  decisionAt:  string | null;
}

function Timeline({ status, submittedAt, decisionAt }: TimelineProps) {
  const steps = [
    {
      label: 'Application submitted',
      date:  submittedAt,
    },
    {
      label: 'Under review by institution',
      date:  null,
    },
    {
      label: status === 'accepted'
        ? 'Offer extended'
        : status === 'rejected'
          ? 'Application closed'
          : status === 'waitlisted'
            ? 'Waitlisted'
            : 'Decision pending',
      date: decisionAt,
    },
  ];

  const activeIndex =
    status === 'accepted' || status === 'rejected' || status === 'waitlisted' ? 2 :
    status === 'under_review' ? 1 :
    status === 'submitted' ? 0 : 0;

  return (
    <ol className="space-y-5">
      {steps.map((step, i) => {
        const done   = i < activeIndex;
        const active = i === activeIndex;
        const ahead  = i > activeIndex;

        return (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                'grid place-items-center size-8 rounded-full shrink-0 border-2',
                done && 'bg-brand-600 border-brand-600 text-white',
                active && 'bg-white border-brand-600 text-brand-600',
                ahead && 'bg-white border-ink-10 text-ink-30',
              )}>
                {done
                  ? <CheckCircle2 className="size-4" />
                  : active
                    ? <span className="size-2 rounded-full bg-brand-600 animate-pulse" />
                    : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'flex-1 w-px mt-2 mb-1 min-h-[24px]',
                  done ? 'bg-brand-300' : 'bg-ink-10',
                )} />
              )}
            </div>
            <div className="pb-1">
              <p className={cn(
                'text-sm font-semibold',
                active ? 'text-ink' : done ? 'text-ink-70' : 'text-ink-30',
              )}>
                {step.label}
              </p>
              {step.date && <p className="text-xs text-ink-50 mt-0.5">{formatDate(step.date)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}