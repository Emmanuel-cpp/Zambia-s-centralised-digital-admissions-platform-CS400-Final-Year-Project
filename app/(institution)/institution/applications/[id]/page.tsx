'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, IdCard,
  FileText, Check, X, Clock, AlertTriangle, MessageSquare,
  Save, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/lib/routes';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { getIncomingApplicationById } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/domain';

export default function ApplicantDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const application = React.useMemo(
    () => getIncomingApplicationById(params.id),
    [params.id],
  );

  const [status,  setStatus]  = React.useState<ApplicationStatus>(application?.status ?? 'submitted');
  const [note,    setNote]    = React.useState(application?.internalNote ?? '');
  const [saving,  setSaving]  = React.useState(false);
  const [saved,   setSaved]   = React.useState(false);

  if (!application) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <AlertTriangle className="size-7 text-warning mx-auto mb-3" />
        <p className="font-display text-xl text-ink">Application not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  const { applicant } = application;
  const initials = applicant.fullName.trim().split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();

  async function handleSaveDecision() {
    setSaving(true); setSaved(false);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-50 hover:text-ink mb-5 group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to applications
      </button>

      {/* Header */}
      <header className="mb-7 flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="grid place-items-center size-14 rounded-xl bg-brand-600 text-white font-display text-xl shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={status} />
            <span className="text-xs text-ink-50">Submitted {formatRelativeTime(application.submittedAt)}</span>
          </div>
          <h1 className="font-display text-display-md text-ink leading-tight">{applicant.fullName}</h1>
          <p className="mt-1 text-base text-ink-50">
            Applying for <strong className="text-ink">{application.programmeName}</strong>
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <div className="space-y-5">
          <Section title="Contact information">
            <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
              <Field icon={<Mail className="size-3.5" />}     label="Email"         value={applicant.email} />
              <Field icon={<Phone className="size-3.5" />}    label="Phone"         value={applicant.phone} />
              <Field icon={<MapPin className="size-3.5" />}   label="Province"      value={applicant.province} />
              <Field icon={<IdCard className="size-3.5" />}   label="NRC"           value={applicant.nrc} />
              <Field icon={<Calendar className="size-3.5" />} label="Date of birth" value={formatDate(applicant.dateOfBirth)} />
            </dl>
          </Section>

          <Section title="Grade 12 ECZ results">
            <table className="w-full text-sm">
              <tbody>
                {applicant.grades.map(g => (
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

          <Section title="Personal statement">
            <p className="text-sm text-ink-70 leading-relaxed whitespace-pre-wrap">{applicant.statement}</p>
          </Section>

          <Section title="Attached documents">
            <ul className="space-y-2">
              {applicant.documentNames.map(name => (
                <li key={name} className="flex items-center justify-between gap-3 p-3 rounded-md bg-surface-subtle border border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid place-items-center size-8 rounded-md bg-brand-50 text-brand-600 shrink-0">
                      <FileText className="size-3.5" />
                    </div>
                    <span className="text-sm text-ink truncate">{name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-brand-700 hover:bg-brand-50">
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Decision sidebar */}
        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <Section title="Decision">
            <div className="space-y-2 mb-5">
              <DecisionButton icon={<Clock className="size-4" />}         label="Mark under review" value="under_review" current={status} onClick={setStatus} />
              <DecisionButton icon={<Check className="size-4" />}         label="Accept"            value="accepted"     current={status} onClick={setStatus} accent="success" />
              <DecisionButton icon={<AlertTriangle className="size-4" />} label="Waitlist"          value="waitlisted"   current={status} onClick={setStatus} accent="warning" />
              <DecisionButton icon={<X className="size-4" />}             label="Reject"            value="rejected"     current={status} onClick={setStatus} accent="danger" />
            </div>

            <div className="pt-4 border-t border-border">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-50 mb-2">
                <MessageSquare className="size-3" />
                Internal note (not shown to applicant)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
                placeholder="Add a note about this applicant…"
                className="w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm text-ink placeholder:text-ink-30 resize-y min-h-[88px] focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
              />
            </div>

            <Button onClick={handleSaveDecision} disabled={saving} className="w-full mt-3">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save decision'}
            </Button>
          </Section>

          {/* Timeline */}
          <Section title="Timeline">
            <ul className="space-y-2 text-sm">
              <TimelineRow label="Submitted"    value={formatDate(application.submittedAt)} />
              {application.decisionAt && <TimelineRow label="Decided" value={formatDate(application.decisionAt)} />}
              <TimelineRow label="Last updated" value={formatRelativeTime(application.lastUpdated)} />
            </ul>
          </Section>
        </aside>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-ink mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">
        <span className="text-ink-30">{icon}</span>{label}
      </dt>
      <dd className="text-sm font-medium text-ink mt-0.5 truncate">{value}</dd>
    </div>
  );
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex justify-between gap-2">
      <span className="text-ink-50">{label}</span>
      <span className="text-ink font-medium">{value}</span>
    </li>
  );
}

function DecisionButton({ icon, label, value, current, onClick, accent }: {
  icon: React.ReactNode; label: string; value: ApplicationStatus;
  current: ApplicationStatus; onClick: (v: ApplicationStatus) => void;
  accent?: 'success' | 'warning' | 'danger';
}) {
  const active = current === value;
  const activeStyle =
    accent === 'success' ? 'bg-success-soft text-success border-success/30' :
    accent === 'warning' ? 'bg-warning-soft text-warning border-warning/30' :
    accent === 'danger'  ? 'bg-danger-soft text-danger border-danger/30' :
                           'bg-brand-50 text-brand-700 border-brand-200';

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border text-sm font-medium transition-colors',
        active
          ? activeStyle
          : 'bg-white border-border text-ink-50 hover:bg-ink-5 hover:text-ink',
      )}
    >
      {icon}{label}
      {active && <Check className="size-3.5 ml-auto" strokeWidth={3} />}
    </button>
  );
}
