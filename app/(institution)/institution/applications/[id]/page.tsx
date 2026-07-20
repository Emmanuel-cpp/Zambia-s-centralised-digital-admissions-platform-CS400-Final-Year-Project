'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, IdCard,
  FileText, Check, X, Clock, AlertTriangle, MessageSquare,
  Save, Loader2, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/lib/routes';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/types/domain';

/**
 * Shape returned by /api/admin/applications/{id}
 */
interface ApiAdminApplicationDetail {
  id: number;
  status: ApplicationStatus;
  personal_statement: string | null;
  internal_note: string | null;
  submitted_at: string | null;
  decision_at:  string | null;
  created_at:   string;
  updated_at:   string;
  user: {
    id:            number;
    first_name:    string;
    last_name:     string;
    full_name:     string;
    email:         string;
    nrc:           string | null;
    phone:         string | null;
    province:      string | null;
    date_of_birth: string | null;
    documents: {
      id:                  number;
      name:                string;
      type:                string;
      path:                string;
      verified:            boolean;
      verification_status: string;
      confidence_score:    number | null;
    }[];
  };
  programme: {
    id:    number;
    name:  string;
    slug:  string;
    requirements: { subject: string; min_grade: number }[];
  };
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Mirror of the backend decision state machine (the API enforces it;
 * this drives the UI). Acceptance is terminal: the offer has been
 * communicated and a student number issued. Rejections are reversible
 * (appeals); waitlist promotion is the standard path when seats open.
 */
const ALLOWED_TRANSITIONS: Record<string, ApplicationStatus[]> = {
  submitted:    ['under_review', 'accepted', 'rejected', 'waitlisted'],
  under_review: ['accepted', 'rejected', 'waitlisted'],
  waitlisted:   ['accepted', 'rejected'],
  rejected:     ['waitlisted', 'accepted'],
  accepted:     [],
};

export default function ApplicantDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [application, setApplication] = React.useState<ApiAdminApplicationDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [status, setStatus] = React.useState<ApplicationStatus>('submitted');
  const [note, setNote]     = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved]   = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  /* Load the application from API */
  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiAdminApplicationDetail>(
          `/admin/applications/${params.id}`,
          token ?? undefined,
        );
        setApplication(data);
        setStatus(data.status);
        setNote(data.internal_note ?? '');
      } catch (err: any) {
        setLoadError(err.message || 'Could not load this application.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleSaveDecision() {
    if (!application) return;

    setSaving(true);
    setSaved(false);
    setSaveError(null);

    try {
      const token = getToken();
      const updated = await api.put<ApiAdminApplicationDetail>(
        `/admin/applications/${application.id}`,
        {
          status,
          internal_note: note,
        },
        token ?? undefined,
      );

      // Merge the partial response back into our state so dates etc. update
      setApplication(prev => prev ? { ...prev, ...updated, user: prev.user } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setSaveError(err.message || 'Could not save the decision. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (loadError || !application) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <AlertTriangle className="size-7 text-warning mx-auto mb-3" />
        <p className="font-display text-xl text-ink">
          {loadError || 'Application not found.'}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

      const applicant    = application.user;
      const programme    = application.programme;
      const documents    = applicant.documents ?? [];
      const fullName     = applicant.full_name || `${applicant.first_name ?? ''} ${applicant.last_name ?? ''}`.trim() || 'Unknown';
      const initials     = fullName
        .split(/\s+/)
        .map(p => p[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase() || '?';
      const requirements = programme.requirements ?? [];

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
            {application.submitted_at && (
              <span className="text-xs text-ink-50">
                Submitted {formatRelativeTime(application.submitted_at)}
              </span>
            )}
          </div>
          <h1 className="font-display text-display-md text-ink leading-tight">
            {fullName}
          </h1>
          <p className="mt-1 text-base text-ink-50">
            Applying for <strong className="text-ink">{programme.name}</strong>
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <div className="space-y-5">
          <Section title="Contact information">
            <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
              <Field icon={<Mail     className="size-3.5" />} label="Email"         value={applicant.email} />
              <Field icon={<Phone    className="size-3.5" />} label="Phone"         value={applicant.phone || '—'} />
              <Field icon={<MapPin   className="size-3.5" />} label="Province"      value={applicant.province || '—'} />
              <Field icon={<IdCard   className="size-3.5" />} label="NRC"           value={applicant.nrc || '—'} />
              <Field icon={<Calendar className="size-3.5" />} label="Date of birth" value={applicant.date_of_birth ? formatDate(applicant.date_of_birth) : '—'} />
            </dl>
          </Section>

          {requirements.length > 0 && (
            <Section title="Programme requirements">
              <p className="text-xs text-ink-50 mb-3">
                Minimum ECZ grades required for this programme.
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {requirements.map(req => (
                    <tr key={req.subject} className="border-b border-border last:border-b-0">
                      <td className="py-2.5 text-ink-70">{req.subject}</td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-md bg-brand-50 text-brand-700 font-bold text-sm">
                          {req.min_grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {application.personal_statement && (
            <Section title="Personal statement">
              <p className="text-sm text-ink-70 leading-relaxed whitespace-pre-wrap">
                {application.personal_statement}
              </p>
            </Section>
          )}

          <Section title={`Attached documents (${documents.length})`}>
            {documents.length === 0 ? (
              <p className="text-sm text-ink-50 italic">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {documents.map(doc => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-md bg-surface-subtle border border-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid place-items-center size-8 rounded-md bg-brand-50 text-brand-600 shrink-0">
                        <FileText className="size-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {documentTypeLabel(doc.type)}
                        </p>
                        <p className="text-xs text-ink-50 truncate">{doc.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {doc.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-soft border border-success/20 rounded-full px-2 py-0.5">
                          <ShieldCheck className="size-3" />
                          AI Verified
                        </span>
                      )}
                      <Link
                        href={`${BACKEND_URL}/storage/${doc.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-700 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {/* Decision sidebar */}
        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <Section title="Decision">
            {application.status === 'accepted' ? (
              /* Terminal state — offer communicated, number issued */
              <div className="rounded-lg bg-success-soft border border-success/30 p-4 mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="size-4 text-success" />
                  <p className="text-sm font-semibold text-ink">Offer extended — final</p>
                </div>
                <p className="text-xs text-ink-70 leading-relaxed">
                  This applicant has been accepted and notified
                  {application.decision_at ? ` on ${formatDate(application.decision_at)}` : ''}.
                  Accepted offers cannot be reversed from here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-5">
                <DecisionButton
                  icon={<Clock className="size-4" />}
                  label="Mark under review"
                  value="under_review"
                  current={status}
                  savedStatus={application.status}
                  onClick={setStatus}
                />
                <DecisionButton
                  icon={<Check className="size-4" />}
                  label="Accept"
                  value="accepted"
                  current={status}
                  savedStatus={application.status}
                  onClick={setStatus}
                  accent="success"
                />
                <DecisionButton
                  icon={<AlertTriangle className="size-4" />}
                  label="Waitlist"
                  value="waitlisted"
                  current={status}
                  savedStatus={application.status}
                  onClick={setStatus}
                  accent="warning"
                />
                <DecisionButton
                  icon={<X className="size-4" />}
                  label="Reject"
                  value="rejected"
                  current={status}
                  savedStatus={application.status}
                  onClick={setStatus}
                  accent="danger"
                />
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <label
                htmlFor="internal-note"
                className="flex items-center gap-1.5 text-xs font-semibold text-ink-50 mb-2"
              >
                <MessageSquare className="size-3" />
                Internal note (not shown to applicant)
              </label>
              <textarea
                id="internal-note"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
                placeholder="Add a note about this applicant…"
                className="w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm text-ink placeholder:text-ink-30 resize-y min-h-[88px] focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
              />
            </div>

            {saveError && (
              <div className="mt-3 rounded-md bg-danger-soft border border-danger/20 px-3 py-2 text-xs text-danger">
                {saveError}
              </div>
            )}

            <Button
              onClick={handleSaveDecision}
              disabled={saving}
              className="w-full mt-3"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save decision
                </>
              )}
            </Button>
          </Section>

          <Section title="Timeline">
            <ul className="space-y-2 text-sm">
              {application.submitted_at && (
                <TimelineRow label="Submitted" value={formatDate(application.submitted_at)} />
              )}
              {application.decision_at && (
                <TimelineRow label="Decided" value={formatDate(application.decision_at)} />
              )}
              <TimelineRow label="Last updated" value={formatRelativeTime(application.updated_at)} />
            </ul>
          </Section>
        </aside>
      </div>
    </>
  );
}

/* ─────────────────────────────────
   Helpers
───────────────────────────────── */

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

      function DecisionButton({
  icon, label, value, current, savedStatus, onClick, accent,
}: {
  icon:        React.ReactNode;
  label:       string;
  value:       ApplicationStatus;
  current:     ApplicationStatus;
  savedStatus: ApplicationStatus;
  onClick:     (v: ApplicationStatus) => void;
  accent?:     'success' | 'warning' | 'danger';
}) {
  const active = current === value;

  // A move is permitted if it's staying put, or the state machine allows
  // the transition from the SAVED status (not the on-screen selection).
  const permitted =
    value === savedStatus ||
    (ALLOWED_TRANSITIONS[savedStatus] ?? []).includes(value);

  const colorStyles =
    accent === 'success' ? 'bg-success hover:bg-success/90 text-white'   :
    accent === 'warning' ? 'bg-warning hover:bg-warning/90 text-white'   :
    accent === 'danger'  ? 'bg-danger  hover:bg-danger/90  text-white'   :
                           'bg-brand-600 hover:bg-brand-700 text-white';

  return (
    <button
      type="button"
      onClick={() => permitted && onClick(value)}
      disabled={!permitted}
      title={permitted ? undefined : `Not available from "${savedStatus.replace('_', ' ')}"`}
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-sm font-semibold transition-colors',
        colorStyles,
        active && 'ring-2 ring-offset-2 ring-ink/20',
        !permitted && 'opacity-35 cursor-not-allowed hover:bg-none',
      )}
    >
      {icon}{label}
      {active && <Check className="size-3.5 ml-auto" strokeWidth={3} />}
    </button>
  );
}
function documentTypeLabel(type: string): string {
  switch (type) {
    case 'nrc_front':   return 'NRC — Front';
    case 'nrc_back':    return 'NRC — Back';
    case 'certificate': return 'Grade 12 Certificate';
    case 'photo':       return 'Passport Photo';
    default:            return type;
  }
}