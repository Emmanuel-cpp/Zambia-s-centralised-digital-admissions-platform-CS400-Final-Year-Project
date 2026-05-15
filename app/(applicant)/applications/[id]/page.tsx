import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2, Clock, MapPin, ArrowRight,
  FileText, Calendar, GraduationCap,
} from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageBackLink } from '@/components/shared/page-back-link';
import { ROUTES } from '@/lib/routes';
import { formatDate } from '@/lib/format';
import {
  getApplicationById, getInstitutionById, getProgrammeBySlug,
  getMyApplications,
} from '@/lib/data';
import { programmes, currentUser, documents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/domain';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const app = getApplicationById(id);
  if (!app) return { title: 'Application not found' };
  return { title: `Application: ${app.programmeName}` };
}

export function generateStaticParams() {
  return getMyApplications().map(a => ({ id: a.id }));
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const application = getApplicationById(id);
  if (!application) notFound();

  const institution = getInstitutionById(application.institutionId);
  const programme   = programmes.find(p => p.id === application.programmeId);

  return (
    <div>
      {/* Back link */}
      <PageBackLink href={ROUTES.applications} label="All applications" />

      {/* Header */}
      <header className="mt-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <StatusBadge status={application.status} />
          {institution && (
            <span className="text-sm text-ink-50">
              {institution.shortName}
            </span>
          )}
        </div>

        <h1 className="font-display text-display-md text-ink leading-tight">
          {application.programmeName}
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
        {/* MAIN */}
        <div className="space-y-6">
          {/* Timeline */}
          <Section title="Application progress">
            <Timeline status={application.status} application={application} />
          </Section>

          {/* What we sent */}
          <Section title="Submitted application">
            <div className="space-y-5 text-sm">
              <Row label="Applicant" value={`${currentUser.firstName} ${currentUser.lastName}`} />
              <Row label="NRC" value={currentUser.nrc} />
              <Row label="Phone" value={currentUser.phone} />
              <Row label="Province" value={currentUser.province} />
              <Row label="Date of birth" value={formatDate(currentUser.dateOfBirth)} />
            </div>
          </Section>

          {/* Grades */}
          {programme && (
            <Section title="Grade 12 ECZ results">
              <table className="w-full text-sm">
                <tbody>
                  {currentUser.grades.map(g => (
                    <tr key={g.subject} className="border-b border-border last:border-b-0">
                      <td className="py-2.5 text-ink-70">{g.subject}</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-md bg-brand-50 text-brand-700 font-bold text-sm">
                          {g.minGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Documents */}
          <Section title="Attached documents">
            <ul className="space-y-2">
              {documents.map(doc => (
                <li
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-md bg-surface-subtle border border-border"
                >
                  <div className="grid place-items-center size-8 rounded-md bg-brand-50 text-brand-600 shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-ink flex-1 truncate">{doc.name}</span>
                  {doc.verified && (
                    <span className="text-[11px] font-semibold text-success bg-success-soft rounded-full px-2 py-0.5">
                      Verified
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* SIDE */}
        <aside className="space-y-5 lg:sticky lg:top-24 self-start">
          {/* Decision card (only when there's one) */}
          {application.status === 'accepted' && application.decisionAt && (
            <div className="rounded-xl bg-gradient-to-br from-brand-700 to-brand-600 p-5 text-white shadow-elevate">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="size-5" />
                <p className="text-xs font-bold uppercase tracking-[0.08em]">Offer received</p>
              </div>
              <p className="text-sm text-white/85 leading-relaxed mb-4">
                Congratulations! You&apos;ve been accepted to <strong>{application.programmeName}</strong>{' '}
                on {formatDate(application.decisionAt)}.
              </p>
              <Button asChild className="w-full bg-white text-brand-700 hover:bg-brand-50">
                <Link href="#">
                  Accept offer
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
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
                  {programme.durationYears} years · {programme.studyMode}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-ink-30" />
                  Intake {programme.intake}
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="size-3 text-ink-30" />
                  {programme.faculty}
                </div>
              </dl>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href={ROUTES.programme(programme.slug)}>View programme</Link>
              </Button>
            </div>
          )}

          {/* Submitted dates */}
          <div className="rounded-xl border border-border bg-white p-5 text-sm">
            <Row label="Submitted" value={application.submittedAt ? formatDate(application.submittedAt) : '—'} />
            {application.decisionAt && (
              <div className="mt-3">
                <Row label="Decision" value={formatDate(application.decisionAt)} />
              </div>
            )}
            <div className="mt-3">
              <Row label="Last updated" value={formatDate(application.lastUpdated)} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   Helpers
───────────────────────────────── */

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

/* ─────────────────────────────────
   Timeline
───────────────────────────────── */

interface TimelineProps {
  status: ApplicationStatus;
  application: { submittedAt?: string; decisionAt?: string };
}

function Timeline({ status, application }: TimelineProps) {
  const steps: { id: ApplicationStatus | 'review'; label: string; date?: string }[] = [
    { id: 'submitted',    label: 'Application submitted', date: application.submittedAt },
    { id: 'review',       label: 'Under review by institution' },
    { id: status === 'accepted' || status === 'rejected' ? status : 'submitted',
      label: status === 'accepted' ? 'Offer extended' : status === 'rejected' ? 'Application closed' : 'Decision pending',
      date: application.decisionAt },
  ];

  // Determine "active" index based on status
  const activeIndex =
    status === 'accepted' || status === 'rejected' ? 2 :
    status === 'under_review' ? 1 :
    status === 'submitted' ? 0 : 0;

  return (
    <ol className="space-y-5">
      {steps.map((step, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const ahead = i > activeIndex;

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
