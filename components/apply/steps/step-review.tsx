'use client';

import { Pencil, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepFooter } from '../apply-wizard';
import { documents } from '@/lib/mock-data';
import { formatDate } from '@/lib/format';
import type { Programme, Institution } from '@/types/domain';
import type { ApplicationDraft } from '@/lib/schemas/application';

interface StepReviewProps {
  programme: Programme;
  institution: Institution;
  draft: ApplicationDraft | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepReview({
  programme, institution, draft, submitting, onBack, onSubmit,
}: StepReviewProps) {
  const personal = draft?.personal;
  const grades = draft?.grades?.rows ?? [];
  const statement = draft?.statement ?? '';
  const docIds = draft?.documentIds ?? [];
  const attachedDocs = documents.filter(d => docIds.includes(d.id));

  // Light-touch completeness check (the wizard validates each step strictly,
  // but a user could navigate between steps via "back" so we do a final guard)
  const incomplete =
    !personal || grades.length === 0 || statement.length < 150 || attachedDocs.length === 0;

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 6 of 6</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Review & submit
        </h1>
        <p className="mt-2 text-base text-ink-50">
          Take a moment to verify everything below. After submission, you can&apos;t edit your answers.
        </p>
      </header>

      <div className="space-y-5">
        {/* Programme */}
        <Section title="Applying to" stepNumber={1}>
          <p className="font-semibold text-ink">{programme.name}</p>
          <p className="text-sm text-ink-50 mt-0.5">
            {institution.name} · {programme.intake}
          </p>
        </Section>

        {/* Personal */}
        <Section title="Personal information" stepNumber={2}>
          {personal ? (
            <dl className="grid grid-cols-2 gap-y-3 gap-x-6">
              <ReviewRow label="Name"     value={`${personal.firstName} ${personal.lastName}`} />
              <ReviewRow label="DOB"       value={formatDate(personal.dateOfBirth)} />
              <ReviewRow label="NRC"       value={personal.nrc} />
              <ReviewRow label="Phone"     value={personal.phone} />
              <ReviewRow label="Province"  value={personal.province} />
            </dl>
          ) : <Missing />}
        </Section>

        {/* Grades */}
        <Section title="Grade 12 results" stepNumber={3}>
          {grades.length > 0 ? (
            <div className="space-y-1.5">
              {grades.map((g, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink-70">{g.subject}</span>
                  <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-md bg-brand-50 text-brand-700 font-bold text-xs">
                    {g.grade}
                  </span>
                </div>
              ))}
            </div>
          ) : <Missing />}
        </Section>

        {/* Statement */}
        <Section title="Personal statement" stepNumber={4}>
          {statement ? (
            <p className="text-sm text-ink-70 leading-relaxed line-clamp-5 whitespace-pre-wrap">
              {statement}
            </p>
          ) : <Missing />}
        </Section>

        {/* Documents */}
        <Section title="Attached documents" stepNumber={5}>
          {attachedDocs.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-ink-70">
              {attachedDocs.map(d => (
                <li key={d.id}>· {d.name}</li>
              ))}
            </ul>
          ) : <Missing />}
        </Section>
      </div>

      {incomplete && (
        <div className="mt-6 rounded-lg border border-warning/30 bg-warning-soft p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-ink-70 leading-relaxed">
            Some sections look incomplete. Use the <strong>Back</strong> button to fill them in before submitting.
          </p>
        </div>
      )}

      <p className="text-xs text-ink-50 mt-6 text-center">
        By submitting, you confirm that all information above is true and accurate.
      </p>

      <StepFooter
        onBack={onBack}
        primaryType="button"
        primaryLabel="Submit application"
        primaryDisabled={incomplete}
        loading={submitting}
        onPrimary={onSubmit}
      />
    </div>
  );
}

/* ─────────────────────────────────
   Helpers
───────────────────────────────── */

function Section({
  title, stepNumber, children,
}: { title: string; stepNumber: number; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button
          type="button"
          onClick={() => {
            // Smooth UX: just emits a hint; user uses Back chain. Keeping it visual only for now.
          }}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-50 hover:text-brand-700 cursor-default"
          aria-label={`Edit ${title}`}
          tabIndex={-1}
        >
          <Pencil className="size-3" />
          Step {stepNumber}
        </button>
      </div>
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

function Missing() {
  return (
    <p className="text-sm italic text-ink-30">Not yet filled in.</p>
  );
}
