'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDraftApplication } from '@/hooks/use-draft-application';
import { ROUTES } from '@/lib/routes';
import type { Programme, Institution } from '@/types/domain';
import { cn } from '@/lib/utils';

// Step components (defined in separate files)
import { StepConfirm }     from './steps/step-confirm';
import { StepPersonal }    from './steps/step-personal';
import { StepGrades }      from './steps/step-grades';
import { StepStatement }   from './steps/step-statement';
import { StepDocuments }   from './steps/step-documents';
import { StepReview }      from './steps/step-review';

const STEPS = [
  { id: 'confirm',   label: 'Confirm' },
  { id: 'personal',  label: 'Personal' },
  { id: 'grades',    label: 'Grades' },
  { id: 'statement', label: 'Statement' },
  { id: 'documents', label: 'Documents' },
  { id: 'review',    label: 'Review' },
] as const;

interface ApplyWizardProps {
  programme: Programme;
  institution: Institution;
}

export function ApplyWizard({ programme, institution }: ApplyWizardProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const { draft, update, clear, hydrated } = useDraftApplication(programme.slug);

  // Wait for draft hydration before rendering any form (avoids flash of empty state)
  if (!hydrated) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  function goNext() {
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goPrev() {
    setStepIndex(i => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    setSubmitting(true);
    // Simulate the API call — replace with real fetch later
    await new Promise(r => setTimeout(r, 1200));
    // Discard the draft now that we've "submitted"
    clear();
    setSubmitting(false);
    // Redirect to a "submitted" confirmation; using app-1 as a stand-in id
    router.push(ROUTES.application('app-1'));
  }

  const currentStep = STEPS[stepIndex];

  return (
    <div className="bg-surface min-h-screen pt-20 lg:pt-24">
      {/* ── Sticky progress header ── */}
      <header className="sticky top-16 lg:top-18 z-20 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link
              href={ROUTES.programme(programme.slug)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-50 hover:text-ink"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to programme</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <p className="text-xs text-ink-50">
              <span className="hidden sm:inline">Applying to{' '}</span>
              <strong className="text-ink">{programme.name}</strong>
              <span className="text-ink-30 hidden md:inline"> · {institution.shortName}</span>
            </p>
          </div>

          <ProgressBar steps={STEPS} currentIndex={stepIndex} />
        </div>
      </header>

      {/* ── Step body ── */}
      <main className="container py-10 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {currentStep.id === 'confirm' && (
            <StepConfirm
              programme={programme}
              institution={institution}
              onContinue={() => { update({ programmeId: programme.id }); goNext(); }}
            />
          )}

          {currentStep.id === 'personal' && (
            <StepPersonal
              draft={draft?.personal}
              onSubmit={(values) => { update({ personal: values }); goNext(); }}
              onBack={goPrev}
            />
          )}

          {currentStep.id === 'grades' && (
            <StepGrades
              programme={programme}
              draft={draft?.grades}
              onSubmit={(values) => { update({ grades: values }); goNext(); }}
              onBack={goPrev}
            />
          )}

          {currentStep.id === 'statement' && (
            <StepStatement
              draft={draft?.statement}
              onSubmit={(value) => { update({ statement: value }); goNext(); }}
              onBack={goPrev}
            />
          )}

          {currentStep.id === 'documents' && (
            <StepDocuments
              draft={draft?.documentIds}
              onSubmit={(values) => { update({ documentIds: values }); goNext(); }}
              onBack={goPrev}
            />
          )}

          {currentStep.id === 'review' && (
            <StepReview
              programme={programme}
              institution={institution}
              draft={draft}
              submitting={submitting}
              onBack={goPrev}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Save-draft note */}
        <div className="max-w-2xl mx-auto mt-10 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-ink-50">
          <Save className="size-3.5" />
          Your progress is saved automatically. You can close this page and return any time.
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────
   ProgressBar — 6-step indicator
───────────────────────────────── */

interface ProgressBarProps {
  steps: typeof STEPS;
  currentIndex: number;
}

function ProgressBar({ steps, currentIndex }: ProgressBarProps) {
  return (
    <ol className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className="flex-1 flex items-center gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  'grid place-items-center size-7 rounded-full text-xs font-bold shrink-0 transition-colors',
                  done   && 'bg-brand-100 text-brand-700',
                  active && 'bg-brand-600 text-white',
                  !done && !active && 'bg-ink-10 text-ink-50',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs font-semibold hidden md:inline truncate',
                  active ? 'text-ink' : 'text-ink-50',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px transition-colors',
                  done ? 'bg-brand-300' : 'bg-ink-10',
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ─────────────────────────────────
   Reusable footer used by every step
───────────────────────────────── */

interface StepFooterProps {
  onBack?: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  loading?: boolean;
  primaryType?: 'submit' | 'button';
  onPrimary?: () => void;
}

export function StepFooter({
  onBack, primaryLabel = 'Continue', primaryDisabled, loading,
  primaryType = 'submit', onPrimary,
}: StepFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-border">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={primaryType}
        onClick={onPrimary}
        disabled={primaryDisabled || loading}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {primaryLabel}
        {!loading && <ArrowRight className="size-4" />}
      </Button>
    </div>
  );
}
