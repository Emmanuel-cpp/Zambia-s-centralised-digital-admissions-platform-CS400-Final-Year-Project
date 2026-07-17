'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Save, Loader2 } from 'lucide-react';
import { useDraftApplication } from '@/hooks/use-draft-application';
import { ROUTES } from '@/lib/routes';
import { api } from '@/lib/api';
import { getToken, getAuthUser } from '@/lib/auth';
import type { Programme, Institution } from '@/types/domain';
import { cn } from '@/lib/utils';

import { StepConfirm }   from './steps/step-confirm';
import { StepStatement } from './steps/step-statement';
import { StepReview }    from './steps/step-review';
import { StepPayment }   from './steps/step-payment';

const STEPS = [
  { id: 'confirm',   label: 'Confirm' },
  { id: 'statement', label: 'Statement' },
  { id: 'review',    label: 'Review' },
  { id: 'payment',   label: 'Payment' },
] as const;

interface PaymentDue {
  amount:             string;
  platform_fee:       string;
  institution_amount: string;
  currency:           string;
}

interface ApplyWizardProps {
  programme: Programme;
  institution: Institution;
}

export function ApplyWizard({ programme, institution }: ApplyWizardProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  // Set when the draft application is created — drives the payment step.
  const [applicationId, setApplicationId] = React.useState<number | null>(null);
  const [paymentDue, setPaymentDue]       = React.useState<PaymentDue | null>(null);

  const { draft, update, clear, hydrated } = useDraftApplication(programme.slug);

  /* Auth + profile completeness guard. */
  React.useEffect(() => {
    const user = getAuthUser();

    if (!user) {
      router.replace(ROUTES.login);
      return;
    }

    if (!user.profile_complete) {
      router.replace(ROUTES.profileComplete);
      return;
    }

    setAuthChecked(true);
  }, [router]);

  if (!authChecked || !hydrated) {
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

  /**
   * Review → creates the application as a DRAFT on the server.
   * The response carries the fee breakdown; we then advance to the
   * payment step. Only completed payment submits the application.
   */
  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = getToken();
      const response = await api.post<{
        application: { id: number };
        payment_due: PaymentDue;
      }>('/applications', {
        programme_id:       Number(programme.id),
        personal_statement: draft?.statement ?? '',
      }, token ?? undefined);

      setApplicationId(response.application.id);
      setPaymentDue(response.payment_due);
      setSubmitting(false);
      goNext(); // → payment step
    } catch (err: any) {
      setSubmitError(err.message || 'Could not save your application. Please try again.');
      setSubmitting(false);
    }
  }

  /** Called by StepPayment once the payment completes. */
  function handlePaid() {
    const id = applicationId;
    clear();
    router.push(ROUTES.application(String(id)));
  }

  const currentStep = STEPS[stepIndex];

  return (
    <div className="bg-surface min-h-screen pt-20 lg:pt-24">
      {/* Sticky progress header */}
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

      {/* Step body */}
      <main className="container py-10 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {currentStep.id === 'confirm' && (
            <StepConfirm
              programme={programme}
              institution={institution}
              onContinue={() => {
                update({ programmeId: programme.id });
                goNext();
              }}
            />
          )}

          {currentStep.id === 'statement' && (
            <StepStatement
              draft={draft?.statement}
              onSubmit={value => { update({ statement: value }); goNext(); }}
              onBack={goPrev}
            />
          )}

          {currentStep.id === 'review' && (
            <StepReview
              programme={programme}
              institution={institution}
              draft={draft}
              submitting={submitting}
              submitError={submitError}
              onBack={goPrev}
              onSubmit={handleSubmit}
            />
          )}

          {currentStep.id === 'payment' && applicationId && paymentDue && (
            <StepPayment
              applicationId={applicationId}
              paymentDue={paymentDue}
              institutionName={institution.name}
              onPaid={handlePaid}
            />
          )}
        </div>

        {currentStep.id !== 'payment' && (
          <div className="max-w-2xl mx-auto mt-10 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-ink-50">
            <Save className="size-3.5" />
            Your progress is saved automatically.
          </div>
        )}
      </main>
    </div>
  );
}

/* Progress bar */

interface ProgressBarProps {
  steps: typeof STEPS;
  currentIndex: number;
}

function ProgressBar({ steps, currentIndex }: ProgressBarProps) {
  return (
    <ol className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done   = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step.id} className="flex-1 flex items-center gap-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn(
                'grid place-items-center size-7 rounded-full text-xs font-bold shrink-0 transition-colors',
                done   && 'bg-brand-100 text-brand-700',
                active && 'bg-brand-600 text-white',
                !done && !active && 'bg-ink-10 text-ink-50',
              )}>
                {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span className={cn(
                'text-xs font-semibold hidden md:inline truncate',
                active ? 'text-ink' : 'text-ink-50',
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-px transition-colors',
                done ? 'bg-brand-300' : 'bg-ink-10',
              )} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* Reusable footer used by step components */

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
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-white text-sm font-medium text-ink hover:bg-ink-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type={primaryType}
        onClick={onPrimary}
        disabled={primaryDisabled || loading}
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {primaryLabel}
      </button>
    </div>
  );
}