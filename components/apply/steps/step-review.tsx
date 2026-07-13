'use client';

import { AlertCircle } from 'lucide-react';
import { StepFooter } from '../apply-wizard';
import { formatDate } from '@/lib/format';
import { getAuthUser } from '@/lib/auth';
import type { Programme, Institution } from '@/types/domain';
import type { ApplicationDraft } from '@/lib/schemas/application';

interface StepReviewProps {
  programme: Programme;
  institution: Institution;
  draft: ApplicationDraft | null;
  submitting: boolean;
  submitError?: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepReview({
  programme, institution, draft, submitting, submitError, onBack, onSubmit,
}: StepReviewProps) {
  const user      = getAuthUser();
  const statement = draft?.statement ?? '';

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 3 of 3</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Review & submit
        </h1>
        <p className="mt-2 text-base text-ink-50">
          Confirm everything below. After submission, you can&apos;t edit your application.
        </p>
      </header>

      <div className="space-y-5">
        {/* Programme */}
        <Section title="Applying to">
          <p className="font-semibold text-ink">{programme.name}</p>
          <p className="text-sm text-ink-50 mt-0.5">
            {institution.name} · {programme.intake}
          </p>
          {institution.applicationDeadline && (
            <p className="text-xs text-ink-50 mt-1.5">
              Deadline: {formatDate(institution.applicationDeadline)}
            </p>
          )}
        </Section>

        {/* Profile snapshot */}
        {user && (
          <Section title="Your details (from your profile)">
            <dl className="grid grid-cols-2 gap-y-3 gap-x-6">
              <ReviewRow label="Name"     value={`${user.first_name} ${user.last_name}`} />
              <ReviewRow label="Email"    value={user.email} />
              <ReviewRow label="NRC"      value={user.nrc || '—'} />
              <ReviewRow label="Phone"    value={user.phone || '—'} />
              <ReviewRow label="Province" value={user.province || '—'} />
            </dl>
          </Section>
        )}

        {/* Personal statement (optional) */}
        <Section title="Your personal statement (optional)">
          {statement ? (
            <p className="text-sm text-ink-70 leading-relaxed line-clamp-6 whitespace-pre-wrap">
              {statement}
            </p>
          ) : (
            <p className="text-sm italic text-ink-50">
              No statement provided — this won&apos;t affect your application.
            </p>
          )}
        </Section>
      </div>

      {submitError && (
        <div className="mt-6 rounded-lg border border-danger/30 bg-danger-soft p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger leading-relaxed">{submitError}</p>
        </div>
      )}

      <p className="text-xs text-ink-50 mt-6 text-center">
        By submitting, you confirm that all information above is true and accurate.
      </p>

      <StepFooter
        onBack={onBack}
        primaryType="button"
        primaryLabel={submitting ? 'Submitting…' : 'Submit application'}
        loading={submitting}
        onPrimary={onSubmit}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">{label}</dt>
      <dd className="text-sm text-ink mt-0.5 truncate">{value}</dd>
    </div>
  );
}